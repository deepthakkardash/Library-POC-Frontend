// src/context/WebSocketContext.jsx
import React, { createContext, useEffect } from "react";
import { connectWebSocket, disconnectWebSocket } from "../websocket/WebSocketClient";
import { toast } from "react-toastify";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {

  useEffect(() => {
    connectWebSocket(
      (book) => {
        toast.info(`📘 New Book Added: ${book.title}`);
      },
      (notification) => {
        toast.success(`🔔 ${notification.message}`);
      }
    );

    return () => disconnectWebSocket();
  }, []);

  return (
    <WebSocketContext.Provider value={{}}>
      {children}
    </WebSocketContext.Provider>
  );
};
