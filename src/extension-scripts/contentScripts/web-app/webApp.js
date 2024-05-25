// function handleWebAppMessages(message, sender, sendResponse) {
//   if (request.action === "checkInstalled") {
//     sendResponse({ installed: true });
//     console.log("Web App is installed");
//   } else if (request.action === "checkLogin") {
//     const loggedIn = localStorage.getItem("loggedIn") === "true";
//     sendResponse({ loggedIn });
//   } else if (request.action === "promptLogin") {
//     chrome.runtime.openOptionsPage(() => {
//       chrome.runtime.onMessage.addListener(function loginListener(
//         message,
//         sender,
//         sendResponse
//       ) {
//         if (message.action === "loginSuccess") {
//           sendResponse({ action: "loginSuccess" });
//           chrome.runtime.onMessage.removeListener(loginListener);
//         }
//       });
//     });
//   }
//   return true;
// }

// chrome.runtime.onMessage.addListener(handleWebAppMessages);
// Listen for messages from the webpage
// window.addEventListener("message", (event) => {
//   // Only accept messages from the same frame
//   if (event.source !== window) {
//     return;
//   }

//   if (
//     event.data &&
//     event.data.type === "check_extension_installed" &&
//     !event.data.fromContentScript
//   ) {
//     // Respond back to the webpage with a custom event
//     window.postMessage(
//       {
//         type: "check_extension_installed",
//         extensionInstalled: true,
//         fromContentScript: true,
//       },
//       "*"
//     );
//   }
// });

// window.addEventListener("message", (event) => {
//   // Only accept messages from the same frame
//   if (event.source !== window) {
//     return;
//   }

//   if (
//     event.data &&
//     event.data.type === "check_user_logged_in" &&
//     !event.data.fromContentScript
//   ) {
//     // Respond back to the webpage with a custom event
//     window.postMessage(
//       {
//         type: "check_user_logged_in",
//         userLoggedIn: true,
//         fromContentScript: true,
//       },
//       "*"
//     );
//   }
// });

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
  window.postMessage(
    {
      type: "check_user_logged_in",
      userLoggedIn: true,
      fromContentScript: true,
    },
    "*"
  );
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
