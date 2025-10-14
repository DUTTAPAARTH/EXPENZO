import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../utils/api";
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

// Initial state with mock user for development
const initialState = {
  user: {
    id: "mock-user",
    name: "Demo User",
    email: "demo@expenzo.com",
    avatar: "🚀",
  },
  token: "mock-token",
  isAuthenticated: true,
  loading: false,
  error: null,
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      // Token will be automatically added by api interceptor
      localStorage.setItem("token", token);
    } else {
      // Token will be automatically removed by api interceptor
      localStorage.removeItem("token");
    }
  };

  // Load user on initial app load - disabled for development
  /*
  useEffect(() => {
    if (state.token) {
      setAuthToken(state.token);
      loadUser();
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);
  */

  // Load user from token
  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();

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
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await authAPI.register(userData);

      const { user, token } = response.data.data;

      setAuthToken(token);

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
      console.log("🔄 Starting login with:", {
        email: credentials.email,
        password: "***",
      });
      console.log(
        "🌐 API Base URL:",
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      );
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await authAPI.login(credentials);
      console.log("✅ Login API response:", response.data);

      const { user, token } = response.data.data;

      setAuthToken(token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });

      toast.success(`🎯 Welcome back, ${user.name}!`);

      return { success: true, user, token };
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error config:", error.config);
      const message = error.response?.data?.message || "Login failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }

    setAuthToken(null);
    dispatch({ type: "LOGOUT" });
    toast.success("👋 Logged out successfully!");
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await authAPI.updateProfile(userData);

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

      await authAPI.changePassword(passwordData);

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

      await authAPI.deleteAccount(passwordData);

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
