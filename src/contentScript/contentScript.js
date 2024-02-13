function initializeObserver() {
  const parentElement = document.querySelector(".watch-video"); // Change this selector to match the parent element

  // Ensure parentElement is not null before proceeding
  if (parentElement) {
    // Function to observe the .playback-notification element for changes
    function observePlaybackNotification(targetNode) {
      // Find a common parent for targetNode and the video element. This might need adjustment depending on the actual DOM structure
      let commonParent = targetNode.closest(".watch-video"); // Adjust '.common-parent-selector' to match your actual DOM structure

      // If a common parent is found, try to find the video within this parent
      if (commonParent) {
        let video = commonParent.querySelector("video");
        if (video) {
          // Now you can safely access video.currentTime
          if (targetNode.classList.contains("playback-notification--play")) {
            console.log("Super play!");
            console.log("video.currentTime", video.currentTime);
          } else if (
            targetNode.classList.contains("playback-notification--pause")
          ) {
            console.log("Super pause!");
            console.log("video.currentTime", video.currentTime);
          }
        }
      }
    }

    // Set up a MutationObserver to observe the parent element for changes
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach(({ type, addedNodes }) => {
        if (type === "childList") {
          addedNodes.forEach((node) => {
            // Ensure node is an instance of Element before accessing classList
            if (
              node instanceof Element &&
              node.classList.contains("playback-notification")
            ) {
              // .playback-notification element has been added, now observe this element for changes
              observePlaybackNotification(node);
            }
          });
        }
      });
    });

    observer.observe(parentElement, { childList: true, subtree: true });
  } else {
    console.error(
      "The parent element '.watch-video' was not found in the DOM."
    );
  }
}

function observeDynamicElements() {
  const observer = new MutationObserver((mutations, obs) => {
    const parentElement = document.querySelector(".watch-video");
    if (parentElement) {
      initializeObserver(); // Call the function that sets up the observer for .watch-video
      obs.disconnect(); // Stop observing once .watch-video is found
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

if (document.querySelector(".watch-video")) {
  initializeObserver(); // If .watch-video exists, initialize observer
} else {
  observeDynamicElements(); // If not, observe the body for when .watch-video is added
}
