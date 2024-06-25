import { getQueryParameter, handleUrlChange } from "../helpers";

import SocketSingleton from "../socket";

type MovieSessions = Set<string>;

class VideoObserver {
  private parentSelector: string;
  private parentElement: Element | null;
  private sessionCode: string | null = null;
  private socket = SocketSingleton.getInstance();
  private movieSessions: MovieSessions = new Set<string>();

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

    // chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    //   if (message.type === "startStream") {
    //     console.log("message.sessionCode 1", message.sessionCode);
    //     this.sessionCode = message.sessionCode;
    //   }
    // });
    chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
      if (message.type === "startStream") {
        // Store the session code and set the reload flag
        chrome.storage.local.set(
          { sessionCode: message.sessionCode, reload: true },
          () => {
            // Reload the page
            location.reload();
          }
        );
      }
    });

    // Check if the page was reloaded and continue with the logic if necessary
    this.checkReloadFlag();
  }

  checkReloadFlag() {
    chrome.storage.local.get(["reload", "sessionCode"], (result) => {
      if (result.reload) {
        // Reset the reload flag
        chrome.storage.local.set({ reload: false });

        // Execute the remaining logic

        console.log("message.sessionCode 1", result.sessionCode);
        this.sessionCode = result.sessionCode;
      }
    });
  }

  public isMoviePlayed() {
    // Observe URL changes using MutationObserver
    const observer = new MutationObserver(() => {
      handleUrlChange(this.socket, this.sessionCode, this.movieSessions);
    });

    observer.observe(document, { subtree: true, childList: true });

    // Initial check in case the page is already on a watch URL
    handleUrlChange(this.socket, this.sessionCode, this.movieSessions);
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
      this.socket.emit("play", {
        sessionCode: this.sessionCode,
        currentTime: video.currentTime,
      });
      console.log("Super play!");
      console.log("video.currentTime", video.currentTime);
      currentTime = video.currentTime;
      playbackStatus = "playing";
    } else if (isPauseNotification) {
      this.socket.emit("pause", {
        sessionCode: this.sessionCode,
        currentTime: video.currentTime,
      });
      console.log("Super pause!");
      console.log("video.currentTime", video.currentTime);
      currentTime = video.currentTime;
      playbackStatus = "paused";
    }

    // Add listeners for this.socket "play" and "pause" actions
    this.socket.on("play", (data) => {
      if (data.sessionCode === this.sessionCode) {
        video.currentTime = data.currentTime;
        video.play();
        console.log("this.socket play action received", data);
      }
    });

    this.socket.on("pause", (data) => {
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
  videoObserver.isMoviePlayed();
}

main();
