import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

let isConnected = false;

export const connectWebSocket = (onBookAdded, onNotification, userId, userType) => {

  if (isConnected) {
    console.log("🟡 WebSocket already connected, skipping...");
    return;
  }
  isConnected = true;

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ No JWT in localStorage. User not logged in?");
    return;
  }

  // Add token in Query Param
const socket = new SockJS("http://localhost:8080/ws"); 
  stompClient = over(socket);

  stompClient.connect(
    { Authorization: `Bearer ${token}` },
      () => onConnected(onBookAdded, onNotification, userType),
    onError
  );
};

  const onConnected = (onBookAdded, onNotification, userType) => {
  isConnected = true;
  console.log("🟢 WebSocket Connected!");


    // 🔹 When admin adds a book → notify all users
    stompClient.subscribe("/topic/books", (message) => {
      const data = JSON.parse(message.body);
      console.log("📚 New Book Added:", data);
      onBookAdded && onBookAdded(data);
    });

    //  Borrow book → notify all admins
    if (userType === "Admin") {
      stompClient.subscribe("/topic/admin", (message) => {
        const data = JSON.parse(message.body);
        onNotification && onNotification(data);
      });
    }
  };

const onError = (error) => {
  isConnected = false;
  console.error("❌ WebSocket connection failed:", error);
};

export const disconnectWebSocket = () => {
  if (stompClient && isConnected ) {
    stompClient.disconnect(() => {
      console.log("🔌 Disconnected WS");
      isConnected = false;
    });
  }
};
