import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const getAuthStatus = async () => {
    try {
      const response = await axios.get("https://vision-global.onrender.com/auth/is_logged_in", {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        setIsLoggedIn(true);
        setRole(response.data.role);
        setUser(response.data.user);
          
      } else {
        setIsLoggedIn(false);
        setRole(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      setIsLoggedIn(false);
      setRole(null);
      setUser(null);
    }
  }
  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, user, setUser, getAuthStatus }}>
      {children}
    </AppContext.Provider>
  );

}
