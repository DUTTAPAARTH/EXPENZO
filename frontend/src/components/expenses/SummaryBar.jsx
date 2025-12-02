import React from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Wallet, Hash } from "lucide-react";

const SummaryBar = ({ expenses }) => {
  const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const transactionCount = expenses.length;

  // Calculate income (placeholder - you can pass this as prop or fetch from API)
  const income = 50000; // Mock income
  const balance = income - totalSpent;

  // Calculate month-over-month change (mock for now)
  const changePercent = 12.5;
  const isIncrease = changePercent > 0;

  const cards = [
    {
      title: "Total Spent",
      value: `₹${totalSpent.toLocaleString()}`,
      icon: TrendingDown,
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-500/10 to-pink-500/10",
      change: `${isIncrease ? "+" : ""}${changePercent}%`,
      changeColor: isIncrease ? "text-red-400" : "text-green-400",
    },
    {
      title: "Income",
      value: `₹${income.toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-green-500 to-teal-500",
      bgGradient: "from-green-500/10 to-teal-500/10",
      change: "+5.2%",
      changeColor: "text-green-400",
    },
    {
      title: "Balance",
      value: `₹${balance.toLocaleString()}`,
      icon: Wallet,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      change: balance > 0 ? "Healthy" : "Low",
      changeColor: balance > 0 ? "text-green-400" : "text-red-400",
    },
    {
      title: "Transactions",
      value: transactionCount,
      icon: Hash,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      change: `${transactionCount} total`,
      changeColor: "text-slate-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            {/* Card Content */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-300">
              {/* Icon */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`p-2.5 rounded-lg bg-gradient-to-br ${card.gradient}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-semibold ${card.changeColor}`}>
                  {card.change}
                </span>
              </div>

              {/* Value */}
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white group-hover:scale-105 transition-transform">
                  {card.value}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  {card.title}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SummaryBar;
