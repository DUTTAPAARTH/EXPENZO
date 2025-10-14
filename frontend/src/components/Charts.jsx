import React from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export const ExpenseChart = ({ expenses, type = "doughnut" }) => {
  // Process data for category-wise expenses
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category || "💰 Other";
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const colors = [
    "#FFC300", // Primary
    "#2ECCB0", // Secondary
    "#00AEEF", // Accent
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEAA7", // Yellow
    "#DDA0DD", // Plum
    "#98D8C8", // Mint
  ];

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: colors.slice(0, Object.keys(categoryData).length),
        borderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
          color: "rgb(75, 85, 99)", // Gray-600
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(context.parsed);
            return `${context.label}: ${value}`;
          },
        },
      },
    },
  };

  if (type === "doughnut") {
    return (
      <div className="h-64 w-full">
        <Doughnut data={chartData} options={options} />
      </div>
    );
  }

  return null;
};

export const SpendingTrendChart = ({ expenses }) => {
  // Group expenses by date for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const dailySpending = last7Days.map((date) => {
    const dayExpenses = expenses.filter(
      (expense) => new Date(expense.date).toISOString().split("T")[0] === date
    );
    return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  });

  const chartData = {
    labels: last7Days.map((date) => {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Daily Spending",
        data: dailySpending,
        borderColor: "#FFC300",
        backgroundColor: "rgba(255, 195, 0, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#FFC300",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(context.parsed.y);
            return `Spent: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            }).format(value);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export const MonthlyComparisonChart = ({ expenses }) => {
  // Get last 6 months data
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    };
  }).reverse();

  const monthlySpending = months.map((month) => {
    const monthExpenses = expenses.filter((expense) => {
      const expenseMonth = new Date(expense.date).toISOString().slice(0, 7);
      return expenseMonth === month.key;
    });
    return monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  });

  const chartData = {
    labels: months.map((m) => m.label),
    datasets: [
      {
        label: "Monthly Spending",
        data: monthlySpending,
        backgroundColor: "#2ECCB0",
        borderColor: "#2ECCB0",
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(context.parsed.y);
            return `Total: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            }).format(value);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};
