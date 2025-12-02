// Demo groups routes without MongoDB
const express = require("express");
const router = express.Router();

// In-memory storage
let groups = [];
let groupIdCounter = 1;

// Helper to get user from auth header
const getUserFromToken = (req) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return { id: "demo-user", name: "Demo User", email: "demo@expenzo.com" };
};

// @desc    Get user's groups
// @route   GET /api/groups
// @access  Public (demo mode)
router.get("/", (req, res) => {
  const user = getUserFromToken(req);
  const userGroups = groups.filter(
    (g) => g.ownerId === user.id || g.members.some((m) => m.userId === user.id)
  );

  res.json({
    success: true,
    data: {
      groups: userGroups.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        emoji: g.emoji,
        memberCount: g.members.length,
        totalExpenses: g.expenses.length,
        isOwner: g.ownerId === user.id,
      })),
    },
  });
});

// @desc    Create group
// @route   POST /api/groups
// @access  Public (demo mode)
router.post("/", (req, res) => {
  const user = getUserFromToken(req);
  const { name, description, emoji } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Group name is required",
    });
  }

  const newGroup = {
    id: `grp-${groupIdCounter++}`,
    name,
    description: description || "",
    emoji: emoji || "👥",
    ownerId: user.id,
    members: [
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: "owner",
        joinedAt: new Date().toISOString(),
      },
    ],
    expenses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  groups.push(newGroup);

  res.status(201).json({
    success: true,
    message: "👥 Group created successfully!",
    data: { group: newGroup },
  });
});

// @desc    Get group details
// @route   GET /api/groups/:id
// @access  Public (demo mode)
router.get("/:id", (req, res) => {
  const user = getUserFromToken(req);
  const group = groups.find((g) => g.id === req.params.id);

  if (!group) {
    return res.status(404).json({
      success: false,
      message: "👥 Group not found",
    });
  }

  // Check if user is member
  const isMember =
    group.ownerId === user.id ||
    group.members.some((m) => m.userId === user.id);

  if (!isMember) {
    return res.status(403).json({
      success: false,
      message: "🚫 Access denied",
    });
  }

  res.json({
    success: true,
    data: { group },
  });
});

// @desc    Add member to group
// @route   POST /api/groups/:id/members
// @access  Public (demo mode)
router.post("/:id/members", (req, res) => {
  const user = getUserFromToken(req);
  const group = groups.find((g) => g.id === req.params.id);

  if (!group) {
    return res.status(404).json({
      success: false,
      message: "👥 Group not found",
    });
  }

  if (group.ownerId !== user.id) {
    return res.status(403).json({
      success: false,
      message: "🚫 Only group owner can add members",
    });
  }

  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Check if already member
  if (group.members.some((m) => m.email === email)) {
    return res.status(400).json({
      success: false,
      message: "User is already a member",
    });
  }

  const newMember = {
    userId: `user-${Date.now()}`,
    name: name || email,
    email,
    role: "member",
    joinedAt: new Date().toISOString(),
  };

  group.members.push(newMember);
  group.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "✅ Member added successfully!",
    data: { member: newMember },
  });
});

// @desc    Add group expense
// @route   POST /api/groups/:id/expenses
// @access  Public (demo mode)
router.post("/:id/expenses", (req, res) => {
  const user = getUserFromToken(req);
  const group = groups.find((g) => g.id === req.params.id);

  if (!group) {
    return res.status(404).json({
      success: false,
      message: "👥 Group not found",
    });
  }

  const { amount, category, description, date, splitType } = req.body;

  if (!amount || !category) {
    return res.status(400).json({
      success: false,
      message: "Amount and category are required",
    });
  }

  const splitAmount = amount / group.members.length;

  const newExpense = {
    id: `exp-${Date.now()}`,
    amount: parseFloat(amount),
    category,
    description: description || "",
    date: date || new Date().toISOString(),
    paidBy: user.id,
    splitType: splitType || "equal",
    splitAmount: splitAmount,
    members: group.members.map((m) => ({
      userId: m.userId,
      name: m.name,
      amount: splitAmount,
      paid: m.userId === user.id,
    })),
    createdAt: new Date().toISOString(),
  };

  group.expenses.push(newExpense);
  group.updatedAt = new Date().toISOString();

  res.status(201).json({
    success: true,
    message: "💰 Group expense added successfully!",
    data: { expense: newExpense },
  });
});

// @desc    Get group settlements
// @route   GET /api/groups/:id/settlements
// @access  Public (demo mode)
router.get("/:id/settlements", (req, res) => {
  const user = getUserFromToken(req);
  const group = groups.find((g) => g.id === req.params.id);

  if (!group) {
    return res.status(404).json({
      success: false,
      message: "👥 Group not found",
    });
  }

  // Calculate settlements
  const balances = {};

  group.members.forEach((m) => {
    balances[m.userId] = 0;
  });

  group.expenses.forEach((expense) => {
    expense.members.forEach((member) => {
      if (member.userId === expense.paidBy) {
        balances[member.userId] += expense.amount - member.amount;
      } else {
        balances[member.userId] -= member.amount;
      }
    });
  });

  const settlements = [];
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([userId, balance]) => {
    const member = group.members.find((m) => m.userId === userId);
    if (balance > 0) {
      creditors.push({ userId, name: member.name, amount: balance });
    } else if (balance < 0) {
      debtors.push({ userId, name: member.name, amount: Math.abs(balance) });
    }
  });

  // Calculate settlements
  let i = 0,
    j = 0;
  while (i < creditors.length && j < debtors.length) {
    const minAmount = Math.min(creditors[i].amount, debtors[j].amount);

    settlements.push({
      from: debtors[j].name,
      to: creditors[i].name,
      amount: minAmount,
      formatted: `₹${minAmount.toFixed(2)}`,
    });

    creditors[i].amount -= minAmount;
    debtors[j].amount -= minAmount;

    if (creditors[i].amount === 0) i++;
    if (debtors[j].amount === 0) j++;
  }

  res.json({
    success: true,
    data: {
      settlements,
      balances: Object.entries(balances).map(([userId, balance]) => {
        const member = group.members.find((m) => m.userId === userId);
        return {
          userId,
          name: member.name,
          balance,
          formatted: `₹${balance.toFixed(2)}`,
        };
      }),
    },
  });
});

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Public (demo mode)
router.delete("/:id", (req, res) => {
  const user = getUserFromToken(req);
  const groupIndex = groups.findIndex((g) => g.id === req.params.id);

  if (groupIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "👥 Group not found",
    });
  }

  if (groups[groupIndex].ownerId !== user.id) {
    return res.status(403).json({
      success: false,
      message: "🚫 Only group owner can delete the group",
    });
  }

  groups.splice(groupIndex, 1);

  res.json({
    success: true,
    message: "🗑️ Group deleted successfully!",
  });
});

module.exports = router;
