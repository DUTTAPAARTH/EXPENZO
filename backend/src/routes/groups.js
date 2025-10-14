const express = require("express");
const { body, validationResult } = require("express-validator");
const { protect } = require("../middleware/auth");
const { asyncHandler, ErrorResponse } = require("../middleware/error");
const Group = require("../models/Group");
const Expense = require("../models/Expense");
const User = require("../models/User");

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get user's groups
// @route   GET /api/groups
// @access  Private
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const groups = await Group.getUserGroups(req.user._id);

    res.json({
      success: true,
      data: {
        groups: groups.map((group) => ({
          id: group._id,
          name: group.name,
          description: group.description,
          emoji: group.emoji,
          memberCount: group.memberCount,
          totalExpenses: group.totalExpenses,
          formattedTotal: group.formattedTotal,
          isOwner: group.owner._id.toString() === req.user._id.toString(),
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
        })),
      },
    });
  })
);

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Private
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id)
      .populate("owner", "name avatar email")
      .populate("members.user", "name avatar email")
      .populate({
        path: "expenses",
        match: { isDeleted: false },
        options: { sort: { date: -1 }, limit: 10 },
      });

    if (!group) {
      throw new ErrorResponse("👥 Group not found", 404);
    }

    // Check if user is member
    const isMember = group.members.some(
      (member) =>
        member.user._id.toString() === req.user._id.toString() &&
        member.isActive
    );

    if (!isMember && group.owner._id.toString() !== req.user._id.toString()) {
      throw new ErrorResponse(
        "🚫 Access denied. You are not a member of this group.",
        403
      );
    }

    res.json({
      success: true,
      data: { group },
    });
  })
);

// @desc    Create new group
// @route   POST /api/groups
// @access  Private
router.post(
  "/",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Group name must be between 2 and 50 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Description must be less than 200 characters"),
    body("emoji")
      .optional()
      .isLength({ min: 1, max: 10 })
      .withMessage("Emoji must be 1-10 characters"),
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

    const { name, description, emoji = "👥" } = req.body;

    const group = await Group.create({
      name: name.trim(),
      description: description?.trim(),
      emoji,
      owner: req.user._id,
    });

    // Populate the created group
    await group.populate("owner", "name avatar email");

    res.status(201).json({
      success: true,
      message: "👥 Group created successfully!",
      data: { group },
    });
  })
);

// @desc    Update group
// @route   PUT /api/groups/:id
// @access  Private
router.put(
  "/:id",
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Group name must be between 2 and 50 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Description must be less than 200 characters"),
    body("emoji")
      .optional()
      .isLength({ min: 1, max: 10 })
      .withMessage("Emoji must be 1-10 characters"),
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

    const group = await Group.findById(req.params.id);

    if (!group) {
      throw new ErrorResponse("👥 Group not found", 404);
    }

    // Only owner can update group
    if (group.owner.toString() !== req.user._id.toString()) {
      throw new ErrorResponse(
        "🚫 Only group owner can update group details",
        403
      );
    }

    const allowedUpdates = ["name", "description", "emoji", "settings"];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedGroup = await Group.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("owner", "name avatar email");

    res.json({
      success: true,
      message: "✏️ Group updated successfully!",
      data: { group: updatedGroup },
    });
  })
);

// @desc    Add member to group
// @route   POST /api/groups/:id/members
// @access  Private
router.post(
  "/:id/members",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("role")
      .optional()
      .isIn(["admin", "member"])
      .withMessage("Role must be admin or member"),
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

    const { email, role = "member" } = req.body;

    const group = await Group.findById(req.params.id);

    if (!group) {
      throw new ErrorResponse("👥 Group not found", 404);
    }

    // Only owner and admins can add members
    const currentMember = group.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    const isOwner = group.owner.toString() === req.user._id.toString();
    const isAdmin = currentMember?.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ErrorResponse(
        "🚫 Only group owner and admins can add members",
        403
      );
    }

    // Find user by email
    const userToAdd = await User.findOne({ email: email.toLowerCase() });

    if (!userToAdd) {
      throw new ErrorResponse("🔍 User with this email not found", 404);
    }

    // Add member to group
    await group.addMember(userToAdd._id, userToAdd.name, userToAdd.email, role);

    // Populate the updated group
    await group.populate("members.user", "name avatar email");

    res.json({
      success: true,
      message: `✅ ${userToAdd.name} added to group successfully!`,
      data: { group },
    });
  })
);

// @desc    Remove member from group
// @route   DELETE /api/groups/:id/members/:userId
// @access  Private
router.delete(
  "/:id/members/:userId",
  asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
      throw new ErrorResponse("👥 Group not found", 404);
    }

    // Only owner and admins can remove members, or users can remove themselves
    const currentMember = group.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    const isOwner = group.owner.toString() === req.user._id.toString();
    const isAdmin = currentMember?.role === "admin";
    const isSelf = req.params.userId === req.user._id.toString();

    if (!isOwner && !isAdmin && !isSelf) {
      throw new ErrorResponse(
        "🚫 Insufficient permissions to remove member",
        403
      );
    }

    // Can't remove owner
    if (req.params.userId === group.owner.toString()) {
      throw new ErrorResponse("🚫 Cannot remove group owner", 400);
    }

    // Remove member
    await group.removeMember(req.params.userId);

    res.json({
      success: true,
      message: "👋 Member removed from group successfully!",
    });
  })
);

// @desc    Add expense to group
// @route   POST /api/groups/:id/expenses
// @access  Private
router.post(
  "/:id/expenses",
  [
    body("amount")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be greater than 0"),
    body("category").notEmpty().withMessage("Category is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required for group expenses"),
    body("splitType")
      .optional()
      .isIn(["equal", "custom", "percentage"])
      .withMessage("Invalid split type"),
    body("participants")
      .optional()
      .isArray()
      .withMessage("Participants must be an array"),
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

    const group = await Group.findById(req.params.id).populate(
      "members.user",
      "name avatar"
    );

    if (!group) {
      throw new ErrorResponse("👥 Group not found", 404);
    }

    // Check if user is member
    const isMember = group.members.some(
      (member) =>
        member.user._id.toString() === req.user._id.toString() &&
        member.isActive
    );

    if (!isMember) {
      throw new ErrorResponse(
        "🚫 You must be a group member to add expenses",
        403
      );
    }

    const {
      amount,
      category,
      description,
      paymentMethod = "UPI",
      splitType = "equal",
      participants,
    } = req.body;

    // Prepare split details
    const activeMembers = group.members.filter((member) => member.isActive);
    let splitDetails = {
      totalParticipants: activeMembers.length,
      splitType,
      participants: [],
    };

    if (splitType === "equal") {
      const amountPerPerson = amount / activeMembers.length;
      splitDetails.participants = activeMembers.map((member) => ({
        user: member.user._id,
        amount: amountPerPerson,
        paid: member.user._id.toString() === req.user._id.toString(),
      }));
    } else if (splitType === "custom" && participants) {
      splitDetails.participants = participants.map((p) => ({
        user: p.userId,
        amount: p.amount,
        paid: p.userId === req.user._id.toString(),
      }));
    }

    // Create expense
    const expense = await Expense.create({
      amount,
      category,
      description,
      paymentMethod,
      user: req.user._id,
      group: group._id,
      splitDetails,
      date: new Date(),
    });

    // Update group's total expenses
    group.totalExpenses += amount;
    group.expenses.push(expense._id);
    await group.save();

    // Populate the created expense
    await expense.populate("user", "name avatar");
    await expense.populate("splitDetails.participants.user", "name avatar");

    res.status(201).json({
      success: true,
      message: "💰 Group expense added successfully!",
      data: { expense },
    });
  })
);

// @desc    Get group settlements
// @route   GET /api/groups/:id/settlements
// @access  Private
router.get(
  "/:id/settlements",
  asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
      throw new ErrorResponse("👥 Group not found", 404);
    }

    // Check if user is member
    const isMember = group.members.some(
      (member) =>
        member.user._id.toString() === req.user._id.toString() &&
        member.isActive
    );

    if (!isMember) {
      throw new ErrorResponse(
        "🚫 You must be a group member to view settlements",
        403
      );
    }

    const settlements = await group.calculateSettlements();

    // Calculate who owes whom
    const creditors = settlements
      .filter((s) => s.balance > 0)
      .sort((a, b) => b.balance - a.balance);
    const debtors = settlements
      .filter((s) => s.balance < 0)
      .sort((a, b) => a.balance - b.balance);

    const suggestions = [];
    let i = 0,
      j = 0;

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];

      const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

      if (amount > 0.01) {
        // Avoid tiny amounts
        suggestions.push({
          from: debtor.name,
          fromAvatar: debtor.userInfo?.avatar || "👤",
          to: creditor.name,
          toAvatar: creditor.userInfo?.avatar || "👤",
          amount,
          formatted: `₹${amount.toFixed(2)}`,
        });
      }

      creditor.balance -= amount;
      debtor.balance += amount;

      if (creditor.balance < 0.01) i++;
      if (debtor.balance > -0.01) j++;
    }

    res.json({
      success: true,
      data: {
        settlements,
        suggestions,
        summary: {
          totalOwed: settlements.reduce(
            (sum, s) => sum + Math.abs(Math.min(0, s.balance)),
            0
          ),
          totalOwing: settlements.reduce(
            (sum, s) => sum + Math.max(0, s.balance),
            0
          ),
          isSettled: suggestions.length === 0,
        },
      },
    });
  })
);

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
      throw new ErrorResponse("👥 Group not found", 404);
    }

    // Only owner can delete group
    if (group.owner.toString() !== req.user._id.toString()) {
      throw new ErrorResponse("🚫 Only group owner can delete the group", 403);
    }

    // Check if group has unsettled expenses
    const unsettledExpenses = await Expense.countDocuments({
      group: group._id,
      "splitDetails.participants.paid": false,
      isDeleted: false,
    });

    if (unsettledExpenses > 0) {
      throw new ErrorResponse(
        "⚠️ Cannot delete group with unsettled expenses. Please settle all expenses first.",
        400
      );
    }

    // Soft delete
    group.isActive = false;
    await group.save();

    res.json({
      success: true,
      message: "🗑️ Group deleted successfully!",
    });
  })
);

module.exports = router;
