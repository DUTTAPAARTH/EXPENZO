// Demo expense routes without MongoDB
const express = require("express");
const router = express.Router();

// In-memory storage
let expenses = [];
let expenseIdCounter = 1;

// Helper to get user from auth header
const getUserFromToken = (req) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  // For demo, always return demo user
  return { id: "demo-user", name: "Demo User", email: "demo@expenzo.com" };
};

// Helper to calculate next recurrence date
const calculateNextDate = (currentDate, period, interval = 1) => {
  const date = new Date(currentDate);

  switch (period) {
    case "daily":
      date.setDate(date.getDate() + interval);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7 * interval);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + interval);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + interval);
      break;
    default:
      date.setMonth(date.getMonth() + 1); // Default to monthly
  }

  return date.toISOString();
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public (demo mode)
router.get("/", (req, res) => {
  const user = getUserFromToken(req);
  const userExpenses = expenses.filter((e) => e.userId === user.id);

  // Apply filters
  let filtered = [...userExpenses];
  const { category, startDate, endDate, sort = "-date" } = req.query;

  if (category) {
    filtered = filtered.filter((e) => e.category === category);
  }

  if (startDate) {
    filtered = filtered.filter((e) => new Date(e.date) >= new Date(startDate));
  }

  if (endDate) {
    filtered = filtered.filter((e) => new Date(e.date) <= new Date(endDate));
  }

  // Sort
  if (sort === "-date") {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort === "date") {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sort === "-amount") {
    filtered.sort((a, b) => b.amount - a.amount);
  } else if (sort === "amount") {
    filtered.sort((a, b) => a.amount - b.amount);
  }

  const totalAmount = filtered.reduce((sum, e) => sum + e.amount, 0);

  res.json({
    success: true,
    data: {
      expenses: filtered,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: filtered.length,
        hasNext: false,
        hasPrev: false,
      },
      summary: {
        totalExpenses: filtered.length,
        totalAmount: totalAmount,
        formattedTotal: `₹${totalAmount.toFixed(2)}`,
        averageExpense: filtered.length > 0 ? totalAmount / filtered.length : 0,
      },
    },
  });
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public (demo mode)
router.get("/:id", (req, res) => {
  const user = getUserFromToken(req);
  const expense = expenses.find(
    (e) => e.id === req.params.id && e.userId === user.id
  );

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: "💸 Expense not found",
    });
  }

  res.json({
    success: true,
    data: { expense },
  });
});

// @desc    Create expense
// @route   POST /api/expenses
// @access  Public (demo mode)
router.post("/", (req, res) => {
  const user = getUserFromToken(req);
  const {
    amount,
    category,
    description,
    date,
    paymentMethod,
    isRecurring,
    recurrence,
  } = req.body;

  if (!amount || !category) {
    return res.status(400).json({
      success: false,
      message: "Amount and category are required",
    });
  }

  const newExpense = {
    id: `exp-${expenseIdCounter++}`,
    userId: user.id,
    amount: parseFloat(amount),
    category,
    description: description || "",
    date: date || new Date().toISOString(),
    paymentMethod: paymentMethod || "Cash",
    isRecurring: isRecurring || false,
    recurrence: isRecurring
      ? {
          period: recurrence?.period || "monthly",
          interval: recurrence?.interval || 1,
          nextDate:
            recurrence?.nextDate ||
            calculateNextDate(
              date || new Date().toISOString(),
              recurrence?.period || "monthly",
              recurrence?.interval || 1
            ),
          endDate: recurrence?.endDate || null,
        }
      : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  expenses.push(newExpense);
  // Debug: print all expenses after adding
  console.log("[DEBUG] Expenses after add:", expenses);

  res.status(201).json({
    success: true,
    message: "💰 Expense created successfully!",
    data: { expense: newExpense },
  });
});

// @desc    Create multiple expenses (bulk import)
// @route   POST /api/expenses/bulk
// @access  Public (demo mode)
router.post("/bulk", (req, res) => {
  const user = getUserFromToken(req);
  const { expenses: expensesData } = req.body;

  if (
    !expensesData ||
    !Array.isArray(expensesData) ||
    expensesData.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of expenses",
    });
  }

  // Validate all expenses
  const errors = [];
  const validExpenses = [];

  expensesData.forEach((expenseData, index) => {
    const { amount, category, description, date, type } = expenseData;

    if (!amount || !category) {
      errors.push({
        index,
        message: "Amount and category are required",
        expense: expenseData,
      });
      return;
    }

    // Skip income transactions if type is 'income'
    if (type === "income") {
      return;
    }

    const newExpense = {
      id: `exp-${expenseIdCounter++}`,
      userId: user.id,
      amount: parseFloat(amount),
      category,
      description: description || "Imported from bank statement",
      date: date || new Date().toISOString(),
      paymentMethod: "Bank Transfer",
      isRecurring: false,
      recurrence: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    validExpenses.push(newExpense);
  });

  // Add all valid expenses to storage
  expenses.push(...validExpenses);

  console.log(
    `[DEBUG] Bulk import: ${validExpenses.length} expenses added, ${errors.length} errors`
  );

  res.status(201).json({
    success: true,
    message: `💰 ${validExpenses.length} expenses imported successfully!`,
    data: {
      imported: validExpenses.length,
      errors: errors.length,
      expenses: validExpenses,
      failedImports: errors,
    },
  });
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Public (demo mode)
router.put("/:id", (req, res) => {
  const user = getUserFromToken(req);
  const expenseIndex = expenses.findIndex(
    (e) => e.id === req.params.id && e.userId === user.id
  );

  if (expenseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "💸 Expense not found",
    });
  }

  const {
    amount,
    category,
    description,
    date,
    paymentMethod,
    isRecurring,
    recurrence,
  } = req.body;

  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    ...(amount && { amount: parseFloat(amount) }),
    ...(category && { category }),
    ...(description !== undefined && { description }),
    ...(date && { date }),
    ...(paymentMethod && { paymentMethod }),
    ...(isRecurring !== undefined && { isRecurring }),
    ...(isRecurring &&
      recurrence && {
        recurrence: {
          period: recurrence.period || "monthly",
          interval: recurrence.interval || 1,
          nextDate:
            recurrence.nextDate ||
            calculateNextDate(
              date || expenses[expenseIndex].date,
              recurrence.period || "monthly",
              recurrence.interval || 1
            ),
          endDate: recurrence.endDate || null,
        },
      }),
    ...(!isRecurring && { recurrence: null }),
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: "✏️ Expense updated successfully!",
    data: { expense: expenses[expenseIndex] },
  });
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public (demo mode)
router.delete("/:id", (req, res) => {
  const user = getUserFromToken(req);
  const expenseIndex = expenses.findIndex(
    (e) => e.id === req.params.id && e.userId === user.id
  );

  if (expenseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "💸 Expense not found",
    });
  }

  expenses.splice(expenseIndex, 1);

  res.json({
    success: true,
    message: "🗑️ Expense deleted successfully!",
  });
});

// @desc    Materialize recurring expenses (create next occurrence)
// @route   POST /api/expenses/materialize-recurring
// @access  Public (demo mode)
router.post("/materialize-recurring", (req, res) => {
  const user = getUserFromToken(req);
  const today = new Date();
  const materialized = [];

  // Find all recurring expenses that need to be materialized
  const recurringExpenses = expenses.filter(
    (e) => e.userId === user.id && e.isRecurring && e.recurrence
  );

  recurringExpenses.forEach((expense) => {
    const nextDate = new Date(expense.recurrence.nextDate);

    // Check if next occurrence is due
    if (nextDate <= today) {
      // Check if endDate has passed
      if (
        expense.recurrence.endDate &&
        new Date(expense.recurrence.endDate) < today
      ) {
        return; // Skip if recurrence has ended
      }

      // Create new expense occurrence
      const newExpense = {
        id: `exp-${expenseIdCounter++}`,
        userId: user.id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.recurrence.nextDate,
        paymentMethod: expense.paymentMethod,
        isRecurring: false, // The materialized expense is not recurring
        recurrence: null,
        parentRecurringId: expense.id, // Link to parent recurring expense
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expenses.push(newExpense);
      materialized.push(newExpense);

      // Update the parent recurring expense's nextDate
      const expenseIndex = expenses.findIndex((e) => e.id === expense.id);
      if (expenseIndex !== -1) {
        expenses[expenseIndex].recurrence.nextDate = calculateNextDate(
          expense.recurrence.nextDate,
          expense.recurrence.period,
          expense.recurrence.interval
        );
        expenses[expenseIndex].updatedAt = new Date().toISOString();
      }
    }
  });

  res.json({
    success: true,
    message: `${materialized.length} recurring expense(s) materialized`,
    data: { expenses: materialized },
  });
});

// @desc    Get expense statistics
// @route   GET /api/expenses/stats/summary
// @access  Public (demo mode)
router.get("/stats/summary", (req, res) => {
  const user = getUserFromToken(req);
  const userExpenses = expenses.filter((e) => e.userId === user.id);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const currentMonthExpenses = userExpenses.filter(
    (e) => new Date(e.date) >= startOfMonth
  );

  const lastMonthExpenses = userExpenses.filter(
    (e) =>
      new Date(e.date) >= startOfLastMonth && new Date(e.date) <= endOfLastMonth
  );

  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const lastMonthTotal = lastMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  // Category breakdown
  const categoryTotals = {};
  currentMonthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const categories = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total,
      count: currentMonthExpenses.filter((e) => e.category === category).length,
      percentage: currentMonthTotal > 0 ? (total / currentMonthTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const trend =
    lastMonthTotal > 0
      ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : 0;

  res.json({
    success: true,
    data: {
      overview: {
        currentMonth: {
          total: currentMonthTotal,
          count: currentMonthExpenses.length,
          average:
            currentMonthExpenses.length > 0
              ? currentMonthTotal / currentMonthExpenses.length
              : 0,
          formatted: `₹${currentMonthTotal.toFixed(2)}`,
        },
        lastMonth: {
          total: lastMonthTotal,
          count: lastMonthExpenses.length,
          formatted: `₹${lastMonthTotal.toFixed(2)}`,
        },
      },
      trends: {
        changeAmount: currentMonthTotal - lastMonthTotal,
        changePercentage: trend,
        changeFormatted: `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`,
        isIncreasing: currentMonthTotal > lastMonthTotal,
      },
      categories: categories,
      budget: {
        limit: 20000,
        spent: currentMonthTotal,
        remaining: 20000 - currentMonthTotal,
        percentage: (currentMonthTotal / 20000) * 100,
      },
    },
  });
});

module.exports = router;
