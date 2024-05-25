function handleWebAppMessages(message, sender, sendResponse) {
  if (request.action === "checkInstalled") {
    sendResponse({ installed: true });
    console.log("Web App is installed");
  } else if (request.action === "checkLogin") {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    sendResponse({ loggedIn });
  } else if (request.action === "promptLogin") {
    chrome.runtime.openOptionsPage(() => {
      chrome.runtime.onMessage.addListener(function loginListener(
        message,
        sender,
        sendResponse
      ) {
        if (message.action === "loginSuccess") {
          sendResponse({ action: "loginSuccess" });
          chrome.runtime.onMessage.removeListener(loginListener);
        }
      });
    });
  }
  return true;
}

chrome.runtime.onMessage.addListener(handleWebAppMessages);
