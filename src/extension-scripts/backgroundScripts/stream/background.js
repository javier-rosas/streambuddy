export function handleStartStream(message, sender, sendResponse) {
  if (message.type === "startStream") {
    chrome.tabs.query({ url: "https://www.netflix.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: "startStream",
          userId: message.userId,
        });
      });
    });
  }
}
