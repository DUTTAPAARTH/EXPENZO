import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Sparkles,
  X,
  Save,
  TestTube,
} from "lucide-react";
import { useRules } from "../../context/RuleContext";
import toast from "react-hot-toast";

const RulesManager = () => {
  const { rules, fetchRules, addRule, updateRule, deleteRule, testRule } =
    useRules();
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    condition: {
      field: "description",
      operator: "contains",
      value: "",
    },
    action: {
      type: "set_category",
      value: "",
    },
    isActive: true,
  });
  const [testValue, setTestValue] = useState("");
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

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

  const fields = [
    { value: "description", label: "Description" },
    { value: "category", label: "Category" },
    { value: "amount", label: "Amount" },
  ];

  const operators = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "regex", label: "Regex (advanced)" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
  ];

  const actionTypes = [
    { value: "set_category", label: "Set Category" },
    { value: "add_tag", label: "Add Tag" },
  ];

  const handleOpenModal = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        condition: rule.condition,
        action: rule.action,
        isActive: rule.isActive,
      });
    } else {
      setEditingRule(null);
      setFormData({
        name: "",
        condition: {
          field: "description",
          operator: "contains",
          value: "",
        },
        action: {
          type: "set_category",
          value: "",
        },
        isActive: true,
      });
    }
    setTestValue("");
    setTestResult(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRule(null);
    setTestValue("");
    setTestResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.condition.value || !formData.action.value) {
      toast.error("Please fill in all fields");
      return;
    }

    if (editingRule) {
      await updateRule(editingRule.id, formData);
    } else {
      await addRule(formData);
    }

    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      await deleteRule(id);
    }
  };

  const handleToggleActive = async (rule) => {
    await updateRule(rule.id, { ...rule, isActive: !rule.isActive });
  };

  const handleTestRule = async () => {
    if (!testValue) {
      toast.error("Please enter a test value");
      return;
    }

    const result = await testRule(formData.condition, testValue);
    setTestResult(result);
  };

  const handleConditionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      condition: { ...prev.condition, [field]: value },
    }));
    setTestResult(null);
  };

  const handleActionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      action: { ...prev.action, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-400" />
            Automation Rules
          </h2>
          <p className="text-slate-400 mt-1">
            Automatically categorize expenses based on patterns
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-black font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No automation rules yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Create rules to automatically categorize your expenses
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {rules.map((rule) => (
              <motion.div
                key={rule.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-slate-900 border rounded-xl p-4 transition-all ${
                  rule.isActive
                    ? "border-slate-800 hover:border-primary-500/50"
                    : "border-slate-800/50 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Rule Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-semibold">{rule.name}</h3>
                      {rule.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-slate-400 bg-slate-500/10 border border-slate-500/30">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-slate-400 space-y-1">
                      <p>
                        <span className="text-slate-500">If </span>
                        <span className="text-primary-400 font-medium">
                          {rule.condition.field}
                        </span>
                        <span className="text-slate-500">
                          {" "}
                          {rule.condition.operator}{" "}
                        </span>
                        <span className="text-white font-medium">
                          "{rule.condition.value}"
                        </span>
                      </p>
                      <p>
                        <span className="text-slate-500">Then </span>
                        <span className="text-secondary-400 font-medium">
                          {rule.action.type === "set_category"
                            ? "set category to"
                            : "add tag"}
                        </span>
                        <span className="text-white font-medium">
                          {" "}
                          "{rule.action.value}"
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(rule)}
                      className={`p-2 rounded-lg transition-colors ${
                        rule.isActive
                          ? "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-400"
                      }`}
                      title={rule.isActive ? "Deactivate" : "Activate"}
                    >
                      {rule.isActive ? (
                        <Power className="w-4 h-4" />
                      ) : (
                        <PowerOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenModal(rule)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">
                  {editingRule ? "Edit Rule" : "Create New Rule"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Rule Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Auto-categorize Amazon purchases"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Condition Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-300">
                    Condition (When to apply)
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Field */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">
                        Field
                      </label>
                      <select
                        value={formData.condition.field}
                        onChange={(e) =>
                          handleConditionChange("field", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {fields.map((field) => (
                          <option key={field.value} value={field.value}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Operator */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">
                        Operator
                      </label>
                      <select
                        value={formData.condition.operator}
                        onChange={(e) =>
                          handleConditionChange("operator", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {operators.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Value */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">
                        Value
                      </label>
                      <input
                        type="text"
                        value={formData.condition.value}
                        onChange={(e) =>
                          handleConditionChange("value", e.target.value)
                        }
                        placeholder="e.g., amazon"
                        required
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* Test Section */}
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <label className="block text-xs text-slate-400">
                      Test your condition
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testValue}
                        onChange={(e) => setTestValue(e.target.value)}
                        placeholder="Enter test value..."
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={handleTestRule}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <TestTube className="w-4 h-4" />
                        Test
                      </button>
                    </div>
                    {testResult !== null && (
                      <p
                        className={`text-sm font-medium ${
                          testResult.matches ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {testResult.matches ? "✓ Match!" : "✗ No match"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-300">
                    Action (What to do)
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Action Type */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">
                        Action Type
                      </label>
                      <select
                        value={formData.action.type}
                        onChange={(e) =>
                          handleActionChange("type", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {actionTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action Value */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">
                        {formData.action.type === "set_category"
                          ? "Category"
                          : "Tag"}
                      </label>
                      {formData.action.type === "set_category" ? (
                        <select
                          value={formData.action.value}
                          onChange={(e) =>
                            handleActionChange("value", e.target.value)
                          }
                          required
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={formData.action.value}
                          onChange={(e) =>
                            handleActionChange("value", e.target.value)
                          }
                          placeholder="Tag name"
                          required
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-primary-500 bg-slate-700 border-slate-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="isActive"
                    className="flex-1 text-sm font-semibold text-slate-300 cursor-pointer"
                  >
                    Activate this rule immediately
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingRule ? "Update Rule" : "Create Rule"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RulesManager;
