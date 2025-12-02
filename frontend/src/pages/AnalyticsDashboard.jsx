import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  DollarSign,
  CreditCard,
  Zap,
  Clock,
  RefreshCw,
  Filter,
  ChevronRight,
} from "lucide-react";
import {
  startOfDay,
  endOfDay,
  subDays,
  subMonths,
  startOfYear,
  format,
  parseISO,
} from "date-fns";
import toast from "react-hot-toast";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsDashboard = () => {
  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [dateRange, setDateRange] = useState("30d");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const debounceTimer = useRef(null);

  // Date Range Helpers
  const getDateRange = () => {
    const now = new Date();
    let start,
      end = endOfDay(now);

    switch (dateRange) {
      case "7d":
        start = startOfDay(subDays(now, 7));
        break;
      case "30d":
        start = startOfDay(subDays(now, 30));
        break;
      case "90d":
        start = startOfDay(subDays(now, 90));
        break;
      case "ytd":
        start = startOfYear(now);
        break;
      case "custom":
        start = customStartDate
          ? startOfDay(customStartDate)
          : startOfDay(subDays(now, 30));
        end = customEndDate ? endOfDay(customEndDate) : endOfDay(now);
        break;
      default:
        start = startOfDay(subDays(now, 30));
    }

    return { start, end };
  };

  const { start: startDate, end: endDate } = getDateRange();

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [expensesRes, budgetsRes] = await Promise.all([
        axios.get("/api/expenses", {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }),
        axios.get("/api/budgets"),
      ]);

      setExpenses(expensesRes.data.data?.expenses || []);
      setBudgets(budgetsRes.data.data?.budgets || []);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data. Please try again.");
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [dateRange, customStartDate, customEndDate]);

  // Filter expenses by selected merchant
  const filteredExpenses = useMemo(() => {
    if (!selectedMerchant) return expenses;
    return expenses.filter((e) =>
      e.description?.toLowerCase().includes(selectedMerchant.toLowerCase())
    );
  }, [expenses, selectedMerchant]);

  // 1. Monthly Spending Breakdown
  const monthlyBreakdown = useMemo(() => {
    const monthlyData = {};

    filteredExpenses.forEach((expense) => {
      const date = parseISO(expense.date);
      const monthKey = format(date, "MMM yyyy");

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }

      const category = expense.category || "Others";
      monthlyData[monthKey][category] =
        (monthlyData[monthKey][category] || 0) + expense.amount;
    });

    return monthlyData;
  }, [filteredExpenses]);

  const pieChartData = useMemo(() => {
    const categoryTotals = {};

    filteredExpenses.forEach((expense) => {
      const category = expense.category || "Others";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + expense.amount;
    });

    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
      "#14B8A6",
      "#F97316",
      "#06B6D4",
      "#84CC16",
    ];

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: colors.slice(0, Object.keys(categoryTotals).length),
          borderWidth: 2,
          borderColor: "#1F2937",
        },
      ],
    };
  }, [filteredExpenses]);

  const barChartData = useMemo(() => {
    const months = Object.keys(monthlyBreakdown).sort();
    const categories = [
      ...new Set(filteredExpenses.map((e) => e.category || "Others")),
    ];

    const datasets = categories.map((category, idx) => ({
      label: category,
      data: months.map((month) => monthlyBreakdown[month]?.[category] || 0),
      backgroundColor: `hsl(${(idx * 360) / categories.length}, 70%, 60%)`,
    }));

    return {
      labels: months,
      datasets,
    };
  }, [monthlyBreakdown, filteredExpenses]);

  // 2. Cash Flow Overview
  const cashFlowData = useMemo(() => {
    const dailyFlow = {};

    filteredExpenses.forEach((expense) => {
      const dateKey = format(parseISO(expense.date), "MMM dd");
      if (!dailyFlow[dateKey]) {
        dailyFlow[dateKey] = { income: 0, expense: 0 };
      }
      dailyFlow[dateKey].expense += expense.amount;
    });

    const sortedDates = Object.keys(dailyFlow).sort();

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Expenses",
          data: sortedDates.map((date) => dailyFlow[date].expense),
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Income",
          data: sortedDates.map((date) => dailyFlow[date].income),
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [filteredExpenses]);

  // 3. Budget Utilization
  const budgetUtilization = useMemo(() => {
    return budgets.map((budget) => {
      const spent = filteredExpenses
        .filter((e) => e.category === budget.category)
        .reduce((sum, e) => sum + e.amount, 0);

      const percentUsed = (spent / budget.amount) * 100;
      const remaining = budget.amount - spent;

      let status = "green";
      if (percentUsed > 80) status = "red";
      else if (percentUsed > 60) status = "yellow";

      return {
        ...budget,
        spent,
        remaining,
        percentUsed,
        status,
      };
    });
  }, [budgets, filteredExpenses]);

  // 4. Top Merchants/Vendors
  const topMerchants = useMemo(() => {
    const merchantData = {};

    filteredExpenses.forEach((expense) => {
      const merchant = expense.description?.split(" ")[0] || "Unknown";
      if (!merchantData[merchant]) {
        merchantData[merchant] = {
          total: 0,
          count: 0,
          transactions: [],
        };
      }
      merchantData[merchant].total += expense.amount;
      merchantData[merchant].count += 1;
      merchantData[merchant].transactions.push(expense);
    });

    return Object.entries(merchantData)
      .map(([name, data]) => ({
        name,
        total: data.total,
        count: data.count,
        avgTransaction: data.total / data.count,
        trend: data.transactions.length > 1 ? "up" : "flat",
        sparkline: data.transactions.slice(-6).map((t) => t.amount),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [filteredExpenses]);

  // 5. Smart Predictions (Moving Average)
  const forecastNextMonth = useMemo(() => {
    const monthlyTotals = Object.entries(monthlyBreakdown).map(
      ([month, categories]) => {
        return Object.values(categories).reduce((sum, val) => sum + val, 0);
      }
    );

    if (monthlyTotals.length < 2) return null;

    // Simple moving average of last 3 months
    const window = Math.min(3, monthlyTotals.length);
    const recentMonths = monthlyTotals.slice(-window);
    const forecast = recentMonths.reduce((sum, val) => sum + val, 0) / window;

    return Math.round(forecast);
  }, [monthlyBreakdown]);

  // 6. Recurring Payments Analyzer
  const recurringPayments = useMemo(() => {
    const patterns = {};

    filteredExpenses.forEach((expense) => {
      const key = `${expense.description}-${
        Math.round(expense.amount / 10) * 10
      }`;
      if (!patterns[key]) {
        patterns[key] = {
          description: expense.description,
          amount: expense.amount,
          dates: [],
          count: 0,
        };
      }
      patterns[key].dates.push(parseISO(expense.date));
      patterns[key].count += 1;
    });

    // Filter for potential recurring (appears 2+ times)
    const recurring = Object.values(patterns)
      .filter((p) => p.count >= 2)
      .map((p) => ({
        ...p,
        avgDaysBetween:
          p.dates.length > 1
            ? (p.dates[p.dates.length - 1] - p.dates[0]) /
              (p.dates.length - 1) /
              (1000 * 60 * 60 * 24)
            : 0,
      }))
      .filter((p) => p.avgDaysBetween > 20 && p.avgDaysBetween < 35) // ~monthly
      .sort((a, b) => b.amount - a.amount);

    const monthlyRecurringTotal = recurring.reduce(
      (sum, r) => sum + r.amount,
      0
    );

    return { recurring, monthlyRecurringTotal };
  }, [filteredExpenses]);

  // 7. Savings & Burn Rate
  const savingsInsights = useMemo(() => {
    const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = 0; // Would come from income transactions
    const netSavings = totalIncome - totalExpense;

    const days = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24));
    const dailyBurnRate = totalExpense / days;
    const weeklyBurnRate = dailyBurnRate * 7;
    const monthlyAvgSavings = netSavings / (days / 30);

    return {
      totalExpense,
      totalIncome,
      netSavings,
      dailyBurnRate,
      weeklyBurnRate,
      monthlyAvgSavings,
    };
  }, [filteredExpenses, startDate, endDate]);

  // 8. Expense Heatmap (Day of Week vs Hour)
  const expenseHeatmap = useMemo(() => {
    const heatmap = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));

    filteredExpenses.forEach((expense) => {
      const date = parseISO(expense.date);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      heatmap[dayOfWeek][hour] += expense.amount;
    });

    return heatmap;
  }, [filteredExpenses]);

  // Summary Stats
  const summaryStats = useMemo(() => {
    const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = 0;
    const net = totalIncome - totalSpent;

    // Compare with previous period
    const periodDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const prevStart = new Date(
      startDate.getTime() - periodDays * 24 * 60 * 60 * 1000
    );
    const prevEnd = new Date(startDate.getTime() - 1);

    const prevExpenses = expenses.filter((e) => {
      const date = parseISO(e.date);
      return date >= prevStart && date <= prevEnd;
    });

    const prevTotalSpent = prevExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentChange =
      prevTotalSpent > 0
        ? ((totalSpent - prevTotalSpent) / prevTotalSpent) * 100
        : 0;

    return { totalSpent, totalIncome, net, percentChange };
  }, [filteredExpenses, expenses, startDate, endDate]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Amount"];
    const rows = filteredExpenses.map((e) => [
      format(parseISO(e.date), "yyyy-MM-dd"),
      e.description,
      e.category,
      e.amount.toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Exported to CSV!");
  };

  // Retry handler
  const handleRetry = () => {
    fetchData();
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-24 bg-slate-800 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-slate-800 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-slate-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h3 className="text-xl font-semibold text-white">
            Oops! Something went wrong
          </h3>
          <p className="text-slate-400">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400">
            Comprehensive insights into your spending patterns
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-3">
          {["7d", "30d", "90d", "ytd"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === range
                  ? "bg-primary-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => {
              setDateRange("custom");
              setShowCustomDatePicker(!showCustomDatePicker);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              dateRange === "custom"
                ? "bg-primary-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Custom
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Custom Date Picker */}
      {showCustomDatePicker && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-slate-800 rounded-lg p-4 flex gap-4"
        >
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Start Date
            </label>
            <input
              type="date"
              value={
                customStartDate ? format(customStartDate, "yyyy-MM-dd") : ""
              }
              onChange={(e) =>
                setCustomStartDate(
                  e.target.value ? new Date(e.target.value) : null
                )
              }
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate ? format(customEndDate, "yyyy-MM-dd") : ""}
              onChange={(e) =>
                setCustomEndDate(
                  e.target.value ? new Date(e.target.value) : null
                )
              }
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>
        </motion.div>
      )}

      {/* Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Spent"
          value={`₹${summaryStats.totalSpent.toLocaleString()}`}
          change={summaryStats.percentChange}
          icon={DollarSign}
          color="red"
        />
        <SummaryCard
          title="Total Income"
          value={`₹${summaryStats.totalIncome.toLocaleString()}`}
          change={0}
          icon={TrendingUp}
          color="green"
        />
        <SummaryCard
          title="Net"
          value={`₹${summaryStats.net.toLocaleString()}`}
          change={0}
          icon={CreditCard}
          color={summaryStats.net >= 0 ? "green" : "red"}
        />
        <SummaryCard
          title="Daily Burn Rate"
          value={`₹${savingsInsights.dailyBurnRate.toFixed(0)}`}
          icon={Zap}
          color="blue"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Monthly Spending Breakdown - Pie Chart */}
        <ChartCard title="Category Breakdown" icon={Filter}>
          <div className="h-80 flex items-center justify-center">
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#CBD5E1" },
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || "";
                        const value = context.parsed || 0;
                        return `${label}: ₹${value.toLocaleString()}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </ChartCard>

        {/* 2. Cash Flow Overview */}
        <ChartCard title="Cash Flow Trend" icon={TrendingUp}>
          <div className="h-80">
            <Line
              data={cashFlowData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    ticks: { color: "#CBD5E1" },
                    grid: { color: "#334155" },
                  },
                  x: {
                    ticks: { color: "#CBD5E1" },
                    grid: { color: "#334155" },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: "#CBD5E1" },
                  },
                },
              }}
            />
          </div>
        </ChartCard>

        {/* Monthly Breakdown - Bar Chart */}
        <ChartCard title="Month-over-Month Spending" icon={Calendar} fullWidth>
          <div className="h-80">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    stacked: true,
                    ticks: { color: "#CBD5E1" },
                    grid: { color: "#334155" },
                  },
                  x: {
                    stacked: true,
                    ticks: { color: "#CBD5E1" },
                    grid: { color: "#334155" },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: "#CBD5E1" },
                  },
                },
              }}
            />
          </div>
        </ChartCard>
      </div>

      {/* 3. Budget Utilization */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          Budget Utilization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetUtilization.map((budget, idx) => (
            <BudgetCard key={idx} budget={budget} />
          ))}
        </div>
      </div>

      {/* 4. Top Merchants */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Top Merchants
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                    Merchant
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">
                    Total
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">
                    Count
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">
                    Avg
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topMerchants.map((merchant, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedMerchant(merchant.name)}
                    className={`hover:bg-slate-800 cursor-pointer transition-colors ${
                      selectedMerchant === merchant.name ? "bg-slate-800" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                          <span className="text-primary-400 font-semibold">
                            {merchant.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {merchant.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-white font-semibold">
                      ₹{merchant.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">
                      {merchant.count}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">
                      ₹{merchant.avgTransaction.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {merchant.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Smart Predictions */}
      {forecastNextMonth && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Smart Forecast
              </h3>
              <p className="text-indigo-100 mb-4">
                Based on your last 3 months spending pattern
              </p>
              <div className="text-4xl font-bold">
                ₹{forecastNextMonth.toLocaleString()}
              </div>
              <p className="text-indigo-200 text-sm mt-2">
                Estimated expenses for next month
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-indigo-200 mb-1">Confidence</div>
              <div className="text-2xl font-bold">78%</div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Recurring Payments */}
      {recurringPayments.recurring.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Recurring Payments
            <span className="text-sm font-normal text-slate-400">
              (₹{recurringPayments.monthlyRecurringTotal.toLocaleString()}
              /month)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recurringPayments.recurring.map((recurring, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-primary-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">
                      {recurring.description}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Every ~{Math.round(recurring.avgDaysBetween)} days
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      ₹{recurring.amount.toFixed(0)}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {recurring.count}x
                    </div>
                  </div>
                </div>
                <button className="text-xs text-primary-400 hover:text-primary-300">
                  Add to Recurring →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Savings & Burn Rate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm mb-2">Daily Burn Rate</h3>
          <div className="text-3xl font-bold text-white mb-1">
            ₹{savingsInsights.dailyBurnRate.toFixed(0)}
          </div>
          <p className="text-slate-500 text-sm">per day</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm mb-2">Weekly Burn Rate</h3>
          <div className="text-3xl font-bold text-white mb-1">
            ₹{savingsInsights.weeklyBurnRate.toFixed(0)}
          </div>
          <p className="text-slate-500 text-sm">per week</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm mb-2">Monthly Avg Savings</h3>
          <div
            className={`text-3xl font-bold mb-1 ${
              savingsInsights.monthlyAvgSavings >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            ₹{Math.abs(savingsInsights.monthlyAvgSavings).toFixed(0)}
          </div>
          <p className="text-slate-500 text-sm">
            {savingsInsights.monthlyAvgSavings >= 0 ? "surplus" : "deficit"}
          </p>
        </div>
      </div>

      {/* 8. Expense Heatmap */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Spending Heatmap
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="overflow-x-auto">
            <HeatmapGrid heatmap={expenseHeatmap} />
          </div>
        </div>
      </div>

      {/* Filter Indicator */}
      {selectedMerchant && (
        <div className="fixed bottom-6 right-6 bg-primary-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <Filter className="w-5 h-5" />
          <span>
            Filtered by: <strong>{selectedMerchant}</strong>
          </span>
          <button
            onClick={() => setSelectedMerchant(null)}
            className="text-white hover:text-slate-200"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// Helper Components
const SummaryCard = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    red: "from-red-500 to-red-600",
    green: "from-green-500 to-green-600",
    blue: "from-blue-500 to-blue-600",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && change !== 0 && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              change > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {change > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

const ChartCard = ({ title, icon: Icon, children, fullWidth }) => {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl p-6 ${
        fullWidth ? "lg:col-span-2" : ""
      }`}
    >
      <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        {title}
      </h3>
      {children}
    </div>
  );
};

const BudgetCard = ({ budget }) => {
  const colorClasses = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-white font-medium">{budget.category}</h4>
          <p className="text-slate-400 text-sm">
            ₹{budget.spent.toLocaleString()} / ₹{budget.amount.toLocaleString()}
          </p>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${colorClasses[budget.status]}`}
        ></div>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${colorClasses[budget.status]}`}
          style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          {budget.percentUsed.toFixed(0)}% used
        </span>
        <span
          className={budget.remaining >= 0 ? "text-green-400" : "text-red-400"}
        >
          ₹{Math.abs(budget.remaining).toLocaleString()}{" "}
          {budget.remaining >= 0 ? "left" : "over"}
        </span>
      </div>
      {budget.status === "red" && (
        <div className="mt-3 flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4" />
          Budget exceeded!
        </div>
      )}
    </div>
  );
};

const HeatmapGrid = ({ heatmap }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxValue = Math.max(...heatmap.flat());

  const getColor = (value) => {
    if (value === 0) return "bg-slate-800";
    const intensity = Math.min((value / maxValue) * 100, 100);
    if (intensity < 25) return "bg-blue-900";
    if (intensity < 50) return "bg-blue-700";
    if (intensity < 75) return "bg-blue-500";
    return "bg-blue-400";
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-25 gap-1">
        <div></div>
        {[...Array(24)].map((_, i) => (
          <div key={i} className="text-xs text-slate-500 text-center">
            {i % 6 === 0 ? i : ""}
          </div>
        ))}
      </div>
      {heatmap.map((row, dayIdx) => (
        <div key={dayIdx} className="grid grid-cols-25 gap-1">
          <div className="text-xs text-slate-400 flex items-center pr-2">
            {days[dayIdx]}
          </div>
          {row.map((value, hourIdx) => (
            <div
              key={hourIdx}
              className={`h-6 rounded ${getColor(
                value
              )} hover:ring-2 hover:ring-primary-500 cursor-pointer transition-all`}
              title={`${days[dayIdx]} ${hourIdx}:00 - ₹${value.toFixed(0)}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnalyticsDashboard;
