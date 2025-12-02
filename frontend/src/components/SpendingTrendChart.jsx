import React from "react";
import { motion } from "framer-motion";

const SpendingTrendChart = () => {
  // Data for the last 6 months from API
  const data = [];

  const maxAmount =
    data.length > 0 ? Math.max(...data.map((d) => d.amount)) : 0;
  const minAmount =
    data.length > 0 ? Math.min(...data.map((d) => d.amount)) : 0;
  const chartHeight = 200;

  // Calculate bar heights as percentages
  const getBarHeight = (amount) => {
    const range = maxAmount - minAmount;
    const percentage = ((amount - minAmount) / range) * 100;
    return Math.max(percentage * 0.8 + 20, 20); // Min 20% height
  };

  return (
    <div className="space-y-4">
      {/* Chart Area */}
      <div className="relative" style={{ height: `${chartHeight}px` }}>
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-slate-800/50" />
          ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-around px-2">
          {data.map((item, index) => {
            const height = getBarHeight(item.amount);
            const isHighest = item.amount === maxAmount;

            return (
              <motion.div
                key={item.month}
                className="flex flex-col items-center gap-2 flex-1 max-w-[60px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Bar */}
                <motion.div
                  className="w-full relative group cursor-pointer"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                >
                  <div
                    className={`w-full h-full rounded-t-lg transition-all duration-300 ${
                      isHighest
                        ? "bg-gradient-to-t from-primary-600 to-primary-400"
                        : "bg-gradient-to-t from-slate-700 to-slate-600 hover:from-primary-600/50 hover:to-primary-400/50"
                    }`}
                  />

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-slate-700">
                      ₹{item.amount.toLocaleString()}
                    </div>
                    <div className="w-2 h-2 bg-slate-800 border-slate-700 border-r border-b rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                  </div>
                </motion.div>

                {/* Month Label */}
                <span className="text-xs text-slate-500 font-medium">
                  {item.month}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary-600 to-primary-400" />
          <span className="text-xs text-slate-400">Current Month</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-slate-700 to-slate-600" />
          <span className="text-xs text-slate-400">Previous Months</span>
        </div>
      </div>
    </div>
  );
};

export default SpendingTrendChart;
