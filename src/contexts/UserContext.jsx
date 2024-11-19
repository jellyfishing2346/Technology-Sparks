import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      setUserId(savedUserId);
    } else {
      const newUserId = generateRandomUserId();
      setUserId(newUserId);
      localStorage.setItem('userId', newUserId);
    }
  }, []);

  function generateRandomUserId() {
    return Math.random().toString(36).substr(2, 9);
  }

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
}
