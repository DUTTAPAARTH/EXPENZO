const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import ONLY demo routes (no MongoDB)
const authRoutes = require("./routes/authDemo");
const expenseRoutes = require("./routes/expensesDemo");
const groupRoutes = require("./routes/groupsDemo");
const insightRoutes = require("./routes/insightsDemo");
const budgetRoutes = require("./routes/budgetsDemo");
const ruleRoutes = require("./routes/rulesDemo");
const splitsRoutes = require("./routes/splitsDemo");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

console.log("💾 Running with in-memory data storage (no database required)");
console.log("⚡ All data will be stored in memory and reset on server restart");

// Use ONLY demo routes (no MongoDB)
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/splits", splitsRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "💸 Welcome to Expenzo API - Track Smart. Spend Bold! 🎯",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      expenses: "/api/expenses",
      groups: "/api/groups",
      insights: "/api/insights",
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "🔍 Route not found",
    suggestion: "Check the API documentation for available endpoints",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "💥 Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Expenzo Backend Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`💾 Storage: In-Memory (Demo Mode)`);
  console.log(`📝 Note: All data will be reset when server restarts`);
});
