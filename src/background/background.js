// background.js
let videoStatusCache = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "VIDEO_STATUS_CHANGE") {
    videoStatusCache = message;
    chrome.runtime.sendMessage(message);
  } else if (message.type === "REQUEST_CACHED_STATUS" && videoStatusCache) {
    chrome.runtime.sendMessage(videoStatusCache);
  }
});
