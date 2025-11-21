import SockJS from "sockjs-client";
import { over } from "stompjs";
import { getJwt } from "./getJwt";

let stompClient = null;

let isConnected = false;

export const connectWebSocket = async(onBookAdded, onNotification, userId, userType) => {

  if (isConnected) {
    console.log("🟡 WebSocket already connected, skipping...");
    return;
  }
  isConnected = true;

  const token = await getJwt();
  if (!token) {
    console.error("❌ Cannot start WebSocket, JWT not available.");
    return;
  }

  // Add token in Query Param
const socket = new SockJS(`http://localhost:8080/ws?token=Bearer ${token}`, null, {
     withCredentials: true
  });
  stompClient = over(socket);

  stompClient.connect({}, () => {
    console.log("✅ Connected to WebSocket");


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

  }, (error) => {
    console.error("❌ WebSocket connection failed:", error);
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log("🔌 Disconnected WS");
      isConnected = false;
    });
  }
};
