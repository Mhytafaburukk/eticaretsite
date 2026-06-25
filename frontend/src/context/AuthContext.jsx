import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchAddresses(parsedUser.userId || parsedUser.id);
    }
  }, []);

  const fetchAddresses = async (userId) => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5147/api/Users/${userId}/addresses`);
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error("Error fetching addresses", err);
    }
  };

  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    await fetchAddresses(userData.userId || userData.id);
  };

  const logout = () => {
    setUser(null);
    setAddresses([]);
    localStorage.removeItem('user');
  };

  const refreshAddresses = () => {
    if (user) {
      fetchAddresses(user.userId || user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, addresses, login, logout, refreshAddresses }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
