import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  DollarSign,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  Brain,
} from "lucide-react";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "there";

  // Form state
  const [currency, setCurrency] = useState("INR");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);

  const currencies = [
    { code: "INR", name: "Indian Rupee (₹)", symbol: "₹" },
    { code: "USD", name: "US Dollar ($)", symbol: "$" },
    { code: "EUR", name: "Euro (€)", symbol: "€" },
    { code: "GBP", name: "British Pound (£)", symbol: "£" },
    { code: "AED", name: "UAE Dirham (د.إ)", symbol: "د.إ" },
    { code: "JPY", name: "Japanese Yen (¥)", symbol: "¥" },
    { code: "AUD", name: "Australian Dollar (A$)", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar (C$)", symbol: "C$" },
  ];

  const categories = [
    { id: "food", label: "Food & Dining", emoji: "🍕" },
    { id: "transport", label: "Transportation", emoji: "🚗" },
    { id: "shopping", label: "Shopping", emoji: "🛍️" },
    { id: "bills", label: "Bills & Utilities", emoji: "💡" },
    { id: "rent", label: "Rent & Housing", emoji: "🏠" },
    { id: "entertainment", label: "Entertainment", emoji: "🎬" },
    { id: "health", label: "Health & Fitness", emoji: "💪" },
    { id: "others", label: "Others", emoji: "📦" },
  ];

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    const onboardingData = {
      currency,
      monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : null,
      selectedCategories,
      aiInsightsEnabled,
    };

    console.log("Onboarding data:", onboardingData);

    // Store preferences in localStorage
    localStorage.setItem("userPreferences", JSON.stringify(onboardingData));

    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Card Container */}
        <div className="relative">
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-8 h-8 text-primary-500" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <span className="text-2xl">🎉</span>
                </motion.div>
              </div>
              <h1 className="text-3xl font-bold text-white">
                Welcome, {userName}!
              </h1>
              <p className="text-slate-400">
                Let's personalize your Expenzo experience
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-12 h-1 bg-primary-500 rounded-full"></div>
                <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
                <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
              </div>
              <p className="text-xs text-slate-500">Step 1 of 3</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Currency Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <DollarSign className="w-4 h-4 text-primary-500" />
                  Default Currency
                </label>
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  >
                    {currencies.map((curr) => (
                      <option
                        key={curr.code}
                        value={curr.code}
                        className="bg-slate-900 text-white"
                      >
                        {curr.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronRight className="w-5 h-5 text-slate-500 rotate-90" />
                  </div>
                </div>
              </div>

              {/* Monthly Budget */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <TrendingUp className="w-4 h-4 text-secondary-500" />
                  Monthly Income or Budget Goal
                  <span className="text-xs text-slate-500">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    placeholder="e.g., 50000"
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-sm">
                      {currencies.find((c) => c.code === currency)?.symbol}
                    </span>
                  </div>
                </div>
              </div>

              {/* Spending Categories */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent-500" />
                  Select Your Spending Categories
                </label>
                <p className="text-xs text-slate-500">
                  Choose categories you frequently spend on
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200
                        ${
                          selectedCategories.includes(category.id)
                            ? "bg-primary-500/20 border-primary-500 text-white"
                            : "bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600"
                        }
                      `}
                    >
                      <span className="text-xl">{category.emoji}</span>
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                      {selectedCategories.includes(category.id) && (
                        <CheckCircle className="w-4 h-4 ml-auto text-primary-500" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* AI Insights Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        AI Smart Insights
                      </h3>
                      <p className="text-xs text-slate-500">
                        Get personalized spending tips
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiInsightsEnabled(!aiInsightsEnabled)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900
                      ${aiInsightsEnabled ? "bg-primary-500" : "bg-slate-700"}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                        ${aiInsightsEnabled ? "translate-x-6" : "translate-x-1"}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <motion.button
              type="button"
              onClick={handleContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-dark-base font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>Continue to Dashboard</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Skip Option */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>

          {/* Decorative glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-2xl blur-xl -z-10 opacity-50"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
