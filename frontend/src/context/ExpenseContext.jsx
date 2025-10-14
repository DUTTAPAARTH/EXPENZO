import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

// Create context
const ExpenseContext = createContext();

// Expense states
const expenseReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_EXPENSES":
      return {
        ...state,
        expenses: action.payload.expenses,
        pagination: action.payload.pagination,
        summary: action.payload.summary,
        loading: false,
      };
    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        summary: {
          ...state.summary,
          totalExpenses: state.summary.totalExpenses + 1,
          totalAmount: state.summary.totalAmount + action.payload.amount,
        },
      };
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense
        ),
      };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense._id !== action.payload
        ),
        summary: {
          ...state.summary,
          totalExpenses: Math.max(0, state.summary.totalExpenses - 1),
        },
      };
    case "SET_STATISTICS":
      return {
        ...state,
        statistics: action.payload,
        statisticsLoading: false,
      };
    case "SET_INSIGHTS":
      return {
        ...state,
        insights: action.payload,
        insightsLoading: false,
      };
    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: initialFilters,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Initial filters
const initialFilters = {
  category: "",
  startDate: "",
  endDate: "",
  paymentMethod: "",
  minAmount: "",
  maxAmount: "",
  sort: "-date",
};

// Initial state
const initialState = {
  expenses: [],
  pagination: null,
  summary: null,
  statistics: null,
  insights: null,
  filters: initialFilters,
  loading: false,
  statisticsLoading: false,
  insightsLoading: false,
  error: null,
};

// Expense Provider Component
export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const { isAuthenticated, token } = useAuth();

  // Load expenses when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchExpenses();
    }
  }, [isAuthenticated, token]);

  // Fetch expenses with filters and pagination
  const fetchExpenses = async (page = 1, filters = {}) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const params = new URLSearchParams({
        page: page.toString(),
        ...state.filters,
        ...filters,
      });

      // Remove empty filters
      for (const [key, value] of params.entries()) {
        if (!value || value === "") {
          params.delete(key);
        }
      }

      const response = await axios.get(`/api/expenses?${params}`);

      dispatch({
        type: "SET_EXPENSES",
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch expenses";
      dispatch({ type: "SET_ERROR", payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Get single expense
  const getExpense = async (id) => {
    try {
      const response = await axios.get(`/api/expenses/${id}`);
      return { success: true, data: response.data.data.expense };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch expense";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Add new expense
  const addExpense = async (expenseData) => {
    try {
      const response = await axios.post("/api/expenses", expenseData);

      const newExpense = response.data.data.expense;

      dispatch({ type: "ADD_EXPENSE", payload: newExpense });

      toast.success("💰 Expense added successfully!");

      return { success: true, data: newExpense };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add expense";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update expense
  const updateExpense = async (id, expenseData) => {
    try {
      const response = await axios.put(`/api/expenses/${id}`, expenseData);

      const updatedExpense = response.data.data.expense;

      dispatch({ type: "UPDATE_EXPENSE", payload: updatedExpense });

      toast.success("✏️ Expense updated successfully!");

      return { success: true, data: updatedExpense };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update expense";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);

      dispatch({ type: "DELETE_EXPENSE", payload: id });

      toast.success("🗑️ Expense deleted successfully!");

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete expense";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Get expense statistics
  const fetchStatistics = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await axios.get("/api/expenses/stats/summary");

      dispatch({ type: "SET_STATISTICS", payload: response.data.data });

      return { success: true, data: response.data.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch statistics";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, message };
    }
  };

  // Get AI insights
  const fetchInsights = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await axios.get("/api/insights/ai");

      dispatch({ type: "SET_INSIGHTS", payload: response.data.data });

      return { success: true, data: response.data.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch insights";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, message };
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTER", payload: filters });
    fetchExpenses(1, filters);
  };

  // Clear filters
  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
    fetchExpenses(1, {});
  };

  // Get expenses by category for charts
  const getExpensesByCategory = () => {
    const categoryTotals = {};
    state.expenses.forEach((expense) => {
      const category = expense.category;
      categoryTotals[category] =
        (categoryTotals[category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([category, total]) => ({
        category,
        total,
        formatted: `₹${total.toFixed(2)}`,
      }))
      .sort((a, b) => b.total - a.total);
  };

  // Get daily expenses for charts
  const getDailyExpenses = (days = 30) => {
    const now = new Date();
    const dailyTotals = {};

    // Initialize days
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dailyTotals[dateStr] = 0;
    }

    // Calculate daily totals
    state.expenses.forEach((expense) => {
      const dateStr = new Date(expense.date).toISOString().split("T")[0];
      if (dailyTotals.hasOwnProperty(dateStr)) {
        dailyTotals[dateStr] += expense.amount;
      }
    });

    return Object.entries(dailyTotals)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Get top expenses
  const getTopExpenses = (limit = 5) => {
    return [...state.expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  };

  // Get recent expenses
  const getRecentExpenses = (limit = 5) => {
    return [...state.expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  const value = {
    expenses: state.expenses,
    pagination: state.pagination,
    summary: state.summary,
    statistics: state.statistics,
    insights: state.insights,
    filters: state.filters,
    loading: state.loading,
    statisticsLoading: state.statisticsLoading,
    insightsLoading: state.insightsLoading,
    error: state.error,
    fetchExpenses,
    getExpense,
    addExpense,
    updateExpense,
    deleteExpense,
    fetchStatistics,
    fetchInsights,
    setFilters,
    clearFilters,
    getExpensesByCategory,
    getDailyExpenses,
    getTopExpenses,
    getRecentExpenses,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

// Custom hook to use expense context
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};

export default ExpenseContext;
