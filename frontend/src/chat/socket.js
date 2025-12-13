import { io } from "socket.io-client";

const socket = io("https://freelance-backend-l5l2ji855-robin-shajis-projects.vercel.app", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
