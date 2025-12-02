// Demo authentication routes without MongoDB
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// In-memory users storage
let users = [
  {
    id: "demo-user",
    name: "Demo User",
    email: "demo@expenzo.com",
    password: "$2a$10$2hMXtnuxSrsUGHGQX2VQ/ekeiRZot7cr6SK3j9idrpP7eshCmuMrq", // hashed "password123"
    avatar: "😎",
    createdAt: new Date().toISOString(),
  },
];
let userIdCounter = 2;

const JWT_SECRET = process.env.JWT_SECRET || "expenzo-demo-secret-key-2024";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: `user-${userIdCounter++}`,
      name,
      email,
      password: hashedPassword,
      avatar: avatar || "😊",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "🎉 Account created successfully!",
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
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "🎉 Login successful!",
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
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
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
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put("/profile", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userIndex = users.findIndex((u) => u.id === decoded.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, avatar, currentPassword, newPassword } = req.body;

    // Update name and avatar
    if (name) users[userIndex].name = name;
    if (avatar) users[userIndex].avatar = avatar;

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(
        currentPassword,
        users[userIndex].password
      );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      const salt = await bcrypt.genSalt(10);
      users[userIndex].password = await bcrypt.hash(newPassword, salt);
    }

    res.json({
      success: true,
      message: "✅ Profile updated successfully!",
      data: {
        user: {
          id: users[userIndex].id,
          name: users[userIndex].name,
          email: users[userIndex].email,
          avatar: users[userIndex].avatar,
        },
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating profile",
    });
  }
});

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
router.delete("/account", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userIndex = users.findIndex((u) => u.id === decoded.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { password } = req.body;

    // Verify password before deletion
    const isMatch = await bcrypt.compare(password, users[userIndex].password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    users.splice(userIndex, 1);

    res.json({
      success: true,
      message: "👋 Account deleted successfully",
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting account",
    });
  }
});

module.exports = router;
