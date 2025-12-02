import React, { createContext, useContext, useReducer } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BudgetContext = createContext();

const budgetReducer = (state, action) => {
  switch (action.type) {
    case "SET_BUDGETS":
      return {
        ...state,
        budgets: action.payload,
        loading: false,
      };
    case "ADD_BUDGET":
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
      };
    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((budget) =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };
    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter((budget) => budget.id !== action.payload),
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  budgets: [],
  loading: false,
};

export const BudgetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  // Fetch all budgets
  const fetchBudgets = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.get("/api/budgets");
      dispatch({ type: "SET_BUDGETS", payload: response.data.data.budgets });
      return { success: true, data: response.data.data.budgets };
    } catch (error) {
      // Silently fail for fetch operations - don't show error toast
      console.error("Failed to fetch budgets:", error);
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, message: "Failed to fetch budgets" };
    }
  };

  // Add new budget
  const addBudget = async (budgetData) => {
    try {
      const response = await axios.post("/api/budgets", budgetData);
      const newBudget = response.data.data.budget;

      dispatch({ type: "ADD_BUDGET", payload: newBudget });
      toast.success("💰 Budget created successfully!");

      return { success: true, data: newBudget };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create budget";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update budget
  const updateBudget = async (id, budgetData) => {
    try {
      const response = await axios.put(`/api/budgets/${id}`, budgetData);
      const updatedBudget = response.data.data.budget;

      dispatch({ type: "UPDATE_BUDGET", payload: updatedBudget });
      toast.success("✏️ Budget updated successfully!");

      return { success: true, data: updatedBudget };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update budget";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete budget
  const deleteBudget = async (id) => {
    try {
      await axios.delete(`/api/budgets/${id}`);

      dispatch({ type: "DELETE_BUDGET", payload: id });
      toast.success("🗑️ Budget deleted successfully!");

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete budget";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update spent amount for a category
  const updateBudgetSpent = async (category, amount, operation = "add") => {
    try {
      const response = await axios.post("/api/budgets/update-spent", {
        category,
        amount,
        operation,
      });

      if (response.data.data?.budget) {
        dispatch({ type: "UPDATE_BUDGET", payload: response.data.data.budget });

        // Show alert if budget exceeded
        if (response.data.data.exceeded) {
          toast.error(
            `⚠️ Budget exceeded for ${category}! ${response.data.data.percentage}% used`,
            { duration: 5000 }
          );
        } else if (response.data.data.percentage >= 80) {
          toast.warning(
            `⚠️ You've used ${response.data.data.percentage}% of your ${category} budget`,
            { duration: 4000 }
          );
        }
      }

      return { success: true, data: response.data.data };
    } catch (error) {
      console.error("Failed to update budget spent:", error);
      return { success: false };
    }
  };

  const value = {
    budgets: state.budgets,
    loading: state.loading,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    updateBudgetSpent,
  };

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudgets must be used within a BudgetProvider");
  }
  return context;
};
