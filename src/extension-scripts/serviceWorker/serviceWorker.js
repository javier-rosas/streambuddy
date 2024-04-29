import { handleAuthToken } from "./auth/auth";
import { handleNetflixStatus } from "./netflix/netflix";
import { handleStartStream } from "./stream/stream";

chrome.runtime.onMessage.addListener(handleNetflixStatus);
chrome.runtime.onMessage.addListener(handleAuthToken);
chrome.runtime.onMessage.addListener(handleStartStream);
