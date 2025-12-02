// Demo rules routes without MongoDB
const express = require("express");
const router = express.Router();

// In-memory storage
let rules = [];
let ruleIdCounter = 1;

// Helper to get user from auth header
const getUserFromToken = (req) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return { id: "demo-user", name: "Demo User", email: "demo@expenzo.com" };
};

// Helper to test if a rule matches an expense
const testRule = (rule, expense) => {
  const { field, operator, value } = rule.condition;
  const expenseValue = expense[field] || "";

  switch (operator) {
    case "contains":
      return expenseValue.toLowerCase().includes(value.toLowerCase());
    case "equals":
      return expenseValue.toLowerCase() === value.toLowerCase();
    case "starts_with":
      return expenseValue.toLowerCase().startsWith(value.toLowerCase());
    case "ends_with":
      return expenseValue.toLowerCase().endsWith(value.toLowerCase());
    case "regex":
      try {
        const regex = new RegExp(value, "i");
        return regex.test(expenseValue);
      } catch (e) {
        return false;
      }
    case "greater_than":
      return parseFloat(expenseValue) > parseFloat(value);
    case "less_than":
      return parseFloat(expenseValue) < parseFloat(value);
    default:
      return false;
  }
};

// @desc    Get all rules
// @route   GET /api/rules
// @access  Public (demo mode)
router.get("/", (req, res) => {
  const user = getUserFromToken(req);
  const userRules = rules.filter((r) => r.userId === user.id);

  res.json({
    success: true,
    data: { rules: userRules },
  });
});

// @desc    Create rule
// @route   POST /api/rules
// @access  Public (demo mode)
router.post("/", (req, res) => {
  const user = getUserFromToken(req);
  const { name, condition, action, isActive } = req.body;

  if (!name || !condition || !action) {
    return res.status(400).json({
      success: false,
      message: "Name, condition, and action are required",
    });
  }

  const newRule = {
    id: `rule-${ruleIdCounter++}`,
    userId: user.id,
    name,
    condition: {
      field: condition.field || "description",
      operator: condition.operator || "contains",
      value: condition.value || "",
    },
    action: {
      type: action.type || "set_category",
      value: action.value || "",
    },
    isActive: isActive !== undefined ? isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  rules.push(newRule);

  res.status(201).json({
    success: true,
    message: "✨ Rule created successfully!",
    data: { rule: newRule },
  });
});

// @desc    Update rule
// @route   PUT /api/rules/:id
// @access  Public (demo mode)
router.put("/:id", (req, res) => {
  const user = getUserFromToken(req);
  const ruleIndex = rules.findIndex(
    (r) => r.id === req.params.id && r.userId === user.id
  );

  if (ruleIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Rule not found",
    });
  }

  const { name, condition, action, isActive } = req.body;

  rules[ruleIndex] = {
    ...rules[ruleIndex],
    ...(name && { name }),
    ...(condition && { condition }),
    ...(action && { action }),
    ...(isActive !== undefined && { isActive }),
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: "✏️ Rule updated successfully!",
    data: { rule: rules[ruleIndex] },
  });
});

// @desc    Delete rule
// @route   DELETE /api/rules/:id
// @access  Public (demo mode)
router.delete("/:id", (req, res) => {
  const user = getUserFromToken(req);
  const ruleIndex = rules.findIndex(
    (r) => r.id === req.params.id && r.userId === user.id
  );

  if (ruleIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Rule not found",
    });
  }

  rules.splice(ruleIndex, 1);

  res.json({
    success: true,
    message: "🗑️ Rule deleted successfully!",
  });
});

// @desc    Apply rules to an expense (returns suggested category/tags)
// @route   POST /api/rules/apply
// @access  Public (demo mode)
router.post("/apply", (req, res) => {
  const user = getUserFromToken(req);
  const { expense } = req.body;

  if (!expense) {
    return res.status(400).json({
      success: false,
      message: "Expense data is required",
    });
  }

  const userRules = rules.filter((r) => r.userId === user.id && r.isActive);

  const matchedRules = [];
  let suggestedCategory = null;
  const suggestedTags = [];

  for (const rule of userRules) {
    if (testRule(rule, expense)) {
      matchedRules.push(rule);

      // Apply action
      if (rule.action.type === "set_category") {
        suggestedCategory = rule.action.value;
      } else if (rule.action.type === "add_tag") {
        suggestedTags.push(rule.action.value);
      }
    }
  }

  res.json({
    success: true,
    data: {
      matchedRules,
      suggestions: {
        category: suggestedCategory,
        tags: suggestedTags,
      },
    },
  });
});

// @desc    Test a rule against sample text
// @route   POST /api/rules/test
// @access  Public (demo mode)
router.post("/test", (req, res) => {
  const { condition, testValue } = req.body;

  if (!condition || !testValue) {
    return res.status(400).json({
      success: false,
      message: "Condition and test value are required",
    });
  }

  const mockExpense = {
    description: testValue,
    amount: testValue,
    category: testValue,
  };

  const matches = testRule({ condition }, mockExpense);

  res.json({
    success: true,
    data: { matches },
  });
});

module.exports = router;
