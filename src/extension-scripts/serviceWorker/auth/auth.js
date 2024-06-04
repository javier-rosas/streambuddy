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
          revokeTokenFromServer(message.token);
          sendResponse({ success: true });
        }
      }
    );
    return true; // Indicates that the response is sent asynchronously
  }
}

// Function to revoke token from the server side
function revokeTokenFromServer(token) {
  const revokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${token}`;
  fetch(revokeUrl, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        console.log("Token successfully revoked");
      } else {
        console.error("Failed to revoke token");
      }
    })
    .catch((error) => {
      console.error("Error revoking token:", error);
    });
}
