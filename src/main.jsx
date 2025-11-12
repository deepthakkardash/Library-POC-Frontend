import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WebSocketProvider } from "./context/WebSocketContext.jsx";

createRoot(document.getElementById('root')).render(
    <WebSocketProvider>   {/* ✅ WebSocket active globally */}
    <App />
  </WebSocketProvider>
);
