const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authDemo");
const expenseRoutes = require("./routes/expenses");
const groupRoutes = require("./routes/groups");
const insightRoutes = require("./routes/insights");

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
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/expenzo")
  .then(() => console.log("🎯 MongoDB Connected - Expenzo Database Ready!"))
  .catch((err) => {
    console.warn(
      "⚠️  MongoDB connection failed - Running in demo mode:",
      err.message
    );
    console.log(
      "💡 For full functionality, please set up MongoDB Atlas or local MongoDB"
    );
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/insights", insightRoutes);

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
  console.log(
    `💾 Database: ${
      process.env.MONGODB_URI ? "MongoDB Atlas" : "Local MongoDB"
    }`
  );
});
