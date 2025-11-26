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

const app = express();

// CORS FOR EXPRESS + SOCKET.IO
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create HTTP server for SOCKET.IO
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// STORE ONLINE USERS
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
    const receiverSocket = onlineUsers[receiverId];

    // Emit to room (both users receive)
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

// ROUTES
app.use("/api/client", clientRoute);
app.use("/api/admin", adminRoute);
app.use("/api/freelancer", freeLanceRoute);
app.use("/api/chat", chatRoutes);

// CONNECT DB
connectDb();

// START SERVER (IMPORTANT)
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running at: http://localhost:${PORT}`);
});
