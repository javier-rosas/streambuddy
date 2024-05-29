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

  const injectChoosePlatformComponent = () => {
    console.log("Injecting ChooseSettings component");

    // Create the container div
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.backgroundColor = "white";
    container.style.padding = "10px";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    container.style.zIndex = "1000"; // Ensure it's on top of other elements

    // Create the label element
    const label = document.createElement("label");
    label.setAttribute("for", "audio");
    label.classList.add("label");
    label.textContent = "Audio";

    // Create the select element
    const select = document.createElement("select");
    select.id = "audio";
    select.name = "audio";
    select.classList.add("select");
    select.value = "Canada";

    const options = ["Option 1", "Option 2", "Option 3"];
    // Append options to the select element
    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });

    // Append the label and select to the container
    container.appendChild(label);
    container.appendChild(select);

    const style = document.createElement("style");
    style.textContent = `
  .label {
    display: block;
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    line-height: 1.5; /* leading-6 */
    color: #1f2937; /* text-gray-900 */
  }

  .select {
    margin-top: 0.5rem; /* mt-2 */
    display: block;
    width: 100%; /* w-full */
    border-radius: 0.375rem; /* rounded-md */
    border: none; /* border-0 */
    padding-top: 0.375rem; /* py-1.5 */
    padding-bottom: 0.375rem; /* py-1.5 */
    padding-left: 0.75rem; /* pl-3 */
    padding-right: 2.5rem; /* pr-10 */
    color: #1f2937; /* text-gray-900 */
    box-shadow: inset 0 0 0 1px #d1d5db; /* ring-1 ring-inset ring-gray-300 */
  }

  .select:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: inset 0 0 0 1px #6366f1, 0 0 0 2px #6366f1; /* focus:ring-2 focus:ring-indigo-600 */
  }

  .select.sm {
    font-size: 0.875rem; /* sm:text-sm */
    line-height: 1.5; /* sm:leading-6 */
  }
`;
    document.head.appendChild(style);

    // Append the container to the body
    document.body.appendChild(container);
  };
}
