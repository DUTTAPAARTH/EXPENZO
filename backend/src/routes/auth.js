const express = require("express");
const { body, validationResult } = require("express-validator");
const { protect, generateToken } = require("../middleware/auth");
const { asyncHandler, ErrorResponse } = require("../middleware/error");
const User = require("../models/User");

const router = express.Router();

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
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

    const { name, email, password, avatar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorResponse("📧 User with this email already exists", 400);
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      avatar: avatar || "👤",
    });

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    res.status(201).json({
      success: true,
      message: "🎉 Account created successfully! Welcome to Expenzo!",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          monthlyBudget: user.monthlyBudget,
          currency: user.currency,
          preferences: user.preferences,
        },
        token,
      },
    });
  })
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
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

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      throw new ErrorResponse("🔍 Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new ErrorResponse(
        "🚫 Account is deactivated. Please contact support.",
        401
      );
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ErrorResponse("🔍 Invalid email or password", 401);
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    res.json({
      success: true,
      message: `🎯 Welcome back, ${user.name}! Ready to track some expenses?`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          monthlyBudget: user.monthlyBudget,
          currency: user.currency,
          preferences: user.preferences,
          lastLogin: user.lastLogin,
        },
        token,
      },
    });
  })
);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          monthlyBudget: user.monthlyBudget,
          spendingGoal: user.spendingGoal,
          currency: user.currency,
          preferences: user.preferences,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  })
);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put(
  "/profile",
  protect,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("avatar")
      .optional()
      .isLength({ min: 1, max: 10 })
      .withMessage("Avatar must be 1-10 characters"),
    body("monthlyBudget")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Monthly budget must be a positive number"),
    body("spendingGoal")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Spending goal must be a positive number"),
    body("currency")
      .optional()
      .isIn(["INR", "USD", "EUR", "GBP", "CAD", "AUD"])
      .withMessage("Invalid currency"),
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

    const allowedUpdates = [
      "name",
      "avatar",
      "monthlyBudget",
      "spendingGoal",
      "currency",
      "preferences",
    ];
    const updates = {};

    // Filter only allowed updates
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "✅ Profile updated successfully!",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          monthlyBudget: user.monthlyBudget,
          spendingGoal: user.spendingGoal,
          currency: user.currency,
          preferences: user.preferences,
        },
      },
    });
  })
);

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
router.put(
  "/password",
  protect,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "New password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
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

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ErrorResponse("🔒 Current password is incorrect", 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "🔐 Password updated successfully!",
    });
  })
);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post(
  "/logout",
  protect,
  asyncHandler(async (req, res) => {
    // In a JWT-based system, logout is handled client-side by removing the token
    // But we can log this action
    console.log(
      `User ${req.user.name} (${req.user.email}) logged out at ${new Date()}`
    );

    res.json({
      success: true,
      message: "👋 Logged out successfully! See you later!",
    });
  })
);

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
router.delete(
  "/account",
  protect,
  [
    body("password")
      .notEmpty()
      .withMessage("Password is required to delete account"),
    body("confirmDelete")
      .equals("DELETE")
      .withMessage("Please type DELETE to confirm account deletion"),
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

    const { password } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ErrorResponse("🔒 Password is incorrect", 400);
    }

    // Soft delete - deactivate account instead of hard delete
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`; // Avoid email conflicts
    await user.save();

    res.json({
      success: true,
      message: "🗑️ Account deleted successfully. We're sad to see you go!",
    });
  })
);

module.exports = router;
