import { handleAuthToken } from "./auth/background";
import { handleNetflixStatus } from "./netflix/background";
import { handleStartStream } from "./stream/background";

chrome.runtime.onMessage.addListener(handleNetflixStatus);
chrome.runtime.onMessage.addListener(handleAuthToken);
chrome.runtime.onMessage.addListener(handleStartStream);
