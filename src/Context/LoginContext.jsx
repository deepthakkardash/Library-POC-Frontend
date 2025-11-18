import React, { createContext, useState, useEffect } from 'react';
import { disconnectWebSocket } from "../websocket/WebSocketClient";

export let LoginContext = createContext();

export let LoginProvider = ({ children }) => {

  const getInitialLogged = () => {
    const savedLogged = localStorage.getItem('logged');
    return savedLogged === 'true';
  };

  let [logged, setLog] = useState(getInitialLogged);

  useEffect(() => {
    localStorage.setItem('logged', logged);
  }, [logged]);

  // ✅ updated login function
  function login(user) {
    localStorage.setItem("userid", user.userId);
    localStorage.setItem("username", user.username);
    localStorage.setItem("usertype", user.userType);
    localStorage.setItem("logged", true);

    setLog(true);
  }

  function logout() {
    setLog(false);

    try {
      disconnectWebSocket();
    } catch (e) {
      console.log("WS already disconnected");
    }

    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    localStorage.removeItem('usertype');
    localStorage.removeItem('logged');
  }

  return (
    <LoginContext.Provider value={{ logged, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
