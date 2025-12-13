import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDb from "./config/db.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import clientRoute from "./routes/clientRoute.js";
import adminRoute from "./routes/adminRoute.js";
import freeLanceRoute from "./routes/freeLanceRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import imageKitRoutes from "./routes/imageRoute.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://freelance-job-portal-tau.vercel.app"
];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("join", ({ userId }) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", ({ senderId, receiverId, message }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    io.to(roomId).emit("receive_message", {
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    for (let id in onlineUsers) {
      if (onlineUsers[id] === socket.id) delete onlineUsers[id];
    }
  });
});

app.use("/api/client", clientRoute);
app.use("/api/admin", adminRoute);
app.use("/api/freelancer", freeLanceRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/images", imageKitRoutes);

const PORT = process.env.PORT || 3000;

connectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
