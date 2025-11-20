import React, { createContext, useState, useEffect } from 'react';

export let LoginContext = createContext();

export let LoginProvider = ({ children }) => {
  // Initialize from localStorage to persist state across refreshes
  const getInitialLogged = () => {
    const savedLogged = localStorage.getItem('logged');
    return savedLogged === 'true'; // returns true or false
  };

  const getInitialUserType = () => {
    return localStorage.getItem('usertype') || null;
  };

  const getInitialUserId = () => {
    const id = localStorage.getItem('userid');
    return id ? Number(id) : null;
  };

  const [logged, setLogged] = useState(getInitialLogged);
  const [userType, setUserType] = useState(getInitialUserType);
  const [userId, setUserId] = useState(getInitialUserId);

  useEffect(() => {
    // Sync logged state to localStorage on change
    localStorage.setItem('logged', logged);
    if (userType) localStorage.setItem('usertype', userType);
    if (userId) localStorage.setItem('userid', userId);
  }, [logged, userType, userId]);

  function login(id, username, type) {
    setLogged(true);
    setUserId(id);
    setUserType(type);

    localStorage.setItem('username', username);
    localStorage.setItem('userid', id);
    localStorage.setItem('usertype', type);
  }

  function logout() {
    setLogged(false);
    setUserId(null);
    setUserType(null);

    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('usertype');
    localStorage.removeItem('logged');
  }

  return (
    <LoginContext.Provider value={{ logged, login, logout, userType, userId }}>
      {children}
    </LoginContext.Provider>
  );
};
