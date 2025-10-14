import React, { createContext, useContext, useReducer, useEffect } from "react";

// Create context
const ThemeContext = createContext();

// Theme states
const themeReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_THEME":
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };
    case "SET_FONT_SIZE":
      return {
        ...state,
        fontSize: action.payload,
      };
    case "SET_ANIMATION":
      return {
        ...state,
        animations: action.payload,
      };
    case "SET_PREFERENCES":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  theme: localStorage.getItem("theme") || "light",
  fontSize: localStorage.getItem("fontSize") || "medium",
  animations: localStorage.getItem("animations") !== "false", // Default to true
  reduceMotion: false,
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme class
    if (state.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Store in localStorage
    localStorage.setItem("theme", state.theme);
  }, [state.theme]);

  // Apply font size
  useEffect(() => {
    const root = document.documentElement;

    // Remove previous font size classes
    root.classList.remove("text-sm", "text-base", "text-lg");

    // Apply new font size
    switch (state.fontSize) {
      case "small":
        root.classList.add("text-sm");
        break;
      case "large":
        root.classList.add("text-lg");
        break;
      default:
        root.classList.add("text-base");
    }

    localStorage.setItem("fontSize", state.fontSize);
  }, [state.fontSize]);

  // Apply animation preferences
  useEffect(() => {
    const root = document.documentElement;

    if (!state.animations || state.reduceMotion) {
      root.style.setProperty("--animation-duration", "0s");
      root.style.setProperty("--transition-duration", "0s");
    } else {
      root.style.removeProperty("--animation-duration");
      root.style.removeProperty("--transition-duration");
    }

    localStorage.setItem("animations", state.animations);
  }, [state.animations, state.reduceMotion]);

  // Detect system preferences
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    dispatch({
      type: "SET_PREFERENCES",
      payload: { reduceMotion: mediaQuery.matches },
    });

    const handleChange = (e) => {
      dispatch({
        type: "SET_PREFERENCES",
        payload: { reduceMotion: e.matches },
      });
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  // Set theme
  const setTheme = (theme) => {
    dispatch({ type: "SET_THEME", payload: theme });
  };

  // Set font size
  const setFontSize = (size) => {
    dispatch({ type: "SET_FONT_SIZE", payload: size });
  };

  // Toggle animations
  const toggleAnimations = () => {
    dispatch({ type: "SET_ANIMATION", payload: !state.animations });
  };

  // Set animations
  const setAnimations = (enabled) => {
    dispatch({ type: "SET_ANIMATION", payload: enabled });
  };

  // Get theme colors for components
  const getThemeColors = () => {
    return {
      primary: "#FFC300",
      secondary: "#2ECCB0",
      accent: "#00AEEF",
      dark: "#121212",
      cream: "#FFF8E7",
      success: "#2ECCB0",
      warning: "#FFC300",
      error: "#ef4444",
      info: "#00AEEF",
    };
  };

  // Get current theme status
  const isDark = state.theme === "dark";
  const isLight = state.theme === "light";

  // Get animation preferences
  const shouldAnimate = state.animations && !state.reduceMotion;

  const value = {
    theme: state.theme,
    fontSize: state.fontSize,
    animations: state.animations,
    reduceMotion: state.reduceMotion,
    isDark,
    isLight,
    shouldAnimate,
    toggleTheme,
    setTheme,
    setFontSize,
    toggleAnimations,
    setAnimations,
    getThemeColors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
