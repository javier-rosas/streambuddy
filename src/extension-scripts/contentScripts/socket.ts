import { Socket, io } from "socket.io-client";

const VITE_API_BASE_ENDPOINT =
  process.env.VITE_API_BASE_ENDPOINT || "http://localhost:2000";

class SocketSingleton {
  private static instance: Socket | null = null;

  private constructor() {}

  public static getInstance(): Socket {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = io(VITE_API_BASE_ENDPOINT);
    }
    return SocketSingleton.instance;
  }
}

export default SocketSingleton;
