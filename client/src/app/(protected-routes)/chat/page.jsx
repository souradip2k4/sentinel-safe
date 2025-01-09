"use client";
import io from "socket.io-client";
import React, {useEffect, useRef, useState} from "react";
import Navbar from "@/components/Dashboard/Navbar";
import {auth} from "@/firebase.config";

function Page() {
  const [chat, setChat] = useState("");
  const socketRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      if (!auth.currentUser.isAnonymous) {
        setUserName(auth.currentUser.displayName);
      } else {
        setUserName("Anonymous");
      }
    }
  }, [])

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected: ", socketRef.current.id);
      socketRef.current.emit("user-joined", userName);
    });

    socketRef.current.on("user-joined", (user) => {
      // console.log("Received User : ", user);
    });

    socketRef.current.on("chatMessage", (message) => {
      // console.log("Received message:", message);
      setMessages((prev) => [
        ...prev,
        {role: "receiver", displayName: message.userName, text: message.text},
      ]);
    });

    socketRef.current.on("disconnect", () => {
      // console.log("Disconnected:", socketRef.current.id);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userName]);

  function handleSubmit(e) {
    e.preventDefault();
    if (chat.trim() !== "") {
      socketRef.current.emit(
        "chatMessage",
        {text: chat, userName},
        socketRef.current.id
      );
      console.log("Sent Message : ", {text: chat, userName});
      setMessages((prev) => [
        ...prev,
        {role: "sender", displayName: "You", text: chat},
      ]);
      setChat("");
    }
  }

/*
  if (!isLoading) {
    return <div>Loading...</div>
  }
*/

  return (
    <div className="relative h-screen w-screen flex flex-col bg-gray-50">
      <Navbar/>
      <div
        className="flex-grow flex flex-col justify-around max-w-7xl mx-auto w-full border rounded-lg bg-white shadow-lg">
        <div className="flex-grow overflow-y-auto p-4 space-y-2 md:max-h-[80vh] max-h-[70vh]">
          {messages &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "sender" ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`p-3 rounded-lg max-w-xs ${
                    message.role === "sender"
                      ? "bg-green-300 text-gray-900"
                      : "bg-blue-300 text-gray-900"
                  }`}
                >
                  <span className="font-semibold">
                    {message.role === "sender" ? "You" : message.displayName}:
                  </span>{" "}
                  {message.text}
                </p>
              </div>
            ))}
        </div>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex items-center p-4 border-t bg-gray-100"
        >
          <input
            type="text"
            className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter message"
            value={chat}
            onChange={(e) => setChat(e.target.value)}
          />
          <button
            type="submit"
            className="ml-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
