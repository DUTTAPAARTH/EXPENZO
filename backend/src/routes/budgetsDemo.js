// Demo Budget Routes (In-Memory Storage)
const express = require("express");
const router = express.Router();

// In-memory budget storage with realistic spending data
let budgets = [
  {
    id: "budget-1",
    userId: "demo-user-1",
    category: "Food",
    amount: 5000,
    period: "monthly",
    spent: 4750, // 95% - Featured: Near limit!
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "budget-2",
    userId: "demo-user-1",
    category: "Transport",
    amount: 2000,
    period: "monthly",
    spent: 850, // 42.5% - Normal
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "budget-3",
    userId: "demo-user-1",
    category: "Shopping",
    amount: 3000,
    period: "monthly",
    spent: 3200, // 106% - Featured: Over budget!
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "budget-4",
    userId: "demo-user-1",
    category: "Entertainment",
    amount: 2500,
    period: "monthly",
    spent: 1250, // 50% - Normal
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "budget-5",
    userId: "demo-user-1",
    category: "Bills",
    amount: 4000,
    period: "monthly",
    spent: 3600, // 90% - Featured: Warning!
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "budget-6",
    userId: "demo-user-1",
    category: "Groceries",
    amount: 3500,
    period: "monthly",
    spent: 2100, // 60% - Normal
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "budget-7",
    userId: "demo-user-1",
    category: "Health",
    amount: 1500,
    period: "monthly",
    spent: 150, // 10% - Featured: Barely used
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "budget-8",
    userId: "demo-user-1",
    category: "Other",
    amount: 1000,
    period: "monthly",
    spent: 450, // 45% - Normal
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

// Helper to get user from token (demo)
const getUserFromToken = (req) => {
  return { id: "demo-user-1", email: "demo@expenzo.com" };
};

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Public (demo mode)
router.get("/", (req, res) => {
  const user = getUserFromToken(req);
  const userBudgets = budgets.filter((b) => b.userId === user.id);

  res.json({
    success: true,
    data: { budgets: userBudgets },
  });
});

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Public (demo mode)
router.get("/:id", (req, res) => {
  const user = getUserFromToken(req);
  const budget = budgets.find(
    (b) => b.id === req.params.id && b.userId === user.id
  );

  if (!budget) {
    return res.status(404).json({
      success: false,
      message: "Budget not found",
    });
  }

  res.json({
    success: true,
    data: { budget },
  });
});

// @desc    Create budget
// @route   POST /api/budgets
// @access  Public (demo mode)
router.post("/", (req, res) => {
  const user = getUserFromToken(req);
  const { category, limit, period } = req.body;

  if (!category || !limit || !period) {
    return res.status(400).json({
      success: false,
      message: "Please provide category, limit, and period",
    });
  }

  // Check if budget already exists for this category
  const existingBudget = budgets.find(
    (b) =>
      b.userId === user.id && b.category === category && b.period === period
  );

  if (existingBudget) {
    return res.status(400).json({
      success: false,
      message: "Budget already exists for this category and period",
    });
  }

  const newBudget = {
    id: `budget-${Date.now()}`,
    userId: user.id,
    category,
    limit: parseFloat(limit),
    period,
    spent: 0,
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  budgets.push(newBudget);

  res.status(201).json({
    success: true,
    message: "💰 Budget created successfully!",
    data: { budget: newBudget },
  });
});

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Public (demo mode)
router.put("/:id", (req, res) => {
  const user = getUserFromToken(req);
  const budgetIndex = budgets.findIndex(
    (b) => b.id === req.params.id && b.userId === user.id
  );

  if (budgetIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Budget not found",
    });
  }

  const { category, limit, period } = req.body;

  budgets[budgetIndex] = {
    ...budgets[budgetIndex],
    ...(category && { category }),
    ...(limit && { limit: parseFloat(limit) }),
    ...(period && { period }),
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: "✏️ Budget updated successfully!",
    data: { budget: budgets[budgetIndex] },
  });
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Public (demo mode)
router.delete("/:id", (req, res) => {
  const user = getUserFromToken(req);
  const budgetIndex = budgets.findIndex(
    (b) => b.id === req.params.id && b.userId === user.id
  );

  if (budgetIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Budget not found",
    });
  }

  budgets.splice(budgetIndex, 1);

  res.json({
    success: true,
    message: "🗑️ Budget deleted successfully!",
  });
});

// @desc    Update budget spent amount (called when expense added/updated)
// @route   POST /api/budgets/update-spent
// @access  Public (demo mode)
router.post("/update-spent", (req, res) => {
  const user = getUserFromToken(req);
  const { category, amount, operation } = req.body; // operation: 'add' or 'subtract'

  const budget = budgets.find(
    (b) =>
      b.userId === user.id && b.category === category && b.period === "monthly"
  );

  if (budget) {
    if (operation === "add") {
      budget.spent += parseFloat(amount);
    } else if (operation === "subtract") {
      budget.spent = Math.max(0, budget.spent - parseFloat(amount));
    }

    // Check if budget exceeded
    const exceeded = budget.spent > budget.limit;
    const percentage = (budget.spent / budget.limit) * 100;

    res.json({
      success: true,
      data: {
        budget,
        exceeded,
        percentage: Math.round(percentage),
      },
    });
  } else {
    res.json({
      success: true,
      message: "No budget set for this category",
    });
  }
});

module.exports = router;
