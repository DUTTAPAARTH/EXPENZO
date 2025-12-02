import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, TrendingUp, AlertTriangle } from "lucide-react";
import { useBudgets } from "../../context/BudgetContext";

const BudgetWidget = ({ expenses = [] }) => {
  const {
    budgets,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    loading,
  } = useBudgets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Calculate spent for each budget based on expenses
  const getBudgetWithSpent = (budget) => {
    const categoryExpenses = expenses.filter(
      (exp) => exp.category === budget.category
    );
    const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const remaining = budget.limit - spent;

    return { ...budget, spent, percentage, remaining };
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return "red";
    if (percentage >= 80) return "yellow";
    return "green";
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "from-red-500 to-red-600";
    if (percentage >= 80) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-teal-500";
  };

  if (loading && budgets.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-20 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-full mb-3">
            <TrendingUp className="w-6 h-6 text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Budgets Set</h3>
          <p className="text-sm text-slate-400 mb-4">
            Set budgets to track your spending and get alerts
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold py-2 px-4 rounded-lg transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Budget Tracker</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          title="Add budget"
        >
          <Plus className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const budgetData = getBudgetWithSpent(budget);
          const statusColor = getStatusColor(budgetData.percentage);
          const progressColor = getProgressColor(budgetData.percentage);

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {budget.category}
                  </span>
                  {budgetData.percentage >= 100 && (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingBudget(budget)}
                    className="p-1 hover:bg-slate-800 rounded transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => deleteBudget(budget.id)}
                    className="p-1 hover:bg-slate-800 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(budgetData.percentage, 100)}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`absolute h-full bg-gradient-to-r ${progressColor}`}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  ₹{budgetData.spent.toLocaleString()} / ₹
                  {budget.limit.toLocaleString()}
                </span>
                <span
                  className={`font-semibold ${
                    statusColor === "red"
                      ? "text-red-400"
                      : statusColor === "yellow"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {budgetData.percentage.toFixed(0)}%
                </span>
              </div>

              {/* Remaining */}
              {budgetData.remaining > 0 ? (
                <p className="text-xs text-slate-500 mt-1">
                  ₹{budgetData.remaining.toLocaleString()} remaining
                </p>
              ) : (
                <p className="text-xs text-red-400 mt-1">
                  ₹{Math.abs(budgetData.remaining).toLocaleString()} over budget
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingBudget) && (
        <BudgetModal
          budget={editingBudget}
          onClose={() => {
            setShowAddModal(false);
            setEditingBudget(null);
          }}
          onSave={async (data) => {
            if (editingBudget) {
              await updateBudget(editingBudget.id, data);
            } else {
              await addBudget(data);
            }
            setShowAddModal(false);
            setEditingBudget(null);
          }}
        />
      )}
    </div>
  );
};

const BudgetModal = ({ budget, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: budget?.category || "",
    limit: budget?.limit || "",
    period: budget?.period || "monthly",
  });

  const categories = [
    "🍔 Food & Dining",
    "🚗 Transportation",
    "🛍️ Shopping",
    "💡 Bills & Utilities",
    "🎬 Entertainment",
    "💪 Health & Fitness",
    "🏠 Rent & Housing",
    "📦 Others",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">
          {budget ? "Edit Budget" : "Create Budget"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Budget Limit (₹)
            </label>
            <input
              type="number"
              value={formData.limit}
              onChange={(e) =>
                setFormData({ ...formData, limit: e.target.value })
              }
              placeholder="10000"
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Period
            </label>
            <select
              value={formData.period}
              onChange={(e) =>
                setFormData({ ...formData, period: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg"
            >
              {budget ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BudgetWidget;
