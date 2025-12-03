import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;
let isConnected = false;

export const connectWebSocket = async (
  onBookAdded,
  onNotification,
  userId,
  userType
) => {
  if (isConnected && stompClient !== null) {
    console.log("🟡 WebSocket already connected, ignoring...");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ Cannot start WebSocket, JWT missing.");
    return;
  }

  // Create WebSocket
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = over(socket);

  stompClient.connect(
    {
      Authorization: "Bearer " + token,
    //  userId: userId, // 👈 required for online tracking  // now extracting so userId token se a jaygi
    },
    () => {
      console.log("✅ WebSocket Connected");
      isConnected = true;


      // PERSONAL NOTIFICATION CHANNEL

      stompClient.subscribe("/user/queue/notifications", (message) => {
        const data = JSON.parse(message.body);
        console.log("📨 Notification received :", data);
        
        fetch(`http://localhost:8080/notifications/read/${data.notf_id}`, {
        method: "PUT",
        credentials: "include"
      }); 
        onNotification && onNotification(data);

      });
    },

    (error) => {
      console.error("❌ WebSocket Error:", error);
      isConnected = false;

      // Auto reconnect after 3 seconds
      setTimeout(() => {
        console.log("🔄 Reconnecting WebSocket...");
        connectWebSocket(onBookAdded, onNotification, userId, userType);
      }, 3000);
    }
  );

  // Disable heartbeats for local dev
  stompClient.heartbeat.outgoing = 0;
  stompClient.heartbeat.incoming = 0;
};

export const disconnectWebSocket = () => {
  if (stompClient && isConnected) {
    stompClient.disconnect(() => {
      console.log("🔌 WebSocket Disconnected");
      isConnected = false;
      stompClient = null;
    });
  }
};
