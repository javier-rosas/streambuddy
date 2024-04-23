let io;
(async () => {
  const socketio = await import("socket.io-client");
  io = socketio.default;
  // console log timestamp when socket.io-client is loaded
  console.log("socket.io-client loaded at", new Date().toLocaleTimeString());
})();

export function streamMain() {
  let socket;
  let localStream;
  let peerConnection;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "startStream") {
      startStream(message.userId);
    }
  });

  const startStream = async (userId) => {
    socket = io("http://167.99.112.197:2000");

    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    socket.emit("join-room", { userId });

    socket.on("user-connected", async (data) => {
      console.log(
        "user connected in the client",
        data.userId,
        new Date().toLocaleTimeString()
      );
      await initializePeerConnection(data.userId);

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("offer", { userId: data.userId, offer });
    });

    socket.on("offer", async (data) => {
      await initializePeerConnection(data.userId);

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", { userId: data.userId, answer });
    });

    socket.on("answer", async (data) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    });

    socket.on("ice-candidate", async (data) => {
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

  const initializePeerConnection = async (userId) => {
    peerConnection = new RTCPeerConnection();

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
      console.log("Added track to peer connection");
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { userId, candidate: event.candidate });
        console.log("Sent ICE candidate");
      }
    };

    peerConnection.ontrack = (event) => {
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
