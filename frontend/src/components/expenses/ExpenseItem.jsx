import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Calendar, CreditCard } from "lucide-react";

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      "🍔 Food & Dining": "from-orange-500 to-red-500",
      "🚗 Transportation": "from-blue-500 to-cyan-500",
      "🛍️ Shopping": "from-pink-500 to-purple-500",
      "💡 Bills & Utilities": "from-yellow-500 to-orange-500",
      "🎬 Entertainment": "from-purple-500 to-indigo-500",
      "💪 Health & Fitness": "from-green-500 to-teal-500",
      "🏠 Rent & Housing": "from-indigo-500 to-blue-500",
      "📦 Others": "from-slate-500 to-slate-600",
    };
    return colors[category] || "from-slate-500 to-slate-600";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "credit card":
        return "💳";
      case "debit card":
        return "💳";
      case "upi":
        return "📱";
      case "cash":
        return "💵";
      case "net banking":
        return "🏦";
      default:
        return "💰";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-primary-500/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Category Badge & Info */}
        <div className="flex-1 min-w-0">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(
                expense.category
              )}`}
            >
              {expense.category}
            </span>
            {expense.isRecurring && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold text-primary-400 bg-primary-500/10 border border-primary-500/30 flex items-center gap-1">
                🔄 Recurring
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-white font-medium mb-1 line-clamp-2">
            {expense.description || "No description"}
          </p>

          {/* Date & Payment Method */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(expense.date)}
            </span>
            <span className="flex items-center gap-1">
              {getPaymentMethodIcon(expense.paymentMethod)}
              {expense.paymentMethod}
            </span>
          </div>
        </div>

        {/* Right: Amount & Actions */}
        <div className="flex flex-col items-end gap-2">
          {/* Amount */}
          <div className="text-right">
            <p className="text-2xl font-bold text-red-400">
              ₹{expense.amount?.toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(expense)}
              className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
              title="Edit expense"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(expense)}
              className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
              title="Delete expense"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseItem;
