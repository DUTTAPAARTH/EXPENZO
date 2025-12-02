import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Create context
const AuthContext = createContext();

// Auth states
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: true,
  error: null,
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  };

  // Load user on initial app load
  useEffect(() => {
    if (state.token) {
      setAuthToken(state.token);
      loadUser();
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Load user from token
  const loadUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data.data.user,
          token: state.token,
        },
      });
    } catch (error) {
      console.error("Load user error:", error);
      dispatch({ type: "AUTH_ERROR", payload: error.response?.data?.message });
      setAuthToken(null);
      localStorage.removeItem("user");
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await axios.post("/api/auth/register", userData);

      const { user, token } = response.data.data;

      setAuthToken(token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });

      toast.success(`🎉 Welcome to Expenzo, ${user.name}!`);

      return { success: true, user, token };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await axios.post("/api/auth/login", credentials);

      const { user, token } = response.data.data;

      setAuthToken(token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });

      toast.success(`🎯 Welcome back, ${user.name}!`);

      return { success: true, user, token };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }

    setAuthToken(null);
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    toast.success("👋 Logged out successfully!");
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await axios.put("/api/auth/profile", userData);

      const { user } = response.data.data;

      dispatch({ type: "UPDATE_USER", payload: user });
      dispatch({ type: "SET_LOADING", payload: false });

      toast.success("✅ Profile updated successfully!");

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      await axios.put("/api/auth/password", passwordData);

      dispatch({ type: "SET_LOADING", payload: false });

      toast.success("🔐 Password updated successfully!");

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed";
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete account
  const deleteAccount = async (passwordData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      await axios.delete("/api/auth/account", { data: passwordData });

      setAuthToken(null);
      dispatch({ type: "LOGOUT" });

      toast.success("🗑️ Account deleted successfully!");

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Account deletion failed";
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
