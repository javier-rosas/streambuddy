// import ChooseSettings from "@/extension-scripts/contentScripts/stream/ChooseSettings";
// import ReactDOM from "react-dom/client";

const VITE_API_BASE_ENDPOINT = import.meta.env.VITE_API_BASE_ENDPOINT;

let io: any;
(async () => {
  const socketio = await import("socket.io-client");
  io = socketio.default;
  // console log timestamp when socket.io-client is loaded
  console.log("socket.io-client loaded at", new Date().toLocaleTimeString());
})();

export function streamMain() {
  let socket: any;
  let localStream: any;
  let peerConnection: any;

  chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message.type === "startStream") {
      startStream(message.link);
    }
  });

  const startStream = async (link: string) => {
    injectChoosePlatformComponent();
    socket = io(VITE_API_BASE_ENDPOINT);

    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    socket.emit("join-room", { link });

    socket.on("user-connected", async (data: any) => {
      console.log(
        "user connected in the client",
        data.link,
        new Date().toLocaleTimeString()
      );
      await initializePeerConnection(data.link);

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("offer", { link: data.link, offer });
    });

    socket.on("offer", async (data: any) => {
      await initializePeerConnection(data.link);

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", { link: data.link, answer });
    });

    socket.on("answer", async (data: any) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    });

    socket.on("ice-candidate", async (data: any) => {
      try {
        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(data.candidate);
          console.log("Received and added ICE candidate");
        } else {
          console.log(
            "Received ICE candidate before remote description was set. Queueing it."
          );
          // Queue the ICE candidate for later use
          const pendingCandidates = peerConnection.pendingCandidates || [];
          pendingCandidates.push(data.candidate);
          peerConnection.pendingCandidates = pendingCandidates;
        }
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    });
  };

  const initializePeerConnection = async (link: string) => {
    peerConnection = new RTCPeerConnection();

    localStream.getTracks().forEach((track: any) => {
      peerConnection.addTrack(track, localStream);
      console.log("Added track to peer connection");
    });

    peerConnection.onicecandidate = (event: any) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { link, candidate: event.candidate });
        console.log("Sent ICE candidate");
      }
    };

    peerConnection.ontrack = (event: any) => {
      console.log("Received remote stream");
      const videoElement = document.createElement("video");
      videoElement.srcObject = event.streams[0];
      videoElement.autoplay = true;
      videoElement.style.position = "fixed";
      videoElement.style.top = "10px";
      videoElement.style.right = "10px";
      videoElement.style.zIndex = "9999";
      document.body.appendChild(videoElement);
    };
  };
}

const injectChoosePlatformComponent = () => {
  console.log("Injecting ChooseSettings component");
  // Create a container element
  const container = document.createElement("div");

  // Optionally, you can add some styles or attributes to the container
  container.style.position = "fixed";
  container.style.top = "10px";
  container.style.right = "10px";
  container.style.zIndex = "9999";
  container.style.width = "100px"; // Add width
  container.style.height = "100px"; // Add height

  container.style.backgroundColor = "white";

  // Append the container to the document body
  document.body.appendChild(container);

  // Render the React component into the container
  // const root = ReactDOM.createRoot(container);
  // root.render(<ChooseSettings />);
};
