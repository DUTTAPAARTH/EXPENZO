// Demo authentication routes for testing without MongoDB
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Demo users for testing (using plaintext for simplicity)
const demoUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // plaintext for demo
    avatar: "👨‍💻",
    isActive: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123", // plaintext for demo
    avatar: "👩‍💼",
    isActive: true,
  },
  {
    id: "3",
    name: "Demo User",
    email: "demo@expenzo.com",
    password: "password123", // plaintext for demo
    avatar: "🚀",
    isActive: true,
  },
];

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "demo_secret", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Demo Login
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🎭 Demo Login Attempt:", { email, password: "***" });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = demoUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    console.log(
      "🔍 User found:",
      user ? `${user.name} (${user.email})` : "No user found"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password (simple comparison for demo)
    const isMatch = password === user.password;
    console.log("🔐 Input password:", password);
    console.log("🔐 Stored password:", user.password);
    console.log("🔐 Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user.id);
    console.log("✅ Login successful for:", user.email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// @desc    Demo Register
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    // Check if user already exists
    const existingUser = demoUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user (plaintext password for demo)
    const newUser = {
      id: String(demoUsers.length + 1),
      name,
      email: email.toLowerCase(),
      password: password, // plaintext for demo
      avatar: avatar || "👤",
      isActive: true,
    };

    // Add to demo users array
    demoUsers.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "demo_secret");
    const user = demoUsers.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = router;
