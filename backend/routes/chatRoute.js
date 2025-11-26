const express = require("express");
const router = express.Router();
const Chat = require("../model/chatModel");
const { authUser } = require("../middileware/authMiddleware");

// Save message
router.post("/send", authUser, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    console.log(receiverId,'here rec');
    

    const newMessage = await Chat.create({
      senderId: req.user._id,
      receiverId,
      message,
    });

    res.status(200).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
});

// Get chat between 2 users
router.get("/:otherUserId", authUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const otherId = req.params.otherUserId;

    const messages = await Chat.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

// Admin get all chats
router.get("/admin/all", async (req, res) => {
  const chats = await Chat.find().populate("senderId receiverId", "name role");
  res.json(chats);
});

module.exports = router;
