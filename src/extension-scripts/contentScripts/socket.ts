const VITE_API_BASE_ENDPOINT =
  process.env.VITE_API_BASE_ENDPOINT || "http://localhost:2000";

import { io } from "socket.io-client";
const socket = io(VITE_API_BASE_ENDPOINT);
export default socket;
