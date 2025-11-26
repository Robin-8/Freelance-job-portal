import React, { useEffect, useState } from "react";
import socket from "../socket";
import axiosInstance from "../api/axiosApi";
import { useSelector } from "react-redux";

export default function ChatBox({ otherUserId, otherUserName }) {
  const { user } = useSelector((state) => state.client);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user?._id || !otherUserId) return;

    // Fetch chat history
    axiosInstance.get(`/chat/${otherUserId}`).then((res) => {
      setChat(res.data.messages || []);
    });

    // Join socket room for this conversation
    const roomId = [user._id, otherUserId].sort().join("-");
    socket.emit("join_room", roomId);

    // Listen for incoming messages
    const handleReceiveMessage = (data) => {
      // ignore server echo for messages sent by this client
      if (data.senderId === user._id) return;

      // check that message belongs to this room
      const incomingRoom = [data.senderId, data.receiverId].sort().join("-");
      const currentRoom = [user._id, otherUserId].sort().join("-");
      if (incomingRoom !== currentRoom) return;

      setChat((prev) => [...prev, data]);
    };
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [otherUserId, user?._id]);

  const sendChat = async () => {
    if (!user?._id || !otherUserId || !msg.trim()) return;
    const newMessage = {
      senderId: user._id,
      receiverId: otherUserId,
      message: msg,
      timestamp: new Date(),
    };

    setChat((prev) => [...prev, newMessage]);
    setMsg("");

    await axiosInstance.post("/chat/send", {
      receiverId: otherUserId,
      message: msg,
    });

    socket.emit("send_message", newMessage);
  };

  if (!user?._id || !otherUserId) {
    return (
      <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
        <h1 className="font-bold text-lg mb-3">Select a user to chat with</h1>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="font-bold text-lg mb-3">Chat with {otherUserName}</h1>

      <div className="h-80 overflow-y-auto bg-gray-200 p-3 rounded">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`p-2 my-2 rounded max-w-xs ${
              c.senderId === user._id
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300"
            }`}
          >
            {c.message}
          </div>
        ))}
      </div>

      <div className="flex mt-3 gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendChat}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
