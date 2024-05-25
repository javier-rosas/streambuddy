function handleCheckExtensionInstalled(event) {
  window.postMessage(
    {
      type: "check_extension_installed",
      extensionInstalled: true,
      fromContentScript: true,
    },
    "*"
  );
}

function handleCheckUserLoggedIn(event) {
  chrome.runtime.sendMessage({ type: "get_user_data" }, (response) => {
    window.postMessage(
      {
        type: "check_user_logged_in",
        userLoggedIn: response.userData || null,
        fromContentScript: true,
      },
      "*"
    );
  });
}

window.addEventListener("message", (event) => {
  // Only accept messages from the same frame
  if (event.source !== window) {
    return;
  }

  if (event.data && !event.data.fromContentScript) {
    if (event.data.type === "check_extension_installed") {
      handleCheckExtensionInstalled(event);
    } else if (event.data.type === "check_user_logged_in") {
      handleCheckUserLoggedIn(event);
    }
  }
});
