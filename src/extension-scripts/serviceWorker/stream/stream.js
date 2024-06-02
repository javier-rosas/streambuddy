import { NETFLIX_URL } from "@/utils/constants";

export function handleStartStream(message, sender, sendResponse) {
  if (message.type === "startStream") {
    chrome.tabs.query({ url: `${NETFLIX_URL}/*` }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: "startStream",
          link: message.link,
        });
      });
    });
  }
}
