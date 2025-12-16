import { io } from "socket.io-client";

// Use the socket-specific env variable
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

console.log("SOCKET URL =", SOCKET_URL);

const socket = io(SOCKET_URL, {
  transports: ["polling"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

export default socket;
