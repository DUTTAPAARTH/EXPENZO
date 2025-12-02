import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ expenses }) => {
  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category || "Others";
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  // Category colors matching ExpenseItem
  const categoryColors = {
    "🍔 Food & Dining": "#f97316",
    "🚗 Transportation": "#3b82f6",
    "🛍️ Shopping": "#ec4899",
    "💡 Bills & Utilities": "#f59e0b",
    "🎬 Entertainment": "#a855f7",
    "💪 Health & Fitness": "#10b981",
    "🏠 Rent & Housing": "#6366f1",
    "📦 Others": "#64748b",
  };

  const backgroundColors = categories.map(
    (cat) => categoryColors[cat] || "#64748b"
  );

  const borderColors = backgroundColors.map((color) => color);

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Spending by Category",
        data: amounts,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#cbd5e1",
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">No data available</p>
          <p className="text-sm">Add expenses to see category breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Pie data={data} options={options} />
    </div>
  );
};

export default CategoryChart;
