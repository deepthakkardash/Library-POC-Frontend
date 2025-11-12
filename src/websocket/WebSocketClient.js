// src/websocket/WebSocketClient.js
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

export const connectWebSocket = (onBookAdded, onNotification) => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = over(socket);

  stompClient.connect({}, () => {
    console.log("✅ Connected to WebSocket");

    // When admin adds a book
    stompClient.subscribe("/topic/books", (message) => {
      const data = JSON.parse(message.body);
      console.log("📚 New Book Added:", data);
      onBookAdded && onBookAdded(data);
    });

    // When user borrows a book
    stompClient.subscribe("/topic/notifications", (message) => {
      const data = JSON.parse(message.body);
      console.log("🔔 Borrow Notification:", data);
      onNotification && onNotification(data);
    });
  }, (error) => {
    console.error("❌ WebSocket connection failed:", error);
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect(() => console.log("🔌 Disconnected from WebSocket"));
  }
};
