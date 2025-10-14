const express = require("express");
const { body, query, validationResult } = require("express-validator");
const { protect } = require("../middleware/auth");
const { asyncHandler, ErrorResponse } = require("../middleware/error");
const Expense = require("../models/Expense");
const User = require("../models/User");

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("category").optional().trim(),
    query("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    query("endDate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid date"),
    query("paymentMethod").optional().trim(),
    query("minAmount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Min amount must be positive"),
    query("maxAmount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Max amount must be positive"),
  ],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "❌ Validation failed",
        errors: errors.array(),
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      startDate,
      endDate,
      paymentMethod,
      minAmount,
      maxAmount,
      sort = "-date",
    } = req.query;

    // Build filter object
    const filter = {
      user: req.user._id,
      isDeleted: false,
    };

    if (category) filter.category = category;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get expenses with pagination
    const expenses = await Expense.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("group", "name emoji");

    // Get total count for pagination
    const total = await Expense.countDocuments(filter);

    // Calculate totals
    const totalAmount = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalSpent = totalAmount.length > 0 ? totalAmount[0].total : 0;

    res.json({
      success: true,
      data: {
        expenses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
        summary: {
          totalExpenses: total,
          totalAmount: totalSpent,
          formattedTotal: `₹${totalSpent.toFixed(2)}`,
          averageExpense: total > 0 ? totalSpent / total : 0,
        },
      },
    });
  })
);

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false,
    })
      .populate("group", "name emoji members")
      .populate("splitDetails.participants.user", "name avatar");

    if (!expense) {
      throw new ErrorResponse("💸 Expense not found", 404);
    }

    res.json({
      success: true,
      data: { expense },
    });
  })
);

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
router.post(
  "/",
  [
    body("amount")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be greater than 0"),
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .isIn([
        "Food & Dining",
        "Transportation",
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Healthcare",
        "Education",
        "Travel",
        "Groceries",
        "Fuel",
        "Coffee & Tea",
        "Online Services",
        "Gifts & Donations",
        "Fitness",
        "Beauty & Personal Care",
        "Home & Garden",
        "Insurance",
        "Investments",
        "Other",
      ])
      .withMessage("Invalid category"),
    body("paymentMethod")
      .notEmpty()
      .withMessage("Payment method is required")
      .isIn([
        "Cash",
        "Credit Card",
        "Debit Card",
        "UPI",
        "Net Banking",
        "Wallet",
        "Other",
      ])
      .withMessage("Invalid payment method"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Description must be less than 200 characters"),
    body("date")
      .optional()
      .isISO8601()
      .withMessage("Date must be a valid date"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("location.name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Location name must be less than 100 characters"),
  ],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "❌ Validation failed",
        errors: errors.array(),
      });
    }

    const expenseData = {
      ...req.body,
      user: req.user._id,
      date: req.body.date ? new Date(req.body.date) : new Date(),
    };

    // Create expense
    const expense = await Expense.create(expenseData);

    // Populate the created expense
    await expense.populate("user", "name avatar");

    res.status(201).json({
      success: true,
      message: "💰 Expense added successfully!",
      data: { expense },
    });
  })
);

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
router.put(
  "/:id",
  [
    body("amount")
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be greater than 0"),
    body("category")
      .optional()
      .isIn([
        "Food & Dining",
        "Transportation",
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Healthcare",
        "Education",
        "Travel",
        "Groceries",
        "Fuel",
        "Coffee & Tea",
        "Online Services",
        "Gifts & Donations",
        "Fitness",
        "Beauty & Personal Care",
        "Home & Garden",
        "Insurance",
        "Investments",
        "Other",
      ])
      .withMessage("Invalid category"),
    body("paymentMethod")
      .optional()
      .isIn([
        "Cash",
        "Credit Card",
        "Debit Card",
        "UPI",
        "Net Banking",
        "Wallet",
        "Other",
      ])
      .withMessage("Invalid payment method"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Description must be less than 200 characters"),
    body("date")
      .optional()
      .isISO8601()
      .withMessage("Date must be a valid date"),
  ],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "❌ Validation failed",
        errors: errors.array(),
      });
    }

    // Find expense
    let expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false,
    });

    if (!expense) {
      throw new ErrorResponse("💸 Expense not found", 404);
    }

    // Update expense
    const allowedUpdates = [
      "amount",
      "category",
      "subcategory",
      "description",
      "paymentMethod",
      "tags",
      "location",
      "date",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("user", "name avatar");

    res.json({
      success: true,
      message: "✏️ Expense updated successfully!",
      data: { expense },
    });
  })
);

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false,
    });

    if (!expense) {
      throw new ErrorResponse("💸 Expense not found", 404);
    }

    // Soft delete
    expense.isDeleted = true;
    await expense.save();

    res.json({
      success: true,
      message: "🗑️ Expense deleted successfully!",
    });
  })
);

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
router.get(
  "/stats/summary",
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Get current month expenses
    const currentMonthExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfMonth },
      isDeleted: false,
    });

    // Get last month expenses
    const lastMonthExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      isDeleted: false,
    });

    // Get this week expenses
    const thisWeekExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfWeek },
      isDeleted: false,
    });

    // Calculate totals
    const currentMonthTotal = currentMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const lastMonthTotal = lastMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const thisWeekTotal = thisWeekExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Get category breakdown for current month
    const categoryStats = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          avgAmount: { $avg: "$amount" },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    // Get daily expenses for current month
    const dailyStats = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date" },
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.day": 1 },
      },
    ]);

    // Get user's budget
    const user = await User.findById(userId);
    const monthlyBudget = user.monthlyBudget || 0;
    const budgetUsed =
      monthlyBudget > 0 ? (currentMonthTotal / monthlyBudget) * 100 : 0;

    // Calculate trends
    const monthlyTrend =
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
          thisWeek: {
            total: thisWeekTotal,
            count: thisWeekExpenses.length,
            formatted: `₹${thisWeekTotal.toFixed(2)}`,
          },
        },
        budget: {
          monthly: monthlyBudget,
          used: currentMonthTotal,
          remaining: Math.max(0, monthlyBudget - currentMonthTotal),
          percentage: budgetUsed,
          isOverBudget: budgetUsed > 100,
          formatted: {
            budget: `₹${monthlyBudget.toFixed(2)}`,
            used: `₹${currentMonthTotal.toFixed(2)}`,
            remaining: `₹${Math.max(
              0,
              monthlyBudget - currentMonthTotal
            ).toFixed(2)}`,
          },
        },
        trends: {
          monthlyChange: monthlyTrend,
          isIncreasing: monthlyTrend > 0,
          changeFormatted: `${
            monthlyTrend > 0 ? "+" : ""
          }${monthlyTrend.toFixed(1)}%`,
        },
        categories: categoryStats.map((cat) => ({
          ...cat,
          percentage:
            currentMonthTotal > 0 ? (cat.total / currentMonthTotal) * 100 : 0,
          formatted: `₹${cat.total.toFixed(2)}`,
        })),
        daily: dailyStats,
      },
    });
  })
);

module.exports = router;
