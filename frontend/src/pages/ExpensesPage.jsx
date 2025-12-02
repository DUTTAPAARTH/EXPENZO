import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter, Search, Calendar, Download, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  isWithinInterval,
} from "date-fns";
import { useExpenses } from "../context/ExpenseContext";
import { useBudgets } from "../context/BudgetContext";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseForm from "../components/expenses/ExpenseForm";
import SummaryBar from "../components/expenses/SummaryBar";
import CategoryChart from "../components/charts/CategoryChart";
import TrendChart from "../components/charts/TrendChart";
import BudgetWidget from "../components/budgets/BudgetWidget";
import CSVImport from "../components/import/CSVImport";
import ReceiptUploader from "../components/receipt/ReceiptUploader";
import QuickAdd from "../components/quickadd/QuickAdd";
import BankStatementImport from "../components/bankStatement/BankStatementImport";
import { Upload, Camera } from "lucide-react";
import toast from "react-hot-toast";

const ExpensesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("This Month");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showReceiptUploader, setShowReceiptUploader] = useState(false);
  const [showBankStatementImport, setShowBankStatementImport] = useState(false);
  const [prefilledData, setPrefilledData] = useState(null);
  const [autoSaveReceipt, setAutoSaveReceipt] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("autoSaveReceipt") || "false");
    } catch (e) {
      return false;
    }
  });

  // Expenses from API
  const {
    expenses,
    fetchExpenses,
    updateExpense,
    deleteExpense,
    addExpense,
    loading,
  } = useExpenses();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDelete = async (expense) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${expense.description}"?`
      )
    ) {
      const result = await deleteExpense(expense.id || expense._id);
      if (result.success) {
        fetchExpenses(); // Refresh list
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    if (modalMode === "edit") {
      const result = await updateExpense(
        editingExpense.id || editingExpense._id,
        formData
      );
      if (result.success) {
        fetchExpenses(); // Refresh list
      }
    } else {
      const result = await addExpense(formData);
      if (result.success) {
        fetchExpenses(); // Refresh list
      }
    }
  };

  const handleAddNew = () => {
    setEditingExpense(null);
    setPrefilledData(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleReceiptData = (data) => {
    // If user enabled auto-save, create expense immediately
    if (autoSaveReceipt) {
      (async () => {
        try {
          const payload = {
            description: data.description || data.merchant || "Receipt",
            amount: Number(data.amount) || 0,
            date: data.date || new Date().toISOString().split("T")[0],
            category: data.category || "📦 Others",
            notes: data.rawText || "",
            merchant: data.merchant || "",
          };

          const result = await addExpense(payload);
          if (result.success) {
            toast.success("Expense saved from receipt");
            setShowReceiptUploader(false);
            // addExpense already dispatches ADD_EXPENSE so list updates locally
          } else {
            // fallback to manual review if saving failed
            setPrefilledData(data);
            setModalMode("add");
            setShowModal(true);
            toast.error(
              "Failed to auto-save receipt. Please review and save manually."
            );
          }
        } catch (err) {
          console.error("Auto-save receipt error:", err);
          setPrefilledData(data);
          setModalMode("add");
          setShowModal(true);
          toast.error(
            "Failed to auto-save receipt. Please review and save manually."
          );
        }
      })();
    } else {
      setPrefilledData(data);
      setModalMode("add");
      setShowModal(true);
      toast.success("Receipt data loaded! Review and save.");
    }
  };

  // Persist auto-save setting
  useEffect(() => {
    try {
      localStorage.setItem("autoSaveReceipt", JSON.stringify(autoSaveReceipt));
    } catch (e) {
      // ignore storage errors
    }
  }, [autoSaveReceipt]);

  const handleImport = async (expenses, recurringDetected) => {
    let successCount = 0;
    for (const expenseData of expenses) {
      const result = await addExpense(expenseData);
      if (result.success) successCount++;
    }

    toast.success(`Imported ${successCount} expenses successfully!`);

    if (recurringDetected.length > 0) {
      toast.success(
        `Found ${recurringDetected.length} recurring patterns. Check your recurring subscriptions!`,
        { duration: 6000 }
      );
    }

    setShowImportModal(false);
    fetchExpenses();
  };

  const categories = [
    "All",
    "🍔 Food & Dining",
    "🚗 Transportation",
    "🛍️ Shopping",
    "💡 Bills & Utilities",
    "🎬 Entertainment",
    "💪 Health & Fitness",
    "🏠 Rent & Housing",
    "📦 Others",
  ];

  const dateRanges = [
    "Today",
    "Yesterday",
    "This Week",
    "This Month",
    "Last Month",
    "Custom",
  ];

  // Get date range based on preset
  const getDateRange = () => {
    const now = new Date();

    switch (dateRange) {
      case "Today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "Yesterday":
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
      case "This Week":
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case "This Month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "Last Month":
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "Custom":
        if (customStartDate && customEndDate) {
          return {
            start: startOfDay(customStartDate),
            end: endOfDay(customEndDate),
          };
        }
        return null;
      default:
        return null;
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || expense.category === selectedCategory;

    // Date range filter
    const dateRangeFilter = getDateRange();
    const matchesDate = dateRangeFilter
      ? isWithinInterval(new Date(expense.date), {
          start: dateRangeFilter.start,
          end: dateRangeFilter.end,
        })
      : true;

    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const handleQuickAdd = async (expenseData) => {
    const result = await addExpense(expenseData);
    if (result.success) {
      fetchExpenses();
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <SummaryBar expenses={filteredExpenses} />

      {/* Quick Add */}
      <QuickAdd onExpenseCreated={handleQuickAdd} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">All Expenses</h1>
          <p className="text-slate-400">
            {filteredExpenses.length} expenses • ₹{totalAmount.toLocaleString()}{" "}
            total
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowReceiptUploader(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-slate-700"
          >
            <Camera className="w-5 h-5" />
            <span>Scan Receipt</span>
          </button>

          {/* Auto-save toggle for receipts */}
          <button
            onClick={() => setAutoSaveReceipt((s) => !s)}
            title={autoSaveReceipt ? "Auto-save enabled" : "Auto-save disabled"}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
              autoSaveReceipt
                ? "bg-green-600 text-white border-green-600"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
            }`}
          >
            <span className="font-semibold">
              {autoSaveReceipt ? "Auto-save: On" : "Auto-save: Off"}
            </span>
          </button>
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
              showFilters
                ? "bg-primary-500 border-primary-500 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
          </button>

          {/* Bank Statement Import Button */}
          <button
            onClick={() => setShowBankStatementImport(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500 rounded-lg text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden md:inline">Import Statement</span>
          </button>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:border-slate-600 transition-all">
            <Download className="w-5 h-5" />
            <span className="hidden md:inline font-medium">Export</span>
          </button>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-800 space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-400 mb-2 block">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? "bg-primary-500 text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-400 mb-2 block">
                    Date Range
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dateRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setDateRange(range);
                          if (range === "Custom") {
                            setShowCustomDatePicker(true);
                          } else {
                            setShowCustomDatePicker(false);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                          dateRange === range
                            ? "bg-secondary-500 text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        {range}
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Picker */}
                  {showCustomDatePicker && dateRange === "Custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col md:flex-row gap-4 p-4 bg-slate-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <label className="text-xs font-medium text-slate-400 mb-1 block">
                          Start Date
                        </label>
                        <DatePicker
                          selected={customStartDate}
                          onChange={(date) => setCustomStartDate(date)}
                          selectsStart
                          startDate={customStartDate}
                          endDate={customEndDate}
                          maxDate={customEndDate || new Date()}
                          dateFormat="MMM dd, yyyy"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          placeholderText="Select start date"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium text-slate-400 mb-1 block">
                          End Date
                        </label>
                        <DatePicker
                          selected={customEndDate}
                          onChange={(date) => setCustomEndDate(date)}
                          selectsEnd
                          startDate={customStartDate}
                          endDate={customEndDate}
                          minDate={customStartDate}
                          maxDate={new Date()}
                          dateFormat="MMM dd, yyyy"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          placeholderText="Select end date"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Charts Section */}
      {filteredExpenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                Category Breakdown
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Spending by category
              </p>
            </div>
            <CategoryChart expenses={filteredExpenses} />
          </div>

          {/* Daily Trend */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Spending Trend</h3>
              <p className="text-sm text-slate-400 mt-1">Last 7 days</p>
            </div>
            <TrendChart expenses={filteredExpenses} days={7} />
          </div>

          {/* Budget Tracker */}
          <div>
            <BudgetWidget expenses={filteredExpenses} />
          </div>
        </div>
      )}

      {/* Expenses List */}
      <ExpenseList
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Expense Form Modal */}
      <ExpenseForm
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setPrefilledData(null);
        }}
        expense={editingExpense || prefilledData}
        onSubmit={handleFormSubmit}
        mode={modalMode}
      />

      {/* Receipt Uploader Modal */}
      {showReceiptUploader && (
        <ReceiptUploader
          onExtractedData={handleReceiptData}
          onClose={() => setShowReceiptUploader(false)}
        />
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <CSVImport
          onImport={handleImport}
          onClose={() => setShowImportModal(false)}
        />
      )}

      {/* Bank Statement Import Modal */}
      {showBankStatementImport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8"
          >
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">
                Import Bank Statement
              </h2>
              <button
                onClick={() => setShowBankStatementImport(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <BankStatementImport
                onImportComplete={() => {
                  fetchExpenses();
                  setShowBankStatementImport(false);
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
