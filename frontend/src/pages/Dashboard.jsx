import React, { useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PieChart,
  Plus,
  AlertTriangle,
  Target,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatCurrency, formatDate, getCategoryEmoji } from "../utils/helpers";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    expenses,
    summary,
    statistics,
    loading,
    fetchExpenses,
    fetchStatistics,
    getExpensesByCategory,
    getRecentExpenses,
  } = useExpenses();

  useEffect(() => {
    fetchExpenses();
    fetchStatistics();
  }, []);

  if (loading && !expenses.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your dashboard..." />
      </div>
    );
  }

  const recentExpenses = getRecentExpenses(5);
  const categoryData = getExpensesByCategory();
  const currentMonth = statistics?.overview?.currentMonth;
  const budget = statistics?.budget;

  // Quick stats cards data
  const quickStats = [
    {
      title: "This Month",
      value: currentMonth?.formatted || "₹0.00",
      change: statistics?.trends?.changeFormatted || "0%",
      isPositive: !statistics?.trends?.isIncreasing,
      icon: DollarSign,
      color: "primary",
    },
    {
      title: "Budget Used",
      value: budget?.percentage ? `${budget.percentage.toFixed(1)}%` : "0%",
      change: budget?.remaining
        ? `₹${budget.remaining.toFixed(2)} left`
        : "No budget set",
      isPositive: budget?.percentage < 80,
      icon: Target,
      color:
        budget?.percentage > 90
          ? "error"
          : budget?.percentage > 75
          ? "warning"
          : "success",
    },
    {
      title: "Transactions",
      value: currentMonth?.count || 0,
      change: `Avg: ${
        currentMonth?.average ? formatCurrency(currentMonth.average) : "₹0"
      }`,
      isPositive: true,
      icon: CreditCard,
      color: "secondary",
    },
    {
      title: "Categories",
      value: categoryData.length,
      change: categoryData[0]
        ? `Top: ${categoryData[0].category}`
        : "No expenses yet",
      isPositive: true,
      icon: PieChart,
      color: "accent",
    },
  ];

  return (
    <div className="min-h-screen bg-cream-500 dark:bg-dark-base">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark-base dark:text-white mb-2">
                Welcome back, {user?.name}! {user?.avatar}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's your spending overview for{" "}
                {formatDate(new Date(), "medium")}
              </p>
            </div>

            <Link
              to="/add-expense"
              className="btn-primary flex items-center space-x-2 glow-primary"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Expense</span>
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                className="card hover:glow-primary group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-dark-base dark:text-white mb-2">
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs flex items-center ${
                        stat.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.title === "This Month" &&
                        (statistics?.trends?.isIncreasing ? (
                          <TrendingUp size={12} className="mr-1" />
                        ) : (
                          <TrendingDown size={12} className="mr-1" />
                        ))}
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-button bg-${stat.color}-100 text-${stat.color}-600 group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={20} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Budget Alert */}
        {budget?.percentage > 75 && (
          <motion.div
            className={`mb-8 p-4 rounded-card border-l-4 ${
              budget.percentage > 90
                ? "bg-red-50 border-red-500 dark:bg-red-900/20"
                : "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20"
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center">
              <AlertTriangle
                size={20}
                className={
                  budget.percentage > 90 ? "text-red-600" : "text-yellow-600"
                }
              />
              <div className="ml-3">
                <h3
                  className={`font-semibold ${
                    budget.percentage > 90
                      ? "text-red-800 dark:text-red-200"
                      : "text-yellow-800 dark:text-yellow-200"
                  }`}
                >
                  {budget.percentage > 90
                    ? "Budget Exceeded!"
                    : "Budget Warning"}
                </h3>
                <p
                  className={`text-sm ${
                    budget.percentage > 90
                      ? "text-red-700 dark:text-red-300"
                      : "text-yellow-700 dark:text-yellow-300"
                  }`}
                >
                  You've used {budget.percentage.toFixed(1)}% of your monthly
                  budget.
                  {budget.percentage > 90
                    ? " Consider reducing expenses."
                    : " Keep an eye on your spending."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Expenses */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark-base dark:text-white flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Recent Expenses
                </h2>
                <Link
                  to="/expenses"
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {recentExpenses.length > 0 ? (
                <div className="space-y-4">
                  {recentExpenses.map((expense) => (
                    <motion.div
                      key={expense._id}
                      className="flex items-center justify-between p-3 rounded-button bg-gray-50 dark:bg-dark-200 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {getCategoryEmoji(expense.category)}
                        </span>
                        <div>
                          <p className="font-medium text-dark-base dark:text-white">
                            {expense.description || expense.category}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(expense.date)} • {expense.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-dark-base dark:text-white">
                        {formatCurrency(expense.amount)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💸</div>
                  <h3 className="text-lg font-semibold text-dark-base dark:text-white mb-2">
                    No expenses yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start tracking your expenses to see them here
                  </p>
                  <Link to="/add-expense" className="btn-primary">
                    Add Your First Expense
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark-base dark:text-white flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  Top Categories
                </h2>
                <Link
                  to="/insights"
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  View Insights
                </Link>
              </div>

              {categoryData.length > 0 ? (
                <div className="space-y-4">
                  {categoryData.slice(0, 5).map((category, index) => {
                    const percentage =
                      currentMonth?.total > 0
                        ? (category.total / currentMonth.total) * 100
                        : 0;

                    return (
                      <div key={category.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {getCategoryEmoji(category.category)}
                            </span>
                            <span className="text-sm font-medium text-dark-base dark:text-white">
                              {category.category}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-dark-base dark:text-white">
                            {formatCurrency(category.total)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-dark-300 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{
                              duration: 0.8,
                              delay: 0.8 + index * 0.1,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage.toFixed(1)}% of total spending
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Category breakdown will appear here once you add expenses
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            {
              name: "Add Expense",
              href: "/add-expense",
              emoji: "💰",
              color: "primary",
            },
            {
              name: "View Insights",
              href: "/insights",
              emoji: "📊",
              color: "secondary",
            },
            {
              name: "Manage Groups",
              href: "/groups",
              emoji: "👥",
              color: "accent",
            },
            { name: "Profile", href: "/profile", emoji: "⚙️", color: "gray" },
          ].map((action, index) => (
            <Link
              key={action.name}
              to={action.href}
              className={`card text-center hover:glow-${action.color} group`}
            >
              <div className="text-3xl mb-2 group-hover:animate-bounce">
                {action.emoji}
              </div>
              <p className="text-sm font-medium text-dark-base dark:text-white">
                {action.name}
              </p>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
