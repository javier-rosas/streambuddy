export const createSelectElement = (
  labelText: string,
  devices: MediaDeviceInfo[],
  container: HTMLElement,
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

export const handleVideoTrackUnmute = () => {
  console.log("Video track unmuted");
};

export const handleVideoTrackMute = () => {
  console.log("Video track muted");
};

export const handleVideoTrackEnded = () => {
  console.log("Video track ended");
};

export const handleVideoMetadataLoaded = (
  videoElement: HTMLVideoElement | null
) => {
  return () => {
    console.log("Video metadata loaded, attempting to play...");
    if (!videoElement) return;
    videoElement
      .play()
      .then(() => {
        console.log("Video is playing");
      })
      .catch((error) => {
        console.error("Error playing video:", error);
      });
  };
};

export const handleVideoError: any = (event: Event) => {
  console.error("Error occurred in video element:", event);
};

export const handleVideoPlaying = () => {
  console.log("Video is playing");
};

export const handleVideoPause = () => {
  console.log("Video is paused");
};

export const handleVideoEnded = () => {
  console.log("Video has ended");
};

export const logStreamInfo = (stream: MediaStream) => {
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
};

export const logVideoElementReadyState = (videoElement: HTMLVideoElement) => {
  console.log("Video element readyState:", videoElement.readyState);
};

export const createContainer = (): HTMLDivElement => {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "10px";
  container.style.right = "10px";
  container.style.zIndex = "9999";
  container.style.maxWidth = "300px";
  container.style.backgroundColor = "transparent";
  container.style.padding = "0";
  container.style.border = "none";
  return container;
};

export const createRemoteVideoElement = (): HTMLVideoElement => {
  const remoteVideoElement = document.createElement("video");
  remoteVideoElement.autoplay = true;
  remoteVideoElement.style.width = "300px";
  remoteVideoElement.style.height = "auto";
  remoteVideoElement.style.borderRadius = "15px";
  return remoteVideoElement;
};

export const createAlertContainer = (
  alertContainerHtml: string
): HTMLDivElement => {
  const alertContainer = document.createElement("div");
  alertContainer.classList.add("alert-container");
  alertContainer.style.width = "300px"; // Same width as the video
  alertContainer.style.height = "auto"; // Adjust height based on content
  alertContainer.style.borderRadius = "15px"; // Same rounded corners as the video
  alertContainer.innerHTML = alertContainerHtml;
  return alertContainer;
};

export const createLocalVideoElement = (): HTMLVideoElement => {
  const localVideoElement = document.createElement("video");
  localVideoElement.autoplay = true;
  localVideoElement.muted = true; // Mute local video to avoid feedback
  localVideoElement.style.position = "absolute";
  localVideoElement.style.width = "100px";
  localVideoElement.style.height = "auto";
  localVideoElement.style.bottom = "10px";
  localVideoElement.style.left = "10px";
  localVideoElement.style.borderRadius = "15px";
  localVideoElement.style.zIndex = "10000";
  return localVideoElement;
};

export const applyAlertContainerCss = (alertContainerCss: string): void => {
  const style = document.createElement("style");
  style.innerHTML = alertContainerCss;
  document.head.appendChild(style);
};

export const makeVideoDraggable = (container: HTMLDivElement): void => {
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
};

export const createChoosePlatformContainer = (): HTMLDivElement => {
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
  return container;
};
