import { getQueryParameter } from "../helpers";
import socket from "../socket";

class VideoObserver {
  private parentSelector: string;
  private parentElement: Element | null;
  private sessionCode: string | null = null;

  constructor(parentSelector: string) {
    this.parentSelector = parentSelector;
    this.parentElement = document.querySelector(parentSelector);

    // https://www.netflix.com/browse?code=toston
    // https://www.netflix.com/watch/70196264?movie-code=toston
    const code = getQueryParameter("movie-code");
    if (code) {
      console.log("Code from Next.js app:", code);
      this.sessionCode = code;
    } else {
      console.log("No code found in URL in netflix.tsx");
    }

    chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
      if (message.type === "startStream") {
        console.log("message.sessionCode 1", message.sessionCode);
        this.sessionCode = message.sessionCode;
      }
    });
  }

  private observePlaybackNotification(targetNode: Element) {
    const commonParent = targetNode.closest(this.parentSelector);
    if (!commonParent) return;

    const video = commonParent.querySelector("video");
    if (!video) return;

    const isPlayNotification = targetNode.classList.contains(
      "playback-notification--play"
    );
    const isPauseNotification = targetNode.classList.contains(
      "playback-notification--pause"
    );

    let currentTime = null;
    let playbackStatus = null;

    if (isPlayNotification) {
      socket.emit("play", {
        sessionCode: this.sessionCode,
        currentTime: video.currentTime,
      });
      console.log("Super play!");
      console.log("video.currentTime", video.currentTime);
      currentTime = video.currentTime;
      playbackStatus = "playing";
    } else if (isPauseNotification) {
      socket.emit("pause", {
        sessionCode: this.sessionCode,
        currentTime: video.currentTime,
      });
      console.log("Super pause!");
      console.log("video.currentTime", video.currentTime);
      currentTime = video.currentTime;
      playbackStatus = "paused";
    }

    // Add listeners for socket "play" and "pause" actions
    socket.on("play", (data) => {
      if (data.sessionCode === this.sessionCode) {
        video.currentTime = data.currentTime;
        video.play();
        console.log("Socket play action received", data);
      }
    });

    socket.on("pause", (data) => {
      if (data.sessionCode === this.sessionCode) {
        video.currentTime = data.currentTime;
        video.pause();
        console.log("Socket pause action received", data);
      }
    });

    if (!currentTime || !playbackStatus) return;

    chrome.runtime.sendMessage({
      type: "VIDEO_STATUS_CHANGE",
      payload: {
        status: playbackStatus,
        time: currentTime,
      },
    });
  }

  private initializeObserver() {
    if (this.parentElement) {
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(({ type, addedNodes }) => {
          if (type === "childList") {
            addedNodes.forEach((node) => {
              if (
                node instanceof Element &&
                node.classList.contains("playback-notification")
              ) {
                this.observePlaybackNotification(node);
              }
            });
          }
        });
      });

      observer.observe(this.parentElement, { childList: true, subtree: true });
    } else {
      console.error(
        `The parent element '${this.parentSelector}' was not found in the DOM.`
      );
    }
  }

  private observeDynamicElements() {
    const observer = new MutationObserver((_mutations, obs) => {
      this.parentElement = document.querySelector(this.parentSelector);
      if (this.parentElement) {
        this.initializeObserver();
        obs.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  public start() {
    if (document.querySelector(this.parentSelector)) {
      this.initializeObserver();
    } else {
      this.observeDynamicElements();
    }
  }
}

export function main() {
  const videoObserver = new VideoObserver(".watch-video");
  videoObserver.start();
}

main();
