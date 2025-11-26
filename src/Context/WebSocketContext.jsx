import React, { createContext, useEffect, useContext } from "react";
import { connectWebSocket, disconnectWebSocket } from "../websocket/WebSocketClient";
import { toast } from "react-toastify";
import { LoginContext } from "./LoginContext";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {

  const { logged, userId, userType } = useContext(LoginContext);

  useEffect(() => {
    if (logged && userId) {
      connectWebSocket(
        (book) => toast.info(`📘 New Book Added: ${book.title}`),
        (notification) => toast.success(`🔔 ${notification.message}`),
        userId,
        userType
      );
    }

    return () => disconnectWebSocket();
  }, [logged]);

  return (
    <WebSocketContext.Provider value={{}}>
      {children}
    </WebSocketContext.Provider>
  );
};
