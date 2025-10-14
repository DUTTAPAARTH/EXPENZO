// Utility functions for Expenzo

// Format currency
export const formatCurrency = (amount, currency = "INR") => {
  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
  };

  const symbol = currencySymbols[currency] || "₹";
  return `${symbol}${amount.toFixed(2)}`;
};

// Format date
export const formatDate = (date, format = "short") => {
  const d = new Date(date);

  const options = {
    short: { month: "short", day: "numeric" },
    medium: { year: "numeric", month: "short", day: "numeric" },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    },
    time: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
    datetime: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  };

  return d.toLocaleDateString("en-IN", options[format] || options.medium);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(date, "short");
};

// Get category emoji
export const getCategoryEmoji = (category) => {
  const emojiMap = {
    "Food & Dining": "🍽️",
    Transportation: "🚗",
    Shopping: "🛍️",
    Entertainment: "🎬",
    "Bills & Utilities": "📱",
    Healthcare: "🏥",
    Education: "📚",
    Travel: "✈️",
    Groceries: "🛒",
    Fuel: "⛽",
    "Coffee & Tea": "☕",
    "Online Services": "💻",
    "Gifts & Donations": "🎁",
    Fitness: "💪",
    "Beauty & Personal Care": "💄",
    "Home & Garden": "🏠",
    Insurance: "🛡️",
    Investments: "📈",
    Other: "💸",
  };
  return emojiMap[category] || "💸";
};

// Get payment method emoji
export const getPaymentMethodEmoji = (method) => {
  const emojiMap = {
    Cash: "💵",
    "Credit Card": "💳",
    "Debit Card": "💳",
    UPI: "📱",
    "Net Banking": "🏦",
    Wallet: "👛",
    Other: "💰",
  };
  return emojiMap[method] || "💰";
};

// Generate random avatar emoji
export const getRandomAvatar = () => {
  const avatars = [
    "😊",
    "😎",
    "🤓",
    "🥳",
    "🤗",
    "😋",
    "🤔",
    "😌",
    "🙃",
    "😇",
    "🤠",
    "🥰",
    "😍",
    "🤩",
    "🤯",
    "🥴",
    "😴",
    "🤭",
    "🤫",
    "🤐",
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const checks = {
    length: password.length >= 6,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let strength = "weak";
  if (score >= 4) strength = "strong";
  else if (score >= 3) strength = "medium";

  return { ...checks, score, strength };
};

// Generate color based on category
export const getCategoryColor = (category) => {
  const colors = {
    "Food & Dining": "#f59e0b",
    Transportation: "#3b82f6",
    Shopping: "#ec4899",
    Entertainment: "#8b5cf6",
    "Bills & Utilities": "#ef4444",
    Healthcare: "#10b981",
    Education: "#6366f1",
    Travel: "#06b6d4",
    Groceries: "#84cc16",
    Fuel: "#f97316",
    "Coffee & Tea": "#a16207",
    "Online Services": "#6b7280",
    "Gifts & Donations": "#db2777",
    Fitness: "#059669",
    "Beauty & Personal Care": "#d946ef",
    "Home & Garden": "#65a30d",
    Insurance: "#374151",
    Investments: "#dc2626",
    Other: "#6b7280",
  };
  return colors[category] || "#6b7280";
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Get date range
export const getDateRange = (period) => {
  const now = new Date();
  const start = new Date();

  switch (period) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "week":
      start.setDate(now.getDate() - 7);
      break;
    case "month":
      start.setMonth(now.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start.setMonth(now.getMonth() - 1);
  }

  return { start, end: now };
};

// Format number with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  }
};

// Download file
export const downloadFile = (data, filename, type = "text/csv") => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Storage set error:", error);
    }
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
};

export default {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  getCategoryEmoji,
  getPaymentMethodEmoji,
  getRandomAvatar,
  isValidEmail,
  validatePassword,
  getCategoryColor,
  debounce,
  throttle,
  generateId,
  calculatePercentage,
  getDateRange,
  formatNumber,
  truncateText,
  isMobile,
  copyToClipboard,
  downloadFile,
  storage,
};
