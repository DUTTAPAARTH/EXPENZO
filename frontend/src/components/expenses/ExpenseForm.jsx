import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  DollarSign,
  FileText,
  Calendar,
  CreditCard,
  Tag,
  Sparkles,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRules } from "../../context/RuleContext";
import axios from "axios";

const ExpenseForm = ({ isOpen, onClose, expense, onSubmit, mode = "add" }) => {
  const { applyRulesToExpense } = useRules();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    isRecurring: false,
    recurrence: {
      period: "monthly",
      interval: 1,
      endDate: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(null);

  // Split expense state
  const [isSplitExpense, setIsSplitExpense] = useState(false);
  const [splitType, setSplitType] = useState("amount"); // "amount" or "percentage"
  const [payerId, setPayerId] = useState(null); // ID of participant who paid
  const [participants, setParticipants] = useState(() => {
    const firstId = Date.now();
    return [{ id: firstId, name: "", shareAmount: "", sharePercentage: "" }];
  });
  const [splitTemplates, setSplitTemplates] = useState(() => {
    const saved = localStorage.getItem("expenzo_split_templates");
    return saved ? JSON.parse(saved) : [];
  });
  const [recentSplits, setRecentSplits] = useState(() => {
    const saved = localStorage.getItem("expenzo_recent_splits");
    return saved ? JSON.parse(saved) : [];
  });
  const [myName, setMyName] = useState(() => {
    return localStorage.getItem("expenzo_my_name") || "Me";
  });

  // Set first participant as payer by default
  useEffect(() => {
    if (participants.length > 0 && !payerId) {
      setPayerId(participants[0].id);
    }
  }, [participants, payerId]);

  useEffect(() => {
    if (expense && mode === "edit") {
      setFormData({
        amount: expense.amount || "",
        category: expense.category || "",
        description: expense.description || "",
        date: expense.date
          ? new Date(expense.date).toISOString().split("T")[0]
          : "",
        paymentMethod: expense.paymentMethod || "Cash",
        isRecurring: expense.isRecurring || false,
        recurrence: expense.recurrence || {
          period: "monthly",
          interval: 1,
          endDate: "",
        },
      });
    } else if (mode === "add" && expense) {
      // If an expense-like object is provided while adding (e.g. OCR prefill), use it to prefill the form
      setFormData({
        amount: expense.amount || expense.total || "",
        category: expense.category || "",
        description: expense.description || expense.merchant || "",
        date: expense.date
          ? new Date(expense.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        paymentMethod: expense.paymentMethod || "Cash",
        isRecurring: expense.isRecurring || false,
        recurrence: expense.recurrence || {
          period: "monthly",
          interval: 1,
          endDate: "",
        },
      });
    } else if (mode === "add") {
      setFormData({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Cash",
        isRecurring: false,
        recurrence: {
          period: "monthly",
          interval: 1,
          endDate: "",
        },
      });
    }
  }, [expense, mode, isOpen]);

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

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "UPI",
    "Net Banking",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Apply rules when description changes
    if (name === "description" && value && !formData.category) {
      applyRules({ ...formData, description: value });
    }
  };

  const applyRules = useCallback(
    async (expenseData) => {
      const result = await applyRulesToExpense(expenseData);
      if (result.success && result.data.suggestions.category) {
        setSuggestedCategory(result.data.suggestions.category);
      } else {
        setSuggestedCategory(null);
      }
    },
    [applyRulesToExpense]
  );

  const applySuggestedCategory = () => {
    if (suggestedCategory) {
      setFormData((prev) => ({ ...prev, category: suggestedCategory }));
      setSuggestedCategory(null);
      toast.success("Category applied!");
    }
  };

  const handleRecurrenceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      recurrence: { ...prev.recurrence, [name]: value },
    }));
  };

  const handleToggleRecurring = () => {
    setFormData((prev) => ({ ...prev, isRecurring: !prev.isRecurring }));
  };

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      { id: Date.now(), name: "", shareAmount: "", sharePercentage: "" },
    ]);
  };

  const addMyself = () => {
    // Check if there's an empty participant (first one) and replace it
    const firstParticipant = participants[0];
    if (participants.length === 1 && !firstParticipant.name.trim()) {
      // Replace the empty first participant with "Me"
      const updatedParticipants = [
        {
          ...firstParticipant,
          name: myName,
        },
      ];
      setParticipants(updatedParticipants);
      setPayerId(firstParticipant.id);
      toast.success(`Set "${myName}" as participant and payer`);
    } else {
      // Add as new participant
      const newId = Date.now();
      const newParticipant = {
        id: newId,
        name: myName,
        shareAmount: "",
        sharePercentage: "",
      };
      setParticipants([...participants, newParticipant]);
      setPayerId(newId);
      toast.success(`Added "${myName}" as participant and payer`);
    }
  };

  const updateMyName = () => {
    const newName = prompt("What should we call you?", myName);
    if (newName && newName.trim()) {
      setMyName(newName.trim());
      localStorage.setItem("expenzo_my_name", newName.trim());
      toast.success(`Your name updated to "${newName.trim()}"`);
    }
  };

  const handleRemoveParticipant = (id) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const handleParticipantChange = (id, field, value) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const distributeEqually = () => {
    if (!formData.amount || participants.length === 0) return;

    if (splitType === "percentage") {
      const sharePercent = (100 / participants.length).toFixed(2);
      setParticipants(
        participants.map((p) => ({
          ...p,
          sharePercentage: sharePercent,
          shareAmount: "",
        }))
      );
      toast.success("Percentage distributed equally!");
    } else {
      const share = (parseFloat(formData.amount) / participants.length).toFixed(
        2
      );
      setParticipants(
        participants.map((p) => ({
          ...p,
          shareAmount: share,
          sharePercentage: "",
        }))
      );
      toast.success("Amount distributed equally!");
    }
  };

  const convertPercentageToAmount = (percentage) => {
    if (!formData.amount || !percentage) return "";
    return (
      (parseFloat(formData.amount) * parseFloat(percentage)) /
      100
    ).toFixed(2);
  };

  const convertAmountToPercentage = (amount) => {
    if (!formData.amount || !amount) return "";
    return ((parseFloat(amount) / parseFloat(formData.amount)) * 100).toFixed(
      2
    );
  };

  const saveAsTemplate = () => {
    const templateName = prompt("Enter a name for this split template:");
    if (!templateName) return;

    const validParticipants = participants.filter((p) => p.name);
    if (validParticipants.length === 0) {
      toast.error("Add at least one participant to save as template");
      return;
    }

    const template = {
      id: Date.now(),
      name: templateName,
      splitType: splitType,
      participants: validParticipants.map((p) => ({
        name: p.name,
        shareAmount: p.shareAmount,
        sharePercentage: p.sharePercentage,
      })),
      payerIndex: participants.findIndex((p) => p.id === payerId),
    };

    const updatedTemplates = [...splitTemplates, template];
    setSplitTemplates(updatedTemplates);
    localStorage.setItem(
      "expenzo_split_templates",
      JSON.stringify(updatedTemplates)
    );
    toast.success(`Template "${templateName}" saved!`);
  };

  const loadTemplate = (template) => {
    setSplitType(template.splitType);
    const newParticipants = template.participants.map((p, idx) => ({
      id: Date.now() + idx,
      name: p.name,
      shareAmount: p.shareAmount || "",
      sharePercentage: p.sharePercentage || "",
    }));
    setParticipants(newParticipants);

    if (
      template.payerIndex >= 0 &&
      template.payerIndex < newParticipants.length
    ) {
      setPayerId(newParticipants[template.payerIndex].id);
    }

    toast.success(`Template "${template.name}" loaded!`);
  };

  const deleteTemplate = (templateId) => {
    const updatedTemplates = splitTemplates.filter((t) => t.id !== templateId);
    setSplitTemplates(updatedTemplates);
    localStorage.setItem(
      "expenzo_split_templates",
      JSON.stringify(updatedTemplates)
    );
    toast.success("Template deleted");
  };

  const loadRecentSplit = (recentSplit) => {
    setSplitType(recentSplit.splitType);
    const newParticipants = recentSplit.participants.map((p, idx) => ({
      id: Date.now() + idx,
      name: p.name,
      shareAmount: p.shareAmount || "",
      sharePercentage: p.sharePercentage || "",
    }));
    setParticipants(newParticipants);

    if (
      recentSplit.payerIndex >= 0 &&
      recentSplit.payerIndex < newParticipants.length
    ) {
      setPayerId(newParticipants[recentSplit.payerIndex].id);
    }

    toast.success("Previous split loaded!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || formData.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    // Validate split if enabled
    if (isSplitExpense) {
      if (splitType === "percentage") {
        const validParticipants = participants.filter(
          (p) => p.name.trim() && p.sharePercentage
        );
        if (validParticipants.length === 0) {
          toast.error(
            "Please add at least one participant with a name and percentage"
          );
          return;
        }

        const totalPercent = validParticipants.reduce(
          (sum, p) => sum + parseFloat(p.sharePercentage || 0),
          0
        );
        if (Math.abs(totalPercent - 100) > 0.01) {
          toast.error(
            `Split percentages (${totalPercent.toFixed(2)}%) must equal 100%`
          );
          return;
        }
      } else {
        const validParticipants = participants.filter(
          (p) => p.name.trim() && p.shareAmount
        );
        if (validParticipants.length === 0) {
          toast.error(
            "Please add at least one participant with a name and share amount"
          );
          return;
        }

        const totalSplit = validParticipants.reduce(
          (sum, p) => sum + parseFloat(p.shareAmount || 0),
          0
        );
        if (Math.abs(totalSplit - parseFloat(formData.amount)) > 0.01) {
          toast.error(
            `Split amounts (₹${totalSplit}) don't match total (₹${formData.amount})`
          );
          return;
        }
      }
    }

    setLoading(true);

    try {
      // Submit the expense first
      await onSubmit(formData);

      // If split is enabled, create a split entry
      if (isSplitExpense) {
        const validParticipants =
          splitType === "percentage"
            ? participants.filter((p) => p.name.trim() && p.sharePercentage)
            : participants.filter((p) => p.name.trim() && p.shareAmount);

        const splitData = {
          title: formData.description || "Expense Split",
          totalAmount: parseFloat(formData.amount),
          splitType: splitType,
          payerId: payerId,
          createdAt: new Date().toISOString(),
          read: false,
          participants: validParticipants.map((p, idx) => {
            const shareAmount =
              splitType === "percentage"
                ? convertPercentageToAmount(p.sharePercentage)
                : p.shareAmount;

            const isPayer = p.id === payerId;

            return {
              id: `p${Date.now()}_${idx}`,
              name: p.name,
              shareAmount: parseFloat(shareAmount),
              sharePercentage:
                splitType === "percentage"
                  ? parseFloat(p.sharePercentage)
                  : null,
              paidAmount: isPayer ? parseFloat(formData.amount) : 0,
              role: isPayer ? "payer" : "participant",
              status: isPayer ? "paid" : "pending",
              paidAt: isPayer ? new Date().toISOString() : null,
            };
          }),
        };

        try {
          await axios.post("/api/splits", splitData);

          // Save to recent splits in localStorage
          const recentSplits = JSON.parse(
            localStorage.getItem("expenzo_recent_splits") || "[]"
          );
          const recentSplit = {
            id: Date.now(),
            date: new Date().toISOString(),
            title: splitData.title,
            splitType: splitData.splitType,
            participants: splitData.participants.map((p) => ({
              name: p.name,
              shareAmount: p.shareAmount,
              sharePercentage: p.sharePercentage,
            })),
            payerIndex: validParticipants.findIndex((p) => p.id === payerId),
          };
          recentSplits.unshift(recentSplit);
          // Keep only last 5 splits
          localStorage.setItem(
            "expenzo_recent_splits",
            JSON.stringify(recentSplits.slice(0, 5))
          );

          toast.success("Expense added and split created!");
        } catch (err) {
          console.error("Failed to create split:", err);
          toast.error("Expense added but split creation failed");
        }
      }

      onClose();
    } catch (error) {
      console.error("Form submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white">
              {mode === "edit" ? "✏️ Edit Expense" : "➕ Add Expense"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                  ₹
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Auto-categorization Suggestion */}
            {suggestedCategory && !formData.category && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-slate-300">
                    Suggested category:{" "}
                    <span className="font-semibold text-primary-400">
                      {suggestedCategory}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={applySuggestedCategory}
                  className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-black text-sm font-semibold rounded transition-colors"
                >
                  Apply
                </button>
              </motion.div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add details about this expense..."
                rows="3"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Payment Method *
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Recurring Toggle */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={handleToggleRecurring}
                className="w-5 h-5 text-primary-500 bg-slate-700 border-slate-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <label
                htmlFor="isRecurring"
                className="flex-1 text-sm font-semibold text-slate-300 cursor-pointer"
              >
                🔄 Make this a recurring expense
              </label>
            </div>

            {/* Recurring Options (shown when isRecurring is true) */}
            {formData.isRecurring && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg"
              >
                <p className="text-xs text-slate-400 mb-3">
                  This expense will automatically recur based on your settings
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {/* Period */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Frequency
                    </label>
                    <select
                      name="period"
                      value={formData.recurrence.period}
                      onChange={handleRecurrenceChange}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  {/* Interval */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Every
                    </label>
                    <input
                      type="number"
                      name="interval"
                      value={formData.recurrence.interval}
                      onChange={handleRecurrenceChange}
                      min="1"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* End Date (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.recurrence.endDate}
                    onChange={handleRecurrenceChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Leave empty for indefinite recurrence
                  </p>
                </div>
              </motion.div>
            )}

            {/* Split Expense Toggle */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <input
                type="checkbox"
                id="isSplitExpense"
                checked={isSplitExpense}
                onChange={(e) => setIsSplitExpense(e.target.checked)}
                className="w-5 h-5 text-primary-500 bg-slate-700 border-slate-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <label
                htmlFor="isSplitExpense"
                className="flex-1 text-sm font-semibold text-slate-300 cursor-pointer"
              >
                <Users className="w-4 h-4 inline mr-1" />
                💰 Split this expense with others
              </label>
            </div>

            {/* Split Options (shown when isSplitExpense is true) */}
            {isSplitExpense && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 bg-secondary-500/10 border border-secondary-500/30 rounded-lg"
              >
                <div className="space-y-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-slate-400">Split by:</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSplitType("amount")}
                          className={`text-xs px-3 py-1 rounded-md transition-colors ${
                            splitType === "amount"
                              ? "bg-secondary-500 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          ₹ Amount
                        </button>
                        <button
                          type="button"
                          onClick={() => setSplitType("percentage")}
                          className={`text-xs px-3 py-1 rounded-md transition-colors ${
                            splitType === "percentage"
                              ? "bg-secondary-500 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          % Percentage
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={distributeEqually}
                      className="text-xs px-3 py-1 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 rounded-md transition-colors"
                    >
                      Distribute Equally
                    </button>
                  </div>

                  {/* Template Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {recentSplits.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const recent = recentSplits.find(
                              (r) => r.id === parseInt(e.target.value)
                            );
                            if (recent) loadRecentSplit(recent);
                          }
                        }}
                        className="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        defaultValue=""
                      >
                        <option value="">🕐 Copy Previous Split...</option>
                        {recentSplits.map((recent) => (
                          <option key={recent.id} value={recent.id}>
                            {recent.title} -{" "}
                            {new Date(recent.date).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      type="button"
                      onClick={saveAsTemplate}
                      className="text-xs px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-md transition-colors"
                    >
                      💾 Save as Template
                    </button>
                    {splitTemplates.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const template = splitTemplates.find(
                              (t) => t.id === parseInt(e.target.value)
                            );
                            if (template) loadTemplate(template);
                          }
                        }}
                        className="text-xs px-3 py-1 bg-slate-700 text-slate-300 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue=""
                      >
                        <option value="">📋 Load Template...</option>
                        {splitTemplates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} ({template.participants.length}{" "}
                            people)
                          </option>
                        ))}
                      </select>
                    )}
                    {splitTemplates.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (
                            e.target.value &&
                            confirm("Delete this template?")
                          ) {
                            deleteTemplate(parseInt(e.target.value));
                          }
                          e.target.value = "";
                        }}
                        className="text-xs px-3 py-1 bg-red-500/20 text-red-300 rounded-md border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500"
                        defaultValue=""
                      >
                        <option value="">🗑️ Delete...</option>
                        {splitTemplates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Participants List */}
                <div className="space-y-3">
                  {participants.map((participant, index) => (
                    <div
                      key={participant.id}
                      className="flex gap-2 items-start p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Name"
                            value={participant.name}
                            onChange={(e) =>
                              handleParticipantChange(
                                participant.id,
                                "name",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          />
                          <button
                            type="button"
                            onClick={() => setPayerId(participant.id)}
                            className={`px-3 py-2 text-xs rounded-lg transition-colors whitespace-nowrap ${
                              payerId === participant.id
                                ? "bg-green-500/20 text-green-300 border border-green-500/50"
                                : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                            }`}
                            title="Mark as payer"
                          >
                            {payerId === participant.id
                              ? "💳 Payer"
                              : "Set Payer"}
                          </button>
                        </div>
                        {splitType === "amount" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-sm">₹</span>
                            <input
                              type="number"
                              placeholder="Share amount"
                              value={participant.shareAmount}
                              onChange={(e) =>
                                handleParticipantChange(
                                  participant.id,
                                  "shareAmount",
                                  e.target.value
                                )
                              }
                              min="0"
                              step="0.01"
                              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Share percentage"
                              value={participant.sharePercentage}
                              onChange={(e) =>
                                handleParticipantChange(
                                  participant.id,
                                  "sharePercentage",
                                  e.target.value
                                )
                              }
                              min="0"
                              max="100"
                              step="0.01"
                              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            />
                            <span className="text-slate-400 text-sm">%</span>
                            {participant.sharePercentage && formData.amount && (
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                (₹
                                {convertPercentageToAmount(
                                  participant.sharePercentage
                                )}
                                )
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveParticipant(participant.id)
                          }
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove participant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Participant Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addMyself}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
                    title="Add yourself as participant and payer"
                  >
                    <Users className="w-4 h-4" />
                    Add Me ({myName})
                  </button>
                  <button
                    type="button"
                    onClick={handleAddParticipant}
                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Other
                  </button>
                  <button
                    type="button"
                    onClick={updateMyName}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-400 rounded-lg transition-colors"
                    title="Change your name"
                  >
                    ✏️
                  </button>
                </div>

                {/* Split Summary */}
                {formData.amount && (
                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total Amount:</span>
                      <span className="text-white font-semibold">
                        ₹{formData.amount}
                      </span>
                    </div>
                    {splitType === "percentage" ? (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-slate-400">Allocated:</span>
                        <span
                          className={`font-semibold ${
                            Math.abs(
                              participants.reduce(
                                (sum, p) =>
                                  sum + parseFloat(p.sharePercentage || 0),
                                0
                              ) - 100
                            ) < 0.01
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {participants
                            .reduce(
                              (sum, p) =>
                                sum + parseFloat(p.sharePercentage || 0),
                              0
                            )
                            .toFixed(2)}
                          %{" (₹"}
                          {participants
                            .reduce(
                              (sum, p) =>
                                sum +
                                parseFloat(
                                  convertPercentageToAmount(
                                    p.sharePercentage
                                  ) || 0
                                ),
                              0
                            )
                            .toFixed(2)}
                          {")"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-slate-400">Allocated:</span>
                        <span
                          className={`font-semibold ${
                            Math.abs(
                              participants.reduce(
                                (sum, p) =>
                                  sum + parseFloat(p.shareAmount || 0),
                                0
                              ) - parseFloat(formData.amount)
                            ) < 0.01
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          ₹
                          {participants
                            .reduce(
                              (sum, p) => sum + parseFloat(p.shareAmount || 0),
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Settlement Calculator */}
                    {payerId &&
                      participants.some(
                        (p) => p.name && (p.shareAmount || p.sharePercentage)
                      ) && (
                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <p className="text-xs text-slate-400 mb-2 font-semibold">
                            💸 Who Owes Whom:
                          </p>
                          <div className="space-y-1">
                            {participants.map((p) => {
                              if (p.id === payerId || !p.name) return null;

                              const owedAmount =
                                splitType === "percentage"
                                  ? convertPercentageToAmount(p.sharePercentage)
                                  : p.shareAmount;

                              const payerName =
                                participants.find((pp) => pp.id === payerId)
                                  ?.name || "Payer";

                              if (!owedAmount || parseFloat(owedAmount) === 0)
                                return null;

                              return (
                                <div
                                  key={p.id}
                                  className="text-xs text-slate-300 flex items-center gap-2"
                                >
                                  <span className="text-orange-400">→</span>
                                  <span className="font-medium">{p.name}</span>
                                  <span className="text-slate-500">owes</span>
                                  <span className="text-green-400 font-semibold">
                                    ₹{parseFloat(owedAmount).toFixed(2)}
                                  </span>
                                  <span className="text-slate-500">to</span>
                                  <span className="font-medium">
                                    {payerName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {mode === "edit" ? "Update" : "Add"} Expense
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExpenseForm;
