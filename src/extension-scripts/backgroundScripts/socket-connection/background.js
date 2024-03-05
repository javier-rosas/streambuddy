import { Peer } from "peerjs";
import { io } from "socket.io-client";

// const io = require("socket.io-client");
// const Peer = require("peerjs");

// TODO: try to use CDN links

export const initVideoConnection = () => {
  const socket = io("http://localhost:2000"); // Connect to your backend server
  // const videoGrid = document.createElement("div");
  // videoGrid.id = "video-grid";
  // document.body.appendChild(videoGrid);

  const myPeer = new Peer(undefined, {
    host: "http://localhost",
    port: "2001", // Make sure this port matches the one used by PeerJS in your server
  });

  // const myVideo = document.createElement("video");
  // myVideo.muted = true;
  const peers = {};

  myPeer.on("call", (call) => {
    call.answer(stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      // addVideoStream(video, userVideoStream);
    });
  });

  socket.on("user-connected", (userId) => {
    console.log("User connected: " + userId);
    connectToNewUser(userId, stream);
  });

  socket.on("user-disconnected", (userId) => {
    if (peers[userId]) peers[userId].close();
  });

  myPeer.on("open", (id) => {
    socket.emit("join-room", "/123", id);
  });

  function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    call.on("stream", (userVideoStream) => {
      // addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();
    });

    peers[userId] = call;
  }

  // function addVideoStream(video, stream) {
  //   video.srcObject = stream;
  //   video.addEventListener("loadedmetadata", () => {
  //     video.play();
  //   });
  //   videoGrid.append(video);
  // }
};
