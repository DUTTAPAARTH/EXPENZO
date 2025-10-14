// Quick test to verify authentication directly
const express = require("express");
const app = express();

app.use(express.json());

// Simple demo login endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  console.log("📧 Email received:", email);
  console.log("🔐 Password received:", password);

  if (email === "demo@expenzo.com" && password === "password123") {
    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: "3",
          name: "Demo User",
          email: "demo@expenzo.com",
          avatar: "🚀",
        },
        token: "demo-token-123",
      },
    });
  } else {
    console.log("❌ Invalid credentials");
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
});

app.listen(5001, () => {
  console.log("🔧 Test server running on port 5001");
});
