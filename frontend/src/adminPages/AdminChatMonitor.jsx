import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosApi";

export default function AdminChatMonitor() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axiosInstance.get("/chat/admin/all").then((res) => {
      setChats(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Chat Monitor</h1>

      <div className="mt-5 bg-white p-4 rounded shadow">
        {chats.map((c) => (
          <div key={c._id} className="border-b py-3">
            <p><b>{c.senderId.name}</b> ➝ {c.receiverId.name}</p>
            <p className="text-gray-600">{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
