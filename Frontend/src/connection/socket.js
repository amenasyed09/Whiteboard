import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://whiteboard-backend-1els.onrender.com";
export const connectSocket = () => {
  const token = localStorage.getItem("accessToken");

  return io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
      transports: ["websocket", "polling"],
  });
};
