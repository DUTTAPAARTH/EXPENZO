import React from "react";
import { motion } from "framer-motion";

const CategoryBreakdownChart = () => {
  // Spending categories from API
  const categories = [];

  const total =
    categories.length > 0
      ? categories.reduce((sum, cat) => sum + cat.amount, 0)
      : 0;

  // Calculate percentages and cumulative angles for donut
  let cumulativePercentage = 0;
  const categoriesWithAngles = categories.map((cat) => {
    const percentage = (cat.amount / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    cumulativePercentage += percentage;
    const endAngle = cumulativePercentage * 3.6;

    return {
      ...cat,
      percentage: percentage.toFixed(1),
      startAngle,
      endAngle,
    };
  });

  return (
    <div className="space-y-6">
      {/* Donut Chart */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* SVG Donut Chart */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgb(30, 41, 59)"
              strokeWidth="12"
            />

            {/* Category segments */}
            {categoriesWithAngles.map((cat, index) => {
              const circumference = 2 * Math.PI * 40;
              const percentage = parseFloat(cat.percentage);
              const offset = circumference * ((100 - percentage) / 100);

              return (
                <motion.circle
                  key={cat.name}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  className="stroke-current"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{
                    duration: 1,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                  style={{
                    stroke: `url(#gradient-${index})`,
                    transform: `rotate(${cat.startAngle}deg)`,
                    transformOrigin: "50% 50%",
                  }}
                />
              );
            })}

            {/* Gradients */}
            <defs>
              {categoriesWithAngles.map((cat, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={
                      cat.color.includes("red")
                        ? "#ef4444"
                        : cat.color.includes("blue")
                        ? "#3b82f6"
                        : cat.color.includes("purple")
                        ? "#a855f7"
                        : cat.color.includes("yellow")
                        ? "#eab308"
                        : "#10b981"
                    }
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      cat.color.includes("orange")
                        ? "#f97316"
                        : cat.color.includes("cyan")
                        ? "#06b6d4"
                        : cat.color.includes("pink")
                        ? "#ec4899"
                        : cat.color.includes("amber")
                        ? "#f59e0b"
                        : "#059669"
                    }
                  />
                </linearGradient>
              ))}
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-white">
              ₹{(total / 1000).toFixed(1)}k
            </p>
            <p className="text-xs text-slate-500">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {categoriesWithAngles.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-lg">{cat.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{cat.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${cat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 min-w-[35px] text-right">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right ml-4">
              <p className="text-sm font-semibold text-white">
                ₹{cat.amount.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;
