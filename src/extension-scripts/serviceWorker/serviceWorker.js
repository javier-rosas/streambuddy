import { handleAuthToken } from "./auth/auth.js";
import { handleNetflixStatus } from "./netflix/netflix.js";
import { handleStartStream } from "./stream/stream.js";
import { handleWebAppUserDataRequest } from "./webApp/webApp.js";

chrome.runtime.onMessage.addListener(handleNetflixStatus);
chrome.runtime.onMessage.addListener(handleAuthToken);
chrome.runtime.onMessage.addListener(handleStartStream);
chrome.runtime.onMessage.addListener(handleWebAppUserDataRequest);
