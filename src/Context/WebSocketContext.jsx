import React, { createContext, useEffect } from "react";
import { connectWebSocket, disconnectWebSocket } from "../websocket/WebSocketClient";
import { toast } from "react-toastify";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const userId = localStorage.getItem("userid");

  useEffect(() => {
    if (!userId) return; // do NOT connect if not logged in

    connectWebSocket(
      (book) => {
        toast.info(`📘 New Book Added: ${book.title}`);
      },
      (notification) => {
        toast.success(`🔔 ${notification.message}`);
      },
      userId
    );

    return () => disconnectWebSocket();
  }, [userId]);

  return (
    <WebSocketContext.Provider value={{}}>
      {children}
    </WebSocketContext.Provider>
  );
};
