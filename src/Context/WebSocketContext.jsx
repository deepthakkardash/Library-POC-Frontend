// src/context/WebSocketContext.jsx
import React, { createContext, useEffect, useContext } from "react";
import { connectWebSocket, disconnectWebSocket } from "../websocket/WebSocketClient";
import { toast } from "react-toastify";
import { LoginContext } from "./LoginContext";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {

  const { logged } = useContext(LoginContext);

  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    if (logged) {
      console.log("🔐 User logged in → Establishing WebSocket connection...");
      
    connectWebSocket(
        (book) => toast.info(`📘 New Book Added: ${book.title}`),
        (notification) => toast.success(`🔔 ${notification.message}`),
        userId
      );
    } else {
      console.log("⏳ User NOT logged in → WebSocket NOT connected...");
    }

    return () => disconnectWebSocket();
  }, [logged]);

  return (
    <WebSocketContext.Provider value={{}}>
      {children}
    </WebSocketContext.Provider>
  );
};
