export function handleWebAppUserDataRequest(message, sender, sendResponse) {
  if (message.type === "get_user_data") {
    chrome.storage.local.get(["userData"], (result) => {
      sendResponse({ userData: result.userData });
    });
    return true; // Keep the message channel open for sendResponse
  }
}
