import axiosInstance from "../api/axiosApi";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import socket from "./socket";

const ChatPage = () => {
  const clientState = useSelector((state) => state.client);
  const loggedUser = clientState?.user;
  const token = clientState?.token;

  const isAdmin = loggedUser?.role === "admin";

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");

  // Fetch all users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (isAdmin) {
          const res = await axiosInstance.get("/admin/getUsers");
          const all = res.data.users || [];
          const allowed = all.filter((u) => u._id !== loggedUser?._id);
          setUsers(allowed);
          if (allowed.length > 0 && !selectedUserId)
            setSelectedUserId(allowed[0]._id);
        } else {
          // non-admins: fetch admins (public endpoint)
          const res = await axiosInstance.get("/admin/getAllAdmins");
          const admins = res.data.admins || [];
          const allowed = admins.filter((a) => a._id !== loggedUser?._id);
          setUsers(allowed);
          if (allowed.length > 0 && !selectedUserId)
            setSelectedUserId(allowed[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch users for chat:", err?.response || err);
        setUsers([]);
      }
    };
    if (loggedUser?._id) fetchUsers();
  }, [loggedUser, token]);

  // Join socket and room
  useEffect(() => {
    if (loggedUser?._id) {
      socket.emit("join", {
        userId: loggedUser._id,
        role: loggedUser.role,
      });
    }
    if (loggedUser?._id && selectedUserId) {
      const rId = [loggedUser._id, selectedUserId].sort().join("-");
      setRoomId(rId);
      socket.emit("join_room", rId);
    }
  }, [loggedUser, selectedUserId]);

  // Fetch chat history when room changes
  useEffect(() => {
    const fetchChat = async () => {
      if (selectedUserId) {
        const res = await axiosInstance.get(`/chat/${selectedUserId}`);
        setChat(res.data.messages || []);
      }
    };
    fetchChat();
  }, [selectedUserId]);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      // ignore messages sent by this client (we already appended locally)
      if (data.senderId === loggedUser?._id) return;

      // ensure message belongs to current room (if room selected)
      const incomingRoom = [data.senderId, data.receiverId].sort().join("-");
      if (roomId && incomingRoom !== roomId) return;

      setChat((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!loggedUser?._id || !selectedUserId) {
      alert("User or receiver missing");
      return;
    }
    socket.emit("send_message", {
      senderId: loggedUser._id,
      receiverId: selectedUserId,
      message,
    });
    setChat((prev) => [
      ...prev,
      {
        senderId: loggedUser._id,
        receiverId: selectedUserId,
        message,
        self: true,
      },
    ]);
    setMessage("");
  };

  if (!loggedUser) {
    return (
      <div className="p-4 text-center text-white">
        <h1 className="text-xl font-bold">You must login first</h1>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <div className="mb-4 p-3 bg-gray-800 rounded flex items-center justify-between">
        <p className="text-lg">
          Logged in as: <span className="font-bold">{loggedUser.name}</span>
        </p>
        <span className="px-3 py-1 rounded bg-gray-700 text-sm">
          Role: {loggedUser.role}
        </span>
      </div>

      {/* User Selector Dropdown */}
      <div className="mb-3">
        <label className="block mb-1">Select user to chat with:</label>
        <select
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="bg-gray-800 p-4 rounded h-80 overflow-y-auto mb-4">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`my-2 p-2 rounded max-w-xs ${
              msg.senderId === loggedUser._id
                ? "bg-green-600 ml-auto"
                : "bg-gray-700"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          className="w-full p-2 rounded bg-gray-700"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-purple-600 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
