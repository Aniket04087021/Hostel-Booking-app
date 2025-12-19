import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hostel-booking-app-3.onrender.com/api/v1";

  // Check if user is logged in on mount
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(data.user);
      setIsAdmin(data.user.isAdmin || false);
      setLoading(false);
    } catch (error) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setUser(data.user);
      setIsAdmin(data.user.isAdmin || false);
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return { success: false, error: error.response?.data?.message };
    }
  };

  const login = async (formData) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setUser(data.user);
      setIsAdmin(data.user.isAdmin || false);
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, error: error.response?.data?.message };
    }
  };

  const adminLogin = async (formData) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/admin/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setUser(data.user);
      setIsAdmin(true);
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin login failed");
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
      setUser(null);
      setIsAdmin(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear local state even if API call fails
      setUser(null);
      setIsAdmin(false);
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    signup,
    login,
    adminLogin,
    logout,
    checkUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

