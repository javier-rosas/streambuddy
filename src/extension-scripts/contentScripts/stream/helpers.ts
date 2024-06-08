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
