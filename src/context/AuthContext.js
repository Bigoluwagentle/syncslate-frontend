'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check localStorage

 
  useEffect(() => {
    const savedToken = localStorage.getItem('syncslate_token');
    const savedUser = localStorage.getItem('syncslate_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function login(newToken, newUser) {
    localStorage.setItem('syncslate_token', newToken);
    localStorage.setItem('syncslate_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem('syncslate_token');
    localStorage.removeItem('syncslate_user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// A small custom hook so other components can just call useAuth()
// instead of importing useContext + AuthContext everywhere.
export function useAuth() {
  return useContext(AuthContext);
}