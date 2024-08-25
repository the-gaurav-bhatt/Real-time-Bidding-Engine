"use client";
import { useEffect, useState } from "react";

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if window is defined to ensure we're on the client-side
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("creator");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const saveUser = (userData: any) => {
    setUser(userData);
    localStorage.setItem("creator", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return { user, saveUser, logout };
};
export default useUser;
