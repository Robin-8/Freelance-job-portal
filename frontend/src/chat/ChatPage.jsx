import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosApi";
import socket from "../socket";

const ChatPage = () => {
  const { user } = useSelector((state) => state.client);

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");

  const chatEndRef = useRef(null);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    if (!user?._id) return;

    const fetchUsers = async () => {
      try {
        let res;

        if (user.role === "admin") {
          res = await axiosInstance.get("/admin/getUsers");
          setUsers(res.data.users.filter((u) => u._id !== user._id));
        } else {
          res = await axiosInstance.get("/admin/getAllAdmins");
          setUsers(res.data.admins.filter((u) => u._id !== user._id));
        }
      } catch (err) {
        console.error("Fetch users error:", err);
      }
    };

    fetchUsers();
  }, [user]);

  /* ================= AUTO SELECT FIRST USER ================= */
  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0]._id);
    }
  }, [users, selectedUserId]);

  /* ================= JOIN ROOM ================= */
  useEffect(() => {
    if (!user?._id || !selectedUserId) return;

    const rId = [user._id, selectedUserId].sort().join("-");
    setRoomId(rId);

    socket.emit("join_room", rId);
  }, [user, selectedUserId]);

  /* ================= FETCH CHAT HISTORY ================= */
  useEffect(() => {
    if (!selectedUserId) return;

    const fetchChat = async () => {
      try {
        const res = await axiosInstance.get(`/chat/${selectedUserId}`);
        setChat(res.data.messages || []);
      } catch (err) {
        console.error("Fetch chat error:", err);
      }
    };

    fetchChat();
  }, [selectedUserId]);

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      const incomingRoom = [data.senderId, data.receiverId]
        .sort()
        .join("-");

      if (incomingRoom !== roomId) return;

      setChat((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [roomId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!message.trim() || !selectedUserId) return;

    socket.emit("send_message", {
      senderId: user._id,
      receiverId: selectedUserId,
      message,
    });

    setMessage("");
  };

  /* ================= UI ================= */
  if (!user) {
    return <div className="p-4">Please login</div>;
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-xl font-bold mb-3">
        Chat ({user.role})
      </h2>

      {/* USER SELECT */}
      <select
        className="w-full p-2 mb-3 bg-gray-800 rounded"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">Select user</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name} ({u.role})
          </option>
        ))}
      </select>

      {/* EMPTY STATE */}
      {!selectedUserId && (
        <div className="text-gray-400 text-center mt-10">
          Select a user to start chatting
        </div>
      )}

      {/* CHAT MESSAGES */}
      {selectedUserId && (
        <div className="bg-gray-800 p-3 h-80 overflow-y-auto rounded mb-3">
          {chat.length === 0 && (
            <div className="text-gray-400 text-center mt-10">
              No messages yet
            </div>
          )}

          {chat.map((msg, i) => (
            <div
              key={i}
              className={`p-2 my-2 rounded max-w-xs ${
                msg.senderId === user._id
                  ? "bg-green-600 ml-auto"
                  : "bg-gray-700"
              }`}
            >
              {msg.message}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* INPUT */}
      {selectedUserId && (
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 bg-gray-800 rounded"
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4 rounded"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
