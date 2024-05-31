import StreamHandler from "./stream/stream";
import { netflixMain } from "./netflix/contentScript";

netflixMain();

const streamHandler = new StreamHandler();
streamHandler.startStream();
