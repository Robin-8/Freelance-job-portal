import { io } from "socket.io-client";

console.log("BACKEND URL =", import.meta.env.VITE_BACKEND_URL);

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000", {
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
