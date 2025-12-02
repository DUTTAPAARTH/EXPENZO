// Demo insights routes without MongoDB
const express = require("express");
const router = express.Router();

// Helper to get user from auth header
const getUserFromToken = (req) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return { id: "demo-user", name: "Demo User", email: "demo@expenzo.com" };
};

// @desc    Get AI-powered spending insights
// @route   GET /api/insights
// @access  Public (demo mode)
router.get("/", (req, res) => {
  const user = getUserFromToken(req);

  // Mock insights based on common spending patterns
  const insights = {
    success: true,
    data: {
      overview: {
        totalSpent: 45230.5,
        avgDailySpend: 1507.68,
        highestCategory: "Food & Dining",
        savingsPotential: 8500,
        spendingTrend: "increasing",
      },
      aiInsights: [
        {
          id: "insight-1",
          type: "warning",
          emoji: "⚠️",
          title: "High Food Spending Alert",
          description:
            "Your food expenses are 35% higher than average users. Consider meal planning to save ₹3,500/month.",
          impact: "high",
          category: "Food & Dining",
          amount: 15750,
          recommendation:
            "Try cooking at home 3 more days per week. Potential savings: ₹3,500/month",
        },
        {
          id: "insight-2",
          type: "success",
          emoji: "🎯",
          title: "Great Shopping Habits!",
          description:
            "You're spending 20% less on shopping compared to last month. Keep it up!",
          impact: "positive",
          category: "Shopping",
          amount: -2500,
          recommendation: "Maintain this pattern to save ₹30,000 annually",
        },
        {
          id: "insight-3",
          type: "info",
          emoji: "💡",
          title: "Subscription Optimization",
          description:
            "You have 5 active subscriptions totaling ₹2,450/month. Review unused services.",
          impact: "medium",
          category: "Entertainment",
          amount: 2450,
          recommendation: "Cancel unused subscriptions to save ₹1,200/month",
        },
        {
          id: "insight-4",
          type: "tip",
          emoji: "🚗",
          title: "Transportation Savings",
          description:
            "Consider carpooling or public transport for daily commute to reduce fuel costs.",
          impact: "medium",
          category: "Transportation",
          amount: 4500,
          recommendation: "Potential savings: ₹1,500/month with carpooling",
        },
      ],
      categoryAnalysis: [
        {
          category: "Food & Dining",
          spent: 15750,
          budget: 12000,
          percentage: 131,
          status: "over_budget",
          trend: "+15%",
          emoji: "🍕",
          topVendors: ["Zomato", "Swiggy", "McDonald's"],
          avgTransaction: 525,
          transactionCount: 30,
        },
        {
          category: "Transportation",
          spent: 4500,
          budget: 5000,
          percentage: 90,
          status: "on_track",
          trend: "+5%",
          emoji: "🚗",
          topVendors: ["Uber", "Ola", "Petrol Pump"],
          avgTransaction: 300,
          transactionCount: 15,
        },
        {
          category: "Shopping",
          spent: 8900,
          budget: 10000,
          percentage: 89,
          status: "on_track",
          trend: "-20%",
          emoji: "🛍️",
          topVendors: ["Amazon", "Flipkart", "Myntra"],
          avgTransaction: 890,
          transactionCount: 10,
        },
        {
          category: "Entertainment",
          spent: 2450,
          budget: 3000,
          percentage: 82,
          status: "on_track",
          trend: "0%",
          emoji: "🎬",
          topVendors: ["Netflix", "Spotify", "Prime Video"],
          avgTransaction: 490,
          transactionCount: 5,
        },
        {
          category: "Health & Fitness",
          spent: 3500,
          budget: 4000,
          percentage: 87,
          status: "on_track",
          trend: "+10%",
          emoji: "💪",
          topVendors: ["Gym", "HealthifyMe", "Pharmacy"],
          avgTransaction: 1166,
          transactionCount: 3,
        },
        {
          category: "Bills & Utilities",
          spent: 6800,
          budget: 7000,
          percentage: 97,
          status: "on_track",
          trend: "+2%",
          emoji: "💡",
          topVendors: ["Electricity", "Internet", "Mobile"],
          avgTransaction: 2266,
          transactionCount: 3,
        },
      ],
      monthlyTrends: {
        spending: [
          { month: "Jan", amount: 42500 },
          { month: "Feb", amount: 38900 },
          { month: "Mar", amount: 45230 },
        ],
        savings: [
          { month: "Jan", amount: 7500 },
          { month: "Feb", amount: 11100 },
          { month: "Mar", amount: 4770 },
        ],
      },
      predictions: {
        nextMonthSpending: 47500,
        confidenceLevel: 85,
        basedOn: "3-month average with seasonal adjustments",
        recommendation:
          "Set budget of ₹45,000 to stay within comfortable range",
      },
      budgetRecommendations: [
        {
          category: "Food & Dining",
          current: 12000,
          recommended: 10000,
          reason: "Based on healthy spending patterns",
          savings: 2000,
        },
        {
          category: "Entertainment",
          current: 3000,
          recommended: 2000,
          reason: "Optimize subscriptions",
          savings: 1000,
        },
        {
          category: "Shopping",
          current: 10000,
          recommended: 8000,
          reason: "Reduce impulse purchases",
          savings: 2000,
        },
      ],
      comparisonWithPeers: {
        yourSpending: 45230,
        avgPeerSpending: 38500,
        percentile: 65,
        message: "You're spending more than 65% of users in your demographic",
      },
      savingsTips: [
        {
          id: "tip-1",
          emoji: "🍳",
          title: "Meal Prep Sunday",
          description:
            "Prepare 5 meals on Sunday to avoid weekday food delivery",
          potentialSavings: 3500,
          difficulty: "easy",
          category: "Food & Dining",
        },
        {
          id: "tip-2",
          emoji: "🚶",
          title: "Walk Short Distances",
          description: "Walk for trips under 2km instead of taking cab/auto",
          potentialSavings: 800,
          difficulty: "easy",
          category: "Transportation",
        },
        {
          id: "tip-3",
          emoji: "📺",
          title: "Review Subscriptions",
          description: "Cancel 2 unused streaming services",
          potentialSavings: 1200,
          difficulty: "very_easy",
          category: "Entertainment",
        },
        {
          id: "tip-4",
          emoji: "💳",
          title: "Use Cashback Cards",
          description:
            "Get 2-5% cashback on all purchases with right credit card",
          potentialSavings: 900,
          difficulty: "easy",
          category: "General",
        },
        {
          id: "tip-5",
          emoji: "🏷️",
          title: "Shop During Sales",
          description: "Wait for seasonal sales for non-urgent purchases",
          potentialSavings: 2500,
          difficulty: "medium",
          category: "Shopping",
        },
      ],
      achievements: [
        {
          id: "ach-1",
          emoji: "🎯",
          title: "Budget Master",
          description: "Stayed within budget for 2 categories this month",
          unlocked: true,
          date: "2024-03-15",
        },
        {
          id: "ach-2",
          emoji: "💰",
          title: "Savings Streak",
          description: "Saved money for 3 consecutive months",
          unlocked: false,
          progress: 66,
        },
        {
          id: "ach-3",
          emoji: "📊",
          title: "Data Enthusiast",
          description: "Tracked expenses for 30 consecutive days",
          unlocked: true,
          date: "2024-03-10",
        },
      ],
    },
  };

  res.json(insights);
});

// @desc    Get category-specific insights
// @route   GET /api/insights/category/:category
// @access  Public (demo mode)
router.get("/category/:category", (req, res) => {
  const { category } = req.params;
  const user = getUserFromToken(req);

  const categoryInsights = {
    success: true,
    data: {
      category,
      analysis: {
        totalSpent: 15750,
        avgPerTransaction: 525,
        transactionCount: 30,
        budgetUsed: 131,
        trend: "increasing",
        comparedToLastMonth: "+15%",
      },
      breakdown: {
        weekday: [
          { day: "Mon", amount: 2100 },
          { day: "Tue", amount: 1890 },
          { day: "Wed", amount: 2450 },
          { day: "Thu", amount: 2300 },
          { day: "Fri", amount: 3200 },
          { day: "Sat", amount: 2010 },
          { day: "Sun", amount: 1800 },
        ],
        timeOfDay: [
          { time: "Morning (6-12)", amount: 4200, percentage: 27 },
          { time: "Afternoon (12-18)", amount: 6300, percentage: 40 },
          { time: "Evening (18-24)", amount: 4500, percentage: 29 },
          { time: "Night (0-6)", amount: 750, percentage: 4 },
        ],
      },
      topMerchants: [
        { name: "Zomato", amount: 6300, transactions: 15 },
        { name: "Swiggy", amount: 5400, transactions: 10 },
        { name: "McDonald's", amount: 2100, transactions: 3 },
        { name: "Starbucks", amount: 1950, transactions: 2 },
      ],
      insights: [
        {
          type: "pattern",
          emoji: "📊",
          message: "You spend 40% more on Fridays",
          recommendation: "Plan meals ahead for Friday to reduce spending",
        },
        {
          type: "opportunity",
          emoji: "💡",
          message: "Afternoon orders are your highest expense",
          recommendation: "Pack lunch to save ₹3,150/month",
        },
      ],
    },
  };

  res.json(categoryInsights);
});

// @desc    Get spending forecast
// @route   GET /api/insights/forecast
// @access  Public (demo mode)
router.get("/forecast", (req, res) => {
  const user = getUserFromToken(req);

  const forecast = {
    success: true,
    data: {
      currentMonth: {
        spent: 45230,
        remaining: 4770,
        daysLeft: 12,
        projectedTotal: 48500,
        status: "on_track",
      },
      nextMonth: {
        predicted: 47500,
        confidence: 85,
        range: { min: 44000, max: 51000 },
        factors: [
          "Seasonal patterns",
          "Recent spending trends",
          "Upcoming holidays",
        ],
      },
      quarterly: {
        q1: { predicted: 142500, confidence: 80 },
        q2: { predicted: 145000, confidence: 65 },
      },
      recommendations: [
        "Set aside ₹48,000 for next month",
        "Consider creating emergency fund of ₹25,000",
        "Review and adjust Food & Dining budget",
      ],
    },
  };

  res.json(forecast);
});

// @desc    Get personalized recommendations
// @route   GET /api/insights/recommendations
// @access  Public (demo mode)
router.get("/recommendations", (req, res) => {
  const user = getUserFromToken(req);

  const recommendations = {
    success: true,
    data: {
      priority: [
        {
          id: "rec-1",
          priority: "high",
          emoji: "🚨",
          title: "Reduce Food Delivery",
          description: "Cut food delivery orders by 30%",
          impact: "₹3,500/month savings",
          difficulty: "medium",
          steps: [
            "Plan weekly meals on Sunday",
            "Cook in batches",
            "Limit delivery to 2x per week",
          ],
          estimatedTime: "2 weeks to build habit",
        },
        {
          id: "rec-2",
          priority: "medium",
          emoji: "💳",
          title: "Optimize Credit Cards",
          description: "Use right card for each category",
          impact: "₹900/month cashback",
          difficulty: "easy",
          steps: [
            "Check card benefits",
            "Use grocery card for groceries",
            "Use travel card for transport",
          ],
          estimatedTime: "Immediate",
        },
        {
          id: "rec-3",
          priority: "medium",
          emoji: "📺",
          title: "Subscription Audit",
          description: "Cancel unused subscriptions",
          impact: "₹1,200/month savings",
          difficulty: "very_easy",
          steps: [
            "List all active subscriptions",
            "Mark unused ones",
            "Cancel or pause subscriptions",
          ],
          estimatedTime: "1 hour",
        },
      ],
      longTerm: [
        {
          goal: "Emergency Fund",
          target: 150000,
          timeframe: "12 months",
          monthlySaving: 12500,
          recommendation: "Start with ₹5,000/month and increase gradually",
        },
        {
          goal: "Vacation Fund",
          target: 80000,
          timeframe: "8 months",
          monthlySaving: 10000,
          recommendation: "Automate ₹10,000 transfer to savings account",
        },
      ],
    },
  };

  res.json(recommendations);
});

// @desc    Get spending patterns
// @route   GET /api/insights/patterns
// @access  Public (demo mode)
router.get("/patterns", (req, res) => {
  const user = getUserFromToken(req);

  const patterns = {
    success: true,
    data: {
      weekly: {
        peakDay: "Friday",
        lowestDay: "Tuesday",
        avgDifference: "45%",
        pattern: "Weekend heavy spending",
      },
      monthly: {
        peakWeek: "First week (Salary week)",
        spending: { week1: 15000, week2: 12000, week3: 10000, week4: 8000 },
        pattern: "Declining throughout month",
      },
      seasonal: {
        highMonths: ["December", "March", "August"],
        lowMonths: ["January", "June"],
        factors: ["Festivals", "Sales", "Vacation"],
      },
      behavioral: [
        {
          pattern: "Impulse purchases on Friday evenings",
          frequency: "70% of Fridays",
          avgAmount: 1200,
          suggestion: "Avoid shopping apps on Friday evenings",
        },
        {
          pattern: "High food delivery during work-from-home days",
          frequency: "3x more than office days",
          avgAmount: 450,
          suggestion: "Prepare simple meals for WFH days",
        },
      ],
    },
  };

  res.json(patterns);
});

module.exports = router;
