export function handleAuthToken(message, sender, sendResponse) {
  if (message.type === "login") {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        sendResponse({ token: token });
      }
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (message.type === "logout") {
    // Assuming the token to revoke is passed in the message
    chrome.identity.removeCachedAuthToken(
      { token: message.token },
      function () {
        if (chrome.runtime.lastError) {
          console.error("Logout failed:", chrome.runtime.lastError);
        } else {
          sendResponse({ success: true });
        }
      }
    );
    return true; // Indicates that the response is sent asynchronously
  }
}
