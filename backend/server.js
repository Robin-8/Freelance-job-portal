require("dotenv").config();
const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const clientRoute = require("./routes/clientRoute");
const adminRoute = require("./routes/adminRoute");
const freeLanceRoute = require("./routes/freeLanceRoute");
const chatRoutes = require("./routes/chatRoute");
const paymentRoutes = require("./routes/paymentRoute");

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://freelacejobportal.netlify.app", // Netlify frontend
];

// 1. MIDDLEWARE: Request Body Parsers (placed before CORS is often safer)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 2. CORS Middleware: Simplified and Direct Origin/Method Configuration
app.use(
  cors({
    origin: allowedOrigins, // Directly uses the array of allowed origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Explicitly allow all common methods, including OPTIONS (preflight)
    credentials: true,
  })
);

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Socket.IO setup (CORS configuration here is fine for Socket.IO)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("join", ({ userId }) => {
    onlineUsers[userId] = socket.id;
    console.log("Online Users:", onlineUsers);
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("send_message", ({ senderId, receiverId, message }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    io.to(roomId).emit("receive_message", {
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
    });
    console.log(`Message from ${senderId} to ${receiverId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    for (let id in onlineUsers) {
      if (onlineUsers[id] === socket.id) {
        delete onlineUsers[id];
      }
    }
  });
});

// API Routes
app.use("/api/client", clientRoute);
app.use("/api/admin", adminRoute);
app.use("/api/freelancer", freeLanceRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);

// Connect Database
connectDb();

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});