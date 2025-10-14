import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Calendar, CreditCard } from "lucide-react";

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case "cash":
        return "💵";
      case "card":
        return "💳";
      case "upi":
        return "📱";
      case "bank-transfer":
        return "🏦";
      default:
        return "💰";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "🍔 Food & Dining":
        "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
      "🚗 Transportation":
        "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
      "🛍️ Shopping":
        "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
      "🏠 Bills & Utilities":
        "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
      "🎬 Entertainment":
        "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300",
      "💊 Healthcare":
        "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300",
      "📚 Education":
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300",
      "✈️ Travel":
        "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
      "💰 Other":
        "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    };
    return colors[category] || colors["💰 Other"];
  };

  return (
    <motion.div
      className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-start justify-between">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                expense.category
              )}`}
            >
              {expense.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {getPaymentIcon(expense.paymentMethod)}
            </span>
          </div>

          {/* Description */}
          <h3 className="font-semibold text-dark-base dark:text-white mb-1 truncate">
            {expense.description}
          </h3>

          {/* Date */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={14} className="mr-1" />
            {formatDate(expense.date)}
          </div>
        </div>

        {/* Amount and Actions */}
        <div className="flex flex-col items-end">
          {/* Amount */}
          <div className="text-lg font-bold text-red-500 mb-2">
            -{formatAmount(expense.amount)}
          </div>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(expense);
              }}
              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
              title="Edit expense"
            >
              <Edit2 size={14} className="text-blue-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(expense._id);
              }}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
              title="Delete expense"
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseCard;
