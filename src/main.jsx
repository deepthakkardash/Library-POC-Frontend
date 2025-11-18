window.global = window;

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WebSocketProvider } from "./Context/WebSocketContext.jsx";
import { LoginProvider } from './Context/LoginContext.jsx';


createRoot(document.getElementById('root')).render(

  <LoginProvider>
    <WebSocketProvider>   {/* ✅ WebSocket active globally */}
      <App />
    </WebSocketProvider>
  </LoginProvider>
);
