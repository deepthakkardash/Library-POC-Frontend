import SockJS from "sockjs-client";
import { over } from "stompjs";
import { getJwt } from "./getJwt";

let stompClient = null;

export const connectWebSocket = async(onBookAdded, onNotification, userId, userType) => {

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

    // 🔹 Broadcast or user-level notification (from backend)
    // stompClient.subscribe("/topic/user", (message) => {
    //   const data = JSON.parse(message.body);
    //   console.log("📢 User Notification (from /topic/user):", data);
    //   onNotification && onNotification(data);
    // });

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

     // Private notification for logged-in user
    stompClient.subscribe("/user/queue/notification", (message) => {
      const data = JSON.parse(message.body);
      onNotification && onNotification(data);
    });

 

    // 🔹 When any user borrows → notify all admins
    // stompClient.subscribe("/topic/admin", (message) => {
    //   const data = JSON.parse(message.body);
    //   console.log("🔔 Admin Notification (from /topic/admin):", data);
    //   onNotification && onNotification(data);
    // });

    // 🔹 Broadcast or user-level notification (from backend)
    // stompClient.subscribe("/topic/user", (message) => {
    //   const data = JSON.parse(message.body);
    //   console.log("📢 User Notification (from /topic/user):", data);
    //   onNotification && onNotification(data);
    // });

    // stompClient.subscribe("/topic/all", (message) => {
    //   const data = JSON.parse(message.body);
    //   console.log("🌍 Broadcast Notification (from /topic/all):", data);
    //   onNotification && onNotification(data);
    // });

    //  Private notification (specific user/admin)
    // if (userId) {
    //   stompClient.subscribe(`/queue/user-${userId}`, (message) => {
    //     const data = JSON.parse(message.body);
    //     console.log(`📬 Private Notification for User ${userId}:`, data);
    //     onNotification && onNotification(data);
    //   });
    // }

  }, (error) => {
    console.error("❌ WebSocket connection failed:", error);
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect(() => console.log("🔌 Disconnected from WebSocket"));
  }
};
