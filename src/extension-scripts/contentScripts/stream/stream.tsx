import { choosePlatformComponentStyles } from "./helpers";
const VITE_API_BASE_ENDPOINT = import.meta.env.VITE_API_BASE_ENDPOINT;

let io: any;
(async () => {
  const socketio = await import("socket.io-client");
  io = socketio.default;
  // console log timestamp when socket.io-client is loaded
  console.log("socket.io-client loaded at", new Date().toLocaleTimeString());
})();

class StreamHandler {
  private socket: any;
  private localStream: any;
  private peerConnection: any;
  private selectedAudioDeviceId: string | null = null;
  private selectedVideoDeviceId: string | null = null;
  private remoteVideoElement: HTMLVideoElement | null = null;
  private pendingCandidates: RTCIceCandidate[] = [];
  private localVideoElement: HTMLVideoElement | null = null;

  constructor() {
    chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
      if (message.type === "startStream") {
        console.log("message.link 1", message.link);
        this.injectChoosePlatformComponent(message.link);
      }
    });
  }

  // Function to start the streaming process
  private async startStream(link: string) {
    // TODO: change this into its own content-script
    try {
      this.socket = io(VITE_API_BASE_ENDPOINT);
    } catch (e) {
      console.log(e);
    }

    try {
      const constraints = {
        video: this.selectedVideoDeviceId
          ? { deviceId: this.selectedVideoDeviceId }
          : true,
        audio: this.selectedAudioDeviceId
          ? { deviceId: this.selectedAudioDeviceId }
          : true,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.displayStream(this.localStream, false);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      return;
    }
    console.log("message link 3", link);
    this.socket.emit("join-room", { link });

    this.socket.on("user-connected", async (data: any) => {
      console.log(
        "User connected:",
        data.link,
        new Date().toLocaleTimeString()
      );
      await this.initializePeerConnection(data.link);
      await this.createAndSendOffer(data.link);
    });

    this.socket.on("offer", async (data: any) => {
      console.log("Received offer from:", data.link);
      await this.initializePeerConnection(data.link);
      await this.receiveAndAnswerOffer(data);
    });

    this.socket.on("answer", async (data: any) => {
      console.log("Received answer from:", data.link);
      await this.receiveAnswer(data);
    });

    this.socket.on("ice-candidate", async (data: any) => {
      console.log("Received ICE candidate from:", data.link);
      await this.addIceCandidate(data);
    });
  }

  // Inject Choose Platform component into the DOM
  private injectChoosePlatformComponent = async (link: string) => {
    console.log("Injecting ChooseSettings component");

    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter(
      (device) => device.kind === "audioinput"
    );
    const videoInputs = devices.filter(
      (device) => device.kind === "videoinput"
    );

    const container = document.createElement("div");
    container.classList.add("custom-container");
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.backgroundColor = "white";
    container.style.padding = "10px";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    container.style.zIndex = "1000";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";

    const createSelectElement = (
      labelText: string,
      devices: MediaDeviceInfo[],
      onChange: (event: Event) => void
    ) => {
      const label = document.createElement("label");
      label.textContent = labelText;
      label.classList.add("label");

      const select = document.createElement("select");
      select.classList.add("select");

      devices.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.textContent =
          device.label || `${labelText} ${devices.indexOf(device) + 1}`;
        select.appendChild(option);
      });

      select.addEventListener("change", onChange);

      container.appendChild(label);
      container.appendChild(select);
    };

    createSelectElement("Audio Input", audioInputs, (event: Event) => {
      this.selectedAudioDeviceId = (event.target as HTMLSelectElement).value;
    });

    createSelectElement("Video Input", videoInputs, (event: Event) => {
      this.selectedVideoDeviceId = (event.target as HTMLSelectElement).value;
    });

    const startButton = document.createElement("button");
    startButton.textContent = "Start Streaming";
    startButton.classList.add("custom-button");

    startButton.addEventListener("click", () => {
      this.startStream(link);
      document.body.removeChild(container);
    });

    container.appendChild(startButton);
    document.body.appendChild(container);

    const style = document.createElement("style");
    style.classList.add("custom-style");
    style.textContent = choosePlatformComponentStyles;
    document.head.appendChild(style);
  };

  // Initialize the peer connection
  private async initializePeerConnection(link: string) {
    this.peerConnection = new RTCPeerConnection();

    this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
      this.peerConnection.addTrack(track, this.localStream);
      console.log("Added track to peer connection");
    });

    this.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        this.socket.emit("ice-candidate", { link, candidate: event.candidate });
        console.log("Sent ICE candidate");
      }
    };

    this.peerConnection.ontrack = (event: RTCTrackEvent) => {
      console.log("Received remote stream");
      this.displayStream(event.streams[0], true);
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      if (this.peerConnection.iceConnectionState === "connected") {
        console.log("ICE Connection State: connected");
      }
    };
  }

  // Create and send an offer to the remote peer
  private async createAndSendOffer(link: string) {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socket.emit("offer", { link, offer });
      console.log("Created and sent offer", offer);
    } catch (error) {
      console.error("Error creating and sending offer:", error);
    }
  }

  // Receive and answer an offer from the remote peer
  private async receiveAndAnswerOffer(data: any) {
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit("answer", { link: data.link, answer });
      console.log("Received and answered offer", answer);

      // Add queued ICE candidates
      this.pendingCandidates.forEach(async (candidate) => {
        await this.peerConnection.addIceCandidate(candidate);
        console.log("Added queued ICE candidate", candidate);
      });
      this.pendingCandidates = [];
    } catch (error) {
      console.error("Error receiving and answering offer:", error);
    }
  }

  // Receive an answer from the remote peer
  private async receiveAnswer(data: any) {
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      console.log("Received answer", data.answer);

      // Add queued ICE candidates
      this.pendingCandidates.forEach(async (candidate) => {
        await this.peerConnection.addIceCandidate(candidate);
        console.log("Added queued ICE candidate", candidate);
      });
      this.pendingCandidates = [];
    } catch (error) {
      console.error("Error receiving answer:", error);
    }
  }

  // Add ICE candidate to the peer connection
  private async addIceCandidate(data: any) {
    try {
      if (this.peerConnection.remoteDescription) {
        await this.peerConnection.addIceCandidate(data.candidate);
        console.log("Received and added ICE candidate");
      } else {
        console.log(
          "Received ICE candidate before remote description was set. Queueing it."
        );
        this.pendingCandidates.push(data.candidate);
      }
    } catch (error) {
      console.error("Error adding received ice candidate:", error);
    }
  }

  private displayStream(stream: MediaStream, isRemote: boolean) {
    if (!stream) {
      console.error("Invalid MediaStream provided");
      return;
    }

    console.log("Displaying stream", stream);

    // Check if the stream has any tracks
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) {
      console.error("No video track found in the MediaStream");
      return;
    }

    if (!this.remoteVideoElement) {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.top = "10px";
      container.style.right = "10px";
      container.style.zIndex = "9999";
      container.style.backgroundColor = "transparent"; // Remove background color
      container.style.padding = "0"; // Remove padding
      container.style.border = "none"; // Remove border

      this.remoteVideoElement = document.createElement("video");
      this.remoteVideoElement.autoplay = true;
      this.remoteVideoElement.style.width = "300px"; // Ensure the video has dimensions
      this.remoteVideoElement.style.height = "auto"; // Maintain aspect ratio
      this.remoteVideoElement.style.borderRadius = "15px"; // Rounded corners

      // Append the video element to the container
      container.appendChild(this.remoteVideoElement);
      document.body.appendChild(container);

      // Add event listeners to make the video draggable
      container.onmousedown = function (event) {
        let shiftX = event.clientX - container.getBoundingClientRect().left;
        let shiftY = event.clientY - container.getBoundingClientRect().top;

        function moveAt(pageX: number, pageY: number) {
          container.style.left = pageX - shiftX + "px";
          container.style.top = pageY - shiftY + "px";
        }

        function onMouseMove(event: MouseEvent) {
          moveAt(event.pageX, event.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);

        container.onmouseup = function () {
          document.removeEventListener("mousemove", onMouseMove);
          container.onmouseup = null;
        };

        container.ondragstart = function () {
          return false;
        };
      };

      // Log the video element for debugging
      console.log("Video element added to DOM:", this.remoteVideoElement);

      // Add loadedmetadata event listener
      this.remoteVideoElement.onloadedmetadata = () => {
        console.log("Video metadata loaded, attempting to play...");
        if (!this.remoteVideoElement) return;
        this.remoteVideoElement
          .play()
          .then(() => {
            console.log("Video is playing");
          })
          .catch((error) => {
            console.error("Error playing video:", error);
          });
      };

      // Add error event listener
      this.remoteVideoElement.onerror = (event) => {
        console.error("Error occurred in video element:", event);
      };

      // Add event listener for visibility
      this.remoteVideoElement.onplaying = () => {
        console.log("Video is playing");
      };

      this.remoteVideoElement.onpause = () => {
        console.log("Video is paused");
      };

      this.remoteVideoElement.onended = () => {
        console.log("Video has ended");
      };
    }

    // Update the video element's srcObject if it already exists
    this.remoteVideoElement.srcObject = stream;

    if (isRemote) {
      // Handle local stream for picture-in-picture
      if (!this.localVideoElement) {
        this.localVideoElement = document.createElement("video");
        this.localVideoElement.autoplay = true;
        this.localVideoElement.muted = true; // Mute local video to avoid feedback
        this.localVideoElement.style.position = "absolute";
        this.localVideoElement.style.width = "100px";
        this.localVideoElement.style.height = "auto";
        this.localVideoElement.style.bottom = "10px";
        this.localVideoElement.style.left = "10px";
        this.localVideoElement.style.borderRadius = "15px";
        this.localVideoElement.style.zIndex = "10000";

        if (this.remoteVideoElement.parentElement) {
          // Append the local video element to the container
          this.remoteVideoElement.parentElement.appendChild(
            this.localVideoElement
          );
        }
      }

      // Get the local stream (assuming you have a method to get it)
      if (this.localStream) {
        this.localVideoElement.srcObject = this.localStream;
      }
    }

    // Log stream information for debugging
    console.log("Stream tracks:", stream.getTracks());
    stream.getTracks().forEach((track) => {
      console.log(
        `Track kind: ${track.kind}, enabled: ${track.enabled}, readyState: ${track.readyState}`
      );
      // Ensure the video track is enabled
      if (track.kind === "video") {
        track.enabled = true;
      }
    });

    // Check the video element's ready state
    console.log(
      "Video element readyState:",
      this.remoteVideoElement.readyState
    );

    // Add track event listeners
    videoTrack.onunmute = () => {
      console.log("Video track unmuted");
    };

    videoTrack.onmute = () => {
      console.log("Video track muted");
    };

    videoTrack.onended = () => {
      console.log("Video track ended");
    };
  }
}

// Run the constructor
new StreamHandler();
