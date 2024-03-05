import { handleAuthToken } from "./auth/background";
import { handleNetflixStatus } from "./netflix/background";
import { initVideoConnection } from "./socket-connection/background";
chrome.runtime.onMessage.addListener(handleNetflixStatus);
chrome.runtime.onMessage.addListener(handleAuthToken);
// Initialize the video connection.
initVideoConnection();
