import { io } from "socket.io-client";

const socket = io("https://freelance-job-portal-4.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
});

export default socket;
