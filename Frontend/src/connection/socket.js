import { io } from "socket.io-client";

export const connectSocket = () => {
  const token = localStorage.getItem("accessToken");

  return io("http://localhost:5000", {
    auth: { token },
    autoConnect: true,
  });
};
