// import { Peer } from "peerjs";
// import { io } from "socket.io-client";
let Peer;
let io;
(async () => {
  const peerjs = await import("peerjs");
  Peer = peerjs.default;

  const socketio = await import("socket.io-client");
  io = socketio.default;
})();

export function streamMain() {
  let peer;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "startStream") {
      startStream(message.userId);
    }
  });

  const startStream = (userId) => {
    peer = new Peer();

    peer.on("open", (id) => {
      const socket = io("http://localhost:2000");
      socket.emit("join-room", { userId, peerId: id });

      socket.on("user-connected", (data) => {
        const call = peer.call(
          data.peerId,
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        );
        console.log("user connected in the client", data.peerId);
        call.on("stream", (remoteStream) => {
          console.log("streaming", remoteStream);
          const videoElement = document.createElement("video");
          videoElement.srcObject = remoteStream;
          videoElement.autoplay = true;
          videoElement.style.position = "fixed";
          videoElement.style.top = "10px";
          videoElement.style.right = "10px";
          videoElement.style.zIndex = "9999";
          document.body.appendChild(videoElement);
        });
      });
    });
  };
}
