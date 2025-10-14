const express = require("express");
const { protect } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const Expense = require("../models/Expense");
const User = require("../models/User");

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get spending insights summary
// @route   GET /api/insights/summary
// @access  Private
router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get expenses for analysis
    const currentMonthExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfMonth },
      isDeleted: false,
    }).sort({ date: -1 });

    const lastMonthExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      isDeleted: false,
    });

    // Calculate basic stats
    const currentMonthTotal = currentMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const lastMonthTotal = lastMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Category analysis
    const categoryStats = {};
    currentMonthExpenses.forEach((expense) => {
      if (!categoryStats[expense.category]) {
        categoryStats[expense.category] = {
          total: 0,
          count: 0,
          emoji: expense.categoryEmoji,
        };
      }
      categoryStats[expense.category].total += expense.amount;
      categoryStats[expense.category].count += 1;
    });

    // Find top category
    const topCategory = Object.entries(categoryStats).sort(
      ([, a], [, b]) => b.total - a.total
    )[0];

    // Payment method analysis
    const paymentMethodStats = {};
    currentMonthExpenses.forEach((expense) => {
      if (!paymentMethodStats[expense.paymentMethod]) {
        paymentMethodStats[expense.paymentMethod] = { total: 0, count: 0 };
      }
      paymentMethodStats[expense.paymentMethod].total += expense.amount;
      paymentMethodStats[expense.paymentMethod].count += 1;
    });

    // Spending patterns
    const weekdaySpending = Array(7).fill(0); // Sunday = 0, Monday = 1, etc.
    const hourlySpending = Array(24).fill(0);

    currentMonthExpenses.forEach((expense) => {
      const day = expense.date.getDay();
      const hour = expense.date.getHours();
      weekdaySpending[day] += expense.amount;
      hourlySpending[hour] += expense.amount;
    });

    // Find peak spending day and hour
    const peakDay = weekdaySpending.indexOf(Math.max(...weekdaySpending));
    const peakHour = hourlySpending.indexOf(Math.max(...hourlySpending));

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Calculate trends
    const monthlyTrend =
      lastMonthTotal > 0
        ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : 0;

    // Get user's budget info
    const user = await User.findById(userId);
    const budgetUsage =
      user.monthlyBudget > 0
        ? (currentMonthTotal / user.monthlyBudget) * 100
        : 0;

    res.json({
      success: true,
      data: {
        overview: {
          currentMonthTotal,
          lastMonthTotal,
          monthlyTrend,
          totalTransactions: currentMonthExpenses.length,
          averageTransaction:
            currentMonthExpenses.length > 0
              ? currentMonthTotal / currentMonthExpenses.length
              : 0,
          budgetUsage,
          formatted: {
            currentMonth: `₹${currentMonthTotal.toFixed(2)}`,
            lastMonth: `₹${lastMonthTotal.toFixed(2)}`,
            trend: `${monthlyTrend > 0 ? "+" : ""}${monthlyTrend.toFixed(1)}%`,
          },
        },
        categories: Object.entries(categoryStats)
          .map(([category, stats]) => ({
            category,
            emoji: stats.emoji,
            total: stats.total,
            count: stats.count,
            percentage:
              currentMonthTotal > 0
                ? (stats.total / currentMonthTotal) * 100
                : 0,
            formatted: `₹${stats.total.toFixed(2)}`,
          }))
          .sort((a, b) => b.total - a.total),
        paymentMethods: Object.entries(paymentMethodStats)
          .map(([method, stats]) => ({
            method,
            total: stats.total,
            count: stats.count,
            percentage:
              currentMonthTotal > 0
                ? (stats.total / currentMonthTotal) * 100
                : 0,
            formatted: `₹${stats.total.toFixed(2)}`,
          }))
          .sort((a, b) => b.total - a.total),
        patterns: {
          peakSpendingDay: dayNames[peakDay],
          peakSpendingHour: `${peakHour}:00`,
          weekdaySpending: weekdaySpending.map((amount, index) => ({
            day: dayNames[index],
            amount,
            formatted: `₹${amount.toFixed(2)}`,
          })),
          topCategory: topCategory
            ? {
                name: topCategory[0],
                emoji: topCategory[1].emoji,
                total: topCategory[1].total,
                count: topCategory[1].count,
                formatted: `₹${topCategory[1].total.toFixed(2)}`,
              }
            : null,
        },
      },
    });
  })
);

// @desc    Get AI-generated insights
// @route   GET /api/insights/ai
// @access  Private
router.get(
  "/ai",
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get expenses for analysis
    const currentMonthExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfMonth },
      isDeleted: false,
    }).sort({ date: -1 });

    const lastMonthExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      isDeleted: false,
    });

    // Calculate stats for AI insights
    const currentMonthTotal = currentMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const lastMonthTotal = lastMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Category analysis
    const categoryTotals = {};
    currentMonthExpenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const topCategory = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    )[0];

    // Generate mock AI insights (replace with actual OpenAI API call)
    const insights = generateMockAIInsights({
      currentMonthTotal,
      lastMonthTotal,
      topCategory,
      expenseCount: currentMonthExpenses.length,
      user: req.user,
    });

    res.json({
      success: true,
      data: {
        insights,
        metadata: {
          generatedAt: new Date(),
          dataRange: {
            from: startOfMonth,
            to: now,
          },
          expenseCount: currentMonthExpenses.length,
        },
      },
    });
  })
);

// @desc    Get spending trends
// @route   GET /api/insights/trends
// @access  Private
router.get(
  "/trends",
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { period = "monthly" } = req.query;

    let groupBy, startDate;
    const now = new Date();

    switch (period) {
      case "daily":
        groupBy = {
          day: { $dayOfMonth: "$date" },
          month: { $month: "$date" },
          year: { $year: "$date" },
        };
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "weekly":
        groupBy = {
          week: { $week: "$date" },
          year: { $year: "$date" },
        };
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "monthly":
      default:
        groupBy = {
          month: { $month: "$date" },
          year: { $year: "$date" },
        };
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
    }

    const trends = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: groupBy,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          categories: {
            $push: {
              category: "$category",
              amount: "$amount",
            },
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 },
      },
    ]);

    res.json({
      success: true,
      data: {
        period,
        trends: trends.map((trend) => ({
          ...trend,
          formatted: `₹${trend.total.toFixed(2)}`,
          average: trend.count > 0 ? trend.total / trend.count : 0,
        })),
      },
    });
  })
);

// Helper function to generate mock AI insights
function generateMockAIInsights({
  currentMonthTotal,
  lastMonthTotal,
  topCategory,
  expenseCount,
  user,
}) {
  const insights = [];
  const monthlyTrend =
    lastMonthTotal > 0
      ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : 0;

  // Spending trend insight
  if (monthlyTrend > 20) {
    insights.push({
      type: "warning",
      emoji: "📈",
      title: "Spending Alert!",
      message: `You've spent ${monthlyTrend.toFixed(
        1
      )}% more this month compared to last month. Consider reviewing your expenses.`,
      priority: "high",
    });
  } else if (monthlyTrend < -10) {
    insights.push({
      type: "success",
      emoji: "💚",
      title: "Great Job!",
      message: `You've reduced your spending by ${Math.abs(
        monthlyTrend
      ).toFixed(1)}% this month. Keep up the good work!`,
      priority: "medium",
    });
  }

  // Top category insight
  if (topCategory) {
    const [categoryName, amount] = topCategory;
    const percentage =
      currentMonthTotal > 0 ? (amount / currentMonthTotal) * 100 : 0;

    const categoryEmojis = {
      "Food & Dining": "🍽️",
      Transportation: "🚗",
      Shopping: "🛍️",
      Entertainment: "🎬",
      "Coffee & Tea": "☕",
    };

    const emoji = categoryEmojis[categoryName] || "💸";

    if (percentage > 40) {
      insights.push({
        type: "info",
        emoji,
        title: `${categoryName} Dominance`,
        message: `${percentage.toFixed(
          1
        )}% of your spending this month went to ${categoryName.toLowerCase()}. Consider if this aligns with your priorities.`,
        priority: "medium",
      });
    } else if (categoryName === "Coffee & Tea" && amount > 1000) {
      insights.push({
        type: "fun",
        emoji: "☕",
        title: "Coffee Lover Alert!",
        message: `Expenzo thinks you love coffee! You've spent ₹${amount.toFixed(
          2
        )} on coffee & tea this month. That's enough for ${Math.floor(
          amount / 150
        )} premium coffees!`,
        priority: "low",
      });
    }
  }

  // Budget insight
  if (user.monthlyBudget > 0) {
    const budgetUsage = (currentMonthTotal / user.monthlyBudget) * 100;

    if (budgetUsage > 90) {
      insights.push({
        type: "warning",
        emoji: "🚨",
        title: "Budget Alert!",
        message: `You've used ${budgetUsage.toFixed(
          1
        )}% of your monthly budget. Time to slow down on spending!`,
        priority: "high",
      });
    } else if (budgetUsage > 75) {
      insights.push({
        type: "warning",
        emoji: "⚠️",
        title: "Budget Watch",
        message: `You're at ${budgetUsage.toFixed(
          1
        )}% of your monthly budget. Keep an eye on your remaining expenses.`,
        priority: "medium",
      });
    }
  }

  // Frequency insight
  if (expenseCount > 100) {
    insights.push({
      type: "info",
      emoji: "📊",
      title: "Active Tracker!",
      message: `Wow! You've logged ${expenseCount} expenses this month. You're really on top of your spending game!`,
      priority: "low",
    });
  } else if (expenseCount < 10) {
    insights.push({
      type: "info",
      emoji: "🎯",
      title: "Minimal Tracker",
      message: `Only ${expenseCount} expenses logged this month. Are you tracking all your spending?`,
      priority: "medium",
    });
  }

  // Fun personalized insights
  const funInsights = [
    {
      type: "fun",
      emoji: "🎉",
      title: "Expenzo Says Hi!",
      message: `Hey ${
        user.name
      }! Your spending personality shows you're a ${getSpendingPersonality(
        currentMonthTotal,
        expenseCount
      )}. Keep tracking smart!`,
      priority: "low",
    },
  ];

  return [...insights, ...funInsights].slice(0, 5); // Limit to 5 insights
}

// Helper function to determine spending personality
function getSpendingPersonality(total, count) {
  const avgExpense = count > 0 ? total / count : 0;

  if (avgExpense > 1000) return "High Roller 🎩";
  if (avgExpense > 500) return "Smart Spender 🧠";
  if (avgExpense > 200) return "Balanced Buyer 📊";
  if (count > 50) return "Micro Manager 🔍";
  return "Mindful Spender 🧘";
}

module.exports = router;
