import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

const RuleContext = createContext();

export const useRules = () => {
  const context = useContext(RuleContext);
  if (!context) {
    throw new Error("useRules must be used within a RuleProvider");
  }
  return context;
};

// Reducer
const ruleReducer = (state, action) => {
  switch (action.type) {
    case "SET_RULES":
      return {
        ...state,
        rules: action.payload,
        loading: false,
        error: null,
      };
    case "ADD_RULE":
      return {
        ...state,
        rules: [...state.rules, action.payload],
      };
    case "UPDATE_RULE":
      return {
        ...state,
        rules: state.rules.map((rule) =>
          rule.id === action.payload.id ? action.payload : rule
        ),
      };
    case "DELETE_RULE":
      return {
        ...state,
        rules: state.rules.filter((rule) => rule.id !== action.payload),
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
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

export const RuleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ruleReducer, {
    rules: [],
    loading: false,
    error: null,
  });

  // Fetch all rules
  const fetchRules = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios.get("/api/rules");
      dispatch({ type: "SET_RULES", payload: response.data.data.rules });
      return { success: true, data: response.data.data.rules };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch rules";
      dispatch({ type: "SET_ERROR", payload: message });
      console.error("Failed to fetch rules:", error);
      return { success: false, message };
    }
  }, []);

  // Add rule
  const addRule = useCallback(async (ruleData) => {
    try {
      const response = await axios.post("/api/rules", ruleData);
      dispatch({ type: "ADD_RULE", payload: response.data.data.rule });
      toast.success("Rule created successfully!");
      return { success: true, data: response.data.data.rule };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create rule";
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // Update rule
  const updateRule = useCallback(async (id, ruleData) => {
    try {
      const response = await axios.put(`/api/rules/${id}`, ruleData);
      dispatch({ type: "UPDATE_RULE", payload: response.data.data.rule });
      toast.success("Rule updated successfully!");
      return { success: true, data: response.data.data.rule };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update rule";
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // Delete rule
  const deleteRule = useCallback(async (id) => {
    try {
      await axios.delete(`/api/rules/${id}`);
      dispatch({ type: "DELETE_RULE", payload: id });
      toast.success("Rule deleted successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete rule";
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // Apply rules to an expense
  const applyRulesToExpense = useCallback(async (expense) => {
    try {
      const response = await axios.post("/api/rules/apply", { expense });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Failed to apply rules:", error);
      return { success: false };
    }
  }, []);

  // Test a rule
  const testRule = useCallback(async (condition, testValue) => {
    try {
      const response = await axios.post("/api/rules/test", {
        condition,
        testValue,
      });
      return {
        success: true,
        matches: response.data.data.matches,
      };
    } catch (error) {
      console.error("Failed to test rule:", error);
      return { success: false, matches: false };
    }
  }, []);

  const value = {
    rules: state.rules,
    loading: state.loading,
    error: state.error,
    fetchRules,
    addRule,
    updateRule,
    deleteRule,
    applyRulesToExpense,
    testRule,
  };

  return <RuleContext.Provider value={value}>{children}</RuleContext.Provider>;
};
