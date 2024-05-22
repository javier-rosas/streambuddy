import {
  NETFLIX_URL,
  VITE_API_JOIN_ENDPOINT,
  VITE_APP_EXTENSION_ID,
} from "@/utils/constants";

console.log("in ReceiveLink service worker", VITE_API_JOIN_ENDPOINT);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.startsWith(VITE_API_JOIN_ENDPOINT)) {
    checkExtensionAndLogin(tabId);
  }
});

function checkExtensionAndLogin(tabId) {
  // Check if the extension is installed by sending a message to it
  chrome.runtime.sendMessage(
    VITE_APP_EXTENSION_ID,
    { action: "checkInstalled" },
    (response) => {
      if (response && response.installed) {
        // Extension is installed, check login status
        chrome.runtime.sendMessage(
          VITE_APP_EXTENSION_ID,
          { action: "checkLogin" },
          (loginResponse) => {
            if (loginResponse && loginResponse.loggedIn) {
              // User is logged in, redirect to Netflix
              chrome.tabs.update(tabId, { url: NETFLIX_URL });
            } else {
              // User is not logged in, prompt login
              chrome.runtime.sendMessage(
                VITE_APP_EXTENSION_ID,
                { action: "promptLogin" },
                () => {
                  // After login, redirect to Netflix
                  chrome.runtime.onMessage.addListener(function loginListener(
                    message,
                    sender,
                    sendResponse
                  ) {
                    if (message.action === "loginSuccess") {
                      chrome.tabs.update(tabId, { url: NETFLIX_URL });
                      chrome.runtime.onMessage.removeListener(loginListener);
                    }
                  });
                }
              );
            }
          }
        );
      } else {
        // Extension is not installed, handle accordingly
        console.log("Extension is not installed.");
      }
    }
  );
}
