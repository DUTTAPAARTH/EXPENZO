import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useExpenses } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  DollarSign,
  Type,
  Calendar,
  Clock,
  FileText,
  Save,
  ArrowLeft,
  Plus,
} from "lucide-react";

// Category icons and colors
const categories = [
  { 
    value: "food", 
    label: "Food", 
    icon: "🍔", 
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  { 
    value: "travel", 
    label: "Travel", 
    icon: "🚗", 
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  { 
    value: "shopping", 
    label: "Shopping", 
    icon: "🛍️", 
    color: "bg-pink-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200"
  },
  { 
    value: "bills", 
    label: "Bills", 
    icon: "💡", 
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  { 
    value: "entertainment", 
    label: "Entertainment", 
    icon: "🎬", 
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  { 
    value: "health", 
    label: "Health", 
    icon: "🏥", 
    color: "bg-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  { 
    value: "education", 
    label: "Education", 
    icon: "📚", 
    color: "bg-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  },
  { 
    value: "others", 
    label: "Others", 
    icon: "📦", 
    color: "bg-gray-500",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  }
];

// Payment modes with icons
const paymentModes = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "upi", label: "UPI", icon: "📱" },
  { value: "card", label: "Card", icon: "💳" },
  { value: "wallet", label: "Wallet", icon: "👛" },
  { value: "netbanking", label: "Net Banking", icon: "🏦" },
  { value: "other", label: "Other", icon: "💰" }
];

const AddExpense = () => {
  const navigate = useNavigate();
  const { addExpense, loading } = useExpenses();
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    title: "",
    description: "",
    category: "",
    paymentMode: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-focus on amount field
  useEffect(() => {
    const amountInput = document.getElementById('amount-input');
    if (amountInput) {
      amountInput.focus();
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Please enter a title";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.paymentMode) {
      newErrors.paymentMode = "Please select payment mode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        datetime: new Date(`${formData.date}T${formData.time}`),
        userId: user?.id
      };

      await addExpense(expenseData);
      
      toast.success("Expense added successfully! 🎉");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected category details
  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const selectedPaymentMode = paymentModes.find(mode => mode.value === formData.paymentMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-500 via-white to-primary-50 pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Add Expense
          </h1>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </motion.div>

        {/* Main Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-float p-8 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Amount Field - Large and Centered */}
          <div className="text-center mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-3xl font-bold text-primary-500">
                ₹
              </span>
              <input
                id="amount-input"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full text-center text-4xl font-bold py-6 pl-16 pr-8 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                  errors.amount
                    ? 'border-red-300 bg-red-50'
                    : 'border-primary-200 bg-primary-50 focus:border-primary-500'
                }`}
                step="0.01"
                min="0"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-2">{errors.amount}</p>
            )}
          </div>

          {/* Title/Description Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What did you spend on?
            </label>
            <div className="relative">
              <Type className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Dinner at restaurant, Movie tickets, Uber ride"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                  errors.title
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 focus:border-primary-500'
                }`}
              />
            </div>
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full pl-4 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 appearance-none ${
                  errors.category
                    ? 'border-red-300 bg-red-50'
                    : selectedCategory
                    ? `${selectedCategory.borderColor} ${selectedCategory.bgColor}`
                    : 'border-gray-200 hover:border-gray-300 focus:border-primary-500'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
              {selectedCategory && (
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl pointer-events-none">
                  {selectedCategory.icon}
                </span>
              )}
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Payment Mode Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Mode
            </label>
            <div className="relative">
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className={`w-full pl-4 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 appearance-none ${
                  errors.paymentMode
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 focus:border-primary-500'
                }`}
              >
                <option value="">Select payment mode</option>
                {paymentModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.icon} {mode.label}
                  </option>
                ))}
              </select>
              {selectedPaymentMode && (
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl pointer-events-none">
                  {selectedPaymentMode.icon}
                </span>
              )}
            </div>
            {errors.paymentMode && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentMode}</p>
            )}
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Time Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Notes Field */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-gray-400" size={20} />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add a note (optional) - e.g., shared with friends, business expense"
                rows={3}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300 transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Adding Expense...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Add Expense</span>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Quick Tips */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Quick Tips
          </h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>• Use clear descriptions to remember your expenses later</li>
            <li>• Categories help you track spending patterns</li>
            <li>• Add notes for shared expenses or tax-deductible items</li>
            <li>• You can edit expenses from your dashboard later</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AddExpense;