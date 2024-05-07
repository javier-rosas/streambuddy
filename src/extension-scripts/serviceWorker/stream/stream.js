const VITE_APP_NETFLIX_URL = import.meta.env.VITE_APP_NETFLIX_URL;

export function handleStartStream(message, sender, sendResponse) {
  if (message.type === "startStream") {
    chrome.tabs.query({ url: `${VITE_APP_NETFLIX_URL}*` }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: "startStream",
          userId: message.userId,
        });
      });
    });
  }
}
