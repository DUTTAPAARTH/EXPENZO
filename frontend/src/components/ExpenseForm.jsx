import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Calendar, DollarSign, FileText, Hash } from "lucide-react";

const ExpenseForm = ({
  onSubmit,
  onCancel,
  expense = null,
  isModal = true,
}) => {
  const [formData, setFormData] = useState({
    description: expense?.description || "",
    amount: expense?.amount || "",
    category: expense?.category || "",
    date: expense?.date
      ? new Date(expense.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    paymentMethod: expense?.paymentMethod || "cash",
  });

  const categories = [
    "🍔 Food & Dining",
    "🚗 Transportation",
    "🛍️ Shopping",
    "🏠 Bills & Utilities",
    "🎬 Entertainment",
    "💊 Healthcare",
    "📚 Education",
    "✈️ Travel",
    "💰 Other",
  ];

  const paymentMethods = [
    { value: "cash", label: "💵 Cash" },
    { value: "card", label: "💳 Card" },
    { value: "upi", label: "📱 UPI" },
    { value: "bank-transfer", label: "🏦 Bank Transfer" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Modal form for Dashboard
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-dark-200 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-dark-base dark:text-white">
            {expense ? "✏️ Edit Expense" : "➕ Add Expense"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-300 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText size={16} className="inline mr-2" />
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What did you spend on?"
              className="w-full px-4 py-3 rounded-button border border-gray-300 dark:border-dark-300 dark:bg-dark-300 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign size={16} className="inline mr-2" />
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 rounded-button border border-gray-300 dark:border-dark-300 dark:bg-dark-300 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Hash size={16} className="inline mr-2" />
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-button border border-gray-300 dark:border-dark-300 dark:bg-dark-300 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-button border border-gray-300 dark:border-dark-300 dark:bg-dark-300 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center justify-center p-3 rounded-button border cursor-pointer transition-all ${
                    formData.paymentMethod === method.value
                      ? "border-primary-500 bg-primary-500 bg-opacity-10 text-primary-500"
                      : "border-gray-300 dark:border-dark-300 hover:border-primary-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={formData.paymentMethod === method.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-dark-300 text-gray-700 dark:text-gray-300 rounded-button hover:bg-gray-50 dark:hover:bg-dark-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-500 text-white px-4 py-3 rounded-button hover:bg-primary-600 transition-all font-medium"
            >
              {expense ? "Update" : "Add"} Expense
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseForm;
