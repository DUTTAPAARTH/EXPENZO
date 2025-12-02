import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  DollarSign,
  Tag,
  Calendar,
  CreditCard,
  FileText,
  Check,
  X,
} from "lucide-react";

const AddExpense = () => {
  const navigate = useNavigate();
  const { addExpense, loading } = useExpenses();
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
  });

  const handleAddExpense = async (expenseData) => {
    const result = await addExpense(expenseData);
    if (result.success) {
      toast.success("✅ Expense added successfully!");
      navigate("/dashboard");
    }
  };

  const handleQuickAdd = async (quickExpense) => {
    await handleAddExpense({
      ...quickExpense,
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
    });
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    await handleAddExpense(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const quickExpenses = [
    {
      description: "Coffee",
      amount: 150,
      category: "🍔 Food & Dining",
      emoji: "☕",
    },
    {
      description: "Bus Ride",
      amount: 50,
      category: "🚗 Transportation",
      emoji: "🚌",
    },
    {
      description: "Lunch",
      amount: 300,
      category: "🍔 Food & Dining",
      emoji: "🍽️",
    },
    {
      description: "Parking",
      amount: 100,
      category: "🚗 Transportation",
      emoji: "🅿️",
    },
  ];

  const categories = [
    "🍔 Food & Dining",
    "🚗 Transportation",
    "🛍️ Shopping",
    "💡 Bills & Utilities",
    "🏠 Rent & Housing",
    "🎬 Entertainment",
    "💪 Health & Fitness",
    "✈️ Travel",
    "📦 Others",
  ];

  const paymentMethods = [
    { value: "cash", label: "💵 Cash", icon: "💵" },
    { value: "card", label: "💳 Card", icon: "💳" },
    { value: "upi", label: "📱 UPI", icon: "📱" },
    { value: "bank", label: "🏦 Bank Transfer", icon: "🏦" },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Add Expense</h1>
          <p className="text-sm text-slate-400">Track your spending easily</p>
        </div>
      </div>

      {/* Quick Add Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          ⚡ Quick Add
          <span className="text-xs text-slate-500 font-normal">
            (One-tap expenses)
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickExpenses.map((expense, index) => (
            <motion.button
              key={expense.description}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleQuickAdd(expense)}
              disabled={loading}
              className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-primary-500/50 rounded-lg transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {expense.emoji}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {expense.description}
                  </span>
                </div>
                <span className="text-primary-400 font-bold text-sm">
                  ₹{expense.amount}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Custom Form Toggle */}
      {!showCustomForm ? (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={() => setShowCustomForm(true)}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Add Custom Expense</span>
        </motion.button>
      ) : (
        /* Custom Expense Form */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Custom Expense</h2>
            <button
              onClick={() => setShowCustomForm(false)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Description *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What did you spend on?"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentMethod: method.value,
                      }))
                    }
                    className={`p-3 border rounded-lg transition-all duration-200 ${
                      formData.paymentMethod === method.value
                        ? "bg-primary-500/20 border-primary-500 text-primary-400"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-lg mr-2">{method.icon}</span>
                    <span className="text-sm font-medium">
                      {method.value.charAt(0).toUpperCase() +
                        method.value.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Add Expense</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default AddExpense;
