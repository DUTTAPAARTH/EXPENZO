import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if it exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }

    return response;
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        error.response?.data
      );
    }

    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];

      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData) => api.post("/api/auth/register", userData),
  login: (credentials) => api.post("/api/auth/login", credentials),
  logout: () => api.post("/api/auth/logout"),
  getProfile: () => api.get("/api/auth/me"),
  updateProfile: (userData) => api.put("/api/auth/profile", userData),
  changePassword: (passwordData) => api.put("/api/auth/password", passwordData),
  deleteAccount: (passwordData) =>
    api.delete("/api/auth/account", { data: passwordData }),
};

export const expenseAPI = {
  getExpenses: (params) => api.get("/api/expenses", { params }),
  getExpense: (id) => api.get(`/api/expenses/${id}`),
  createExpense: (expenseData) => api.post("/api/expenses", expenseData),
  updateExpense: (id, expenseData) =>
    api.put(`/api/expenses/${id}`, expenseData),
  deleteExpense: (id) => api.delete(`/api/expenses/${id}`),
  getStatistics: () => api.get("/api/expenses/stats/summary"),
};

export const groupAPI = {
  getGroups: () => api.get("/api/groups"),
  getGroup: (id) => api.get(`/api/groups/${id}`),
  createGroup: (groupData) => api.post("/api/groups", groupData),
  updateGroup: (id, groupData) => api.put(`/api/groups/${id}`, groupData),
  deleteGroup: (id) => api.delete(`/api/groups/${id}`),
  addMember: (id, memberData) =>
    api.post(`/api/groups/${id}/members`, memberData),
  removeMember: (id, userId) =>
    api.delete(`/api/groups/${id}/members/${userId}`),
  addExpense: (id, expenseData) =>
    api.post(`/api/groups/${id}/expenses`, expenseData),
  getSettlements: (id) => api.get(`/api/groups/${id}/settlements`),
};

export const insightAPI = {
  getSummary: () => api.get("/api/insights/summary"),
  getAIInsights: () => api.get("/api/insights/ai"),
  getTrends: (period) =>
    api.get("/api/insights/trends", { params: { period } }),
};

export default api;
