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

  constructor() {
    chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
      if (message.type === "startStream") {
        this.startStream(message.link);
        this.injectChoosePlatformComponent();
      }
    });
  }

  // Function to start the streaming process
  private async startStream(link: string) {
    this.socket = io(VITE_API_BASE_ENDPOINT);

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
      return;
    }

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
      await this.initializePeerConnection(data.link);
      await this.receiveAndAnswerOffer(data);
    });

    this.socket.on("answer", async (data: any) => {
      await this.receiveAnswer(data);
    });

    this.socket.on("ice-candidate", async (data: any) => {
      await this.addIceCandidate(data);
    });
  }

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
      this.displayRemoteStream(event.streams[0]);
    };
  }

  // Create and send an offer to the remote peer
  private async createAndSendOffer(link: string) {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socket.emit("offer", { link, offer });
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
        const pendingCandidates = this.peerConnection.pendingCandidates || [];
        pendingCandidates.push(data.candidate);
        this.peerConnection.pendingCandidates = pendingCandidates;
      }
    } catch (error) {
      console.error("Error adding received ice candidate:", error);
    }
  }

  // Display the remote stream in a video element
  private displayRemoteStream(stream: MediaStream) {
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.style.position = "fixed";
    videoElement.style.top = "10px";
    videoElement.style.right = "10px";
    videoElement.style.zIndex = "9999";
    document.body.appendChild(videoElement);
  }

  // Inject Choose Platform component into the DOM
  private injectChoosePlatformComponent() {
    console.log("Injecting ChooseSettings component");

    const container = document.createElement("div");
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

    const label = document.createElement("label");
    label.setAttribute("for", "audio");
    label.classList.add("label");
    label.textContent = "Audio";

    const select = document.createElement("select");
    select.id = "audio";
    select.name = "audio";
    select.classList.add("select");

    const options = ["Option 1", "Option 2", "Option 3"];
    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });

    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("custom-button");
    button.textContent = "Button text";

    container.appendChild(label);
    container.appendChild(select);
    container.appendChild(button);

    const style = document.createElement("style");
    style.textContent = `
    .label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.5;
      color: #1f2937;
      text-align: center;
    }
    .select {
      margin-top: 0.5rem;
      display: block;
      width: 100%;
      border-radius: 0.375rem;
      border: none;
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
      padding-left: 0.75rem;
      padding-right: 2.5rem;
      color: #1f2937;
      box-shadow: inset 0 0 0 1px #d1d5db;
    }
    .select:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: inset 0 0 0 1px #6366f1, 0 0 0 2px #6366f1;
    }
    .select.sm {
      font-size: 0.875rem;
      line-height: 1.5;
    }
    .custom-button {
      border-radius: 0.375rem; /* rounded-md */
      background-color: #4f46e5; /* bg-indigo-600 */
      padding-left: 0.75rem; /* px-3 */
      padding-right: 0.75rem; /* px-3 */
      padding-top: 0.5rem; /* py-2 */
      padding-bottom: 0.5rem; /* py-2 */
      font-size: 0.875rem; /* text-sm */
      font-weight: 600; /* font-semibold */
      color: #ffffff; /* text-white */
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
      transition: background-color 0.3s; /* For smooth hover transition */
      margin-top: 10px; /* Add some spacing between the select and button */
    }
    .custom-button:hover {
      background-color: #4338ca; /* hover:bg-indigo-500 */
    }
    .custom-button:focus-visible {
      outline: 2px solid #4f46e5; /* focus-visible:outline-indigo-600 */
      outline-offset: 2px; /* focus-visible:outline-offset-2 */
    }
  `;
    document.head.appendChild(style);

    document.body.appendChild(container);
  }
}

// Export the StreamHandler class
export default StreamHandler;
