import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const QuickAdd = ({ onExpenseCreated }) => {
  const [input, setInput] = useState("");
  const [parsing, setParsing] = useState(false);

  // Simple NLP parser for expense input
  const parseInput = (text) => {
    const now = new Date();
    const result = {
      description: "",
      amount: null,
      date: now.toISOString().split("T")[0],
      category: "📦 Others",
      paymentMethod: "Cash",
    };

    // Amount patterns: ₹150, 150, Rs 150, Rs. 150
    const amountMatch =
      text.match(/(?:₹|rs\.?|inr)\s*(\d+(?:\.\d{2})?)/i) ||
      text.match(/(\d+(?:\.\d{2})?)\s*(?:₹|rs\.?|rupees?)/i) ||
      text.match(/\b(\d+(?:\.\d{2})?)\b/);

    if (amountMatch) {
      result.amount = parseFloat(amountMatch[1]);
      text = text.replace(amountMatch[0], "").trim();
    }

    // Date patterns: today, yesterday, tomorrow, Monday, 5th, 5 Jan
    const datePatterns = {
      today: 0,
      yesterday: -1,
      tomorrow: 1,
    };

    const dateLower = text.toLowerCase();
    for (const [keyword, offset] of Object.entries(datePatterns)) {
      if (dateLower.includes(keyword)) {
        const date = new Date(now);
        date.setDate(date.getDate() + offset);
        result.date = date.toISOString().split("T")[0];
        text = text.replace(new RegExp(keyword, "i"), "").trim();
        break;
      }
    }

    // Category detection (keywords)
    const categoryKeywords = {
      "🍔 Food & Dining": [
        "coffee",
        "lunch",
        "dinner",
        "breakfast",
        "food",
        "restaurant",
        "cafe",
        "starbucks",
        "mcdonald",
        "pizza",
        "burger",
      ],
      "🚗 Transportation": [
        "uber",
        "ola",
        "taxi",
        "cab",
        "bus",
        "metro",
        "train",
        "fuel",
        "petrol",
        "diesel",
        "gas",
      ],
      "🛍️ Shopping": [
        "shopping",
        "amazon",
        "flipkart",
        "clothes",
        "shirt",
        "shoes",
        "purchase",
        "buy",
      ],
      "💡 Bills & Utilities": [
        "electricity",
        "water",
        "internet",
        "wifi",
        "phone",
        "bill",
        "utility",
      ],
      "🎬 Entertainment": [
        "movie",
        "netflix",
        "spotify",
        "prime",
        "cinema",
        "concert",
        "show",
      ],
      "💪 Health & Fitness": [
        "gym",
        "doctor",
        "medicine",
        "pharmacy",
        "hospital",
        "fitness",
      ],
      "🏠 Rent & Housing": ["rent", "house", "apartment", "maintenance"],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => dateLower.includes(keyword))) {
        result.category = category;
        break;
      }
    }

    // Payment method detection
    const paymentKeywords = {
      "Credit Card": ["credit", "card"],
      "Debit Card": ["debit"],
      UPI: ["upi", "paytm", "gpay", "phonepe", "googlepay"],
      Cash: ["cash"],
      "Net Banking": ["bank", "netbanking"],
    };

    for (const [method, keywords] of Object.entries(paymentKeywords)) {
      if (keywords.some((keyword) => dateLower.includes(keyword))) {
        result.paymentMethod = method;
        text = text.replace(new RegExp(keywords.join("|"), "i"), "").trim();
        break;
      }
    }

    // Remaining text is description
    result.description = text.trim() || "Quick expense";

    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter expense details");
      return;
    }

    setParsing(true);

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const parsedExpense = parseInput(input);

      if (!parsedExpense.amount || parsedExpense.amount <= 0) {
        toast.error("Could not detect amount. Please include amount like ₹150");
        setParsing(false);
        return;
      }

      // Call the callback to create expense
      await onExpenseCreated(parsedExpense);

      // Show success
      toast.success(
        `Added ${parsedExpense.description} for ₹${parsedExpense.amount}`,
        { duration: 3000 }
      );

      // Reset input
      setInput("");
    } catch (error) {
      toast.error("Failed to add expense");
    } finally {
      setParsing(false);
    }
  };

  const examples = [
    "Coffee ₹150 today",
    "Uber ride 250 yesterday",
    "Lunch ₹450 at restaurant",
    "Grocery shopping 1200",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/30 rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-primary-400" />
        <h3 className="font-semibold text-white">Quick Add with AI</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Try: "Coffee ₹150 today" or "Uber 250 yesterday"'
            disabled={parsing}
            className="w-full px-4 py-3 pr-12 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={parsing || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-700 text-black rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {parsing ? (
              <Sparkles className="w-4 h-4 animate-pulse" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setInput(example)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-full transition-colors"
            >
              {example}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          <Sparkles className="w-3 h-3 inline mr-1 text-primary-400" />
          Just type naturally! Include amount (₹150 or 150), description
          (coffee, uber), and optionally date (today, yesterday).
        </p>
      </form>
    </motion.div>
  );
};

export default QuickAdd;
