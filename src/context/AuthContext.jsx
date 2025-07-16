import React, { createContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const AuthContext = createContext();

const USERS = [
  { email: "admin@gmail.com", password: "admin", role: "admin" },
  { email: "hr@gmail.com", password: "hr", role: "hr" },
  { email: "employee@gmail.com", password: "employee", role: "employee" },
];

const AuthProvider = ({ children }) => {
  const employees = useSelector((state) => state.users.employees);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (email, password) => {
    // Try Redux employees first
    const found = employees.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      return found;
    }
    // Fallback to static users
    const fallback = USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (fallback) setUser(fallback);
    return fallback;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
