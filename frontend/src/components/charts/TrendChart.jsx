import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format, parseISO, startOfDay, subDays } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TrendChart = ({ expenses, days = 7 }) => {
  // Get last N days
  const today = startOfDay(new Date());
  const dates = Array.from({ length: days }, (_, i) =>
    subDays(today, days - 1 - i)
  );

  // Group expenses by date
  const dailyTotals = dates.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayExpenses = expenses.filter((exp) => {
      const expDate = format(parseISO(exp.date), "yyyy-MM-dd");
      return expDate === dateStr;
    });
    return dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  });

  const labels = dates.map((date) => format(date, "MMM dd"));

  const data = {
    labels,
    datasets: [
      {
        label: "Daily Spending",
        data: dailyTotals,
        backgroundColor: "rgba(255, 195, 0, 0.8)",
        borderColor: "#FFC300",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(255, 195, 0, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            return `Spent: ₹${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "#334155",
          borderColor: "#334155",
        },
        ticks: {
          color: "#cbd5e1",
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#334155",
          borderColor: "#334155",
        },
        ticks: {
          color: "#cbd5e1",
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          callback: function (value) {
            return "₹" + value.toLocaleString();
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
          <p className="text-sm">Add expenses to see spending trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Bar data={data} options={options} />
    </div>
  );
};

export default TrendChart;
