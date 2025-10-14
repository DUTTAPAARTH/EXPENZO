// Quick frontend-backend connectivity test
fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "demo@expenzo.com",
    password: "password123",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("✅ Direct fetch test successful:", data);
  })
  .catch((error) => {
    console.error("❌ Direct fetch test failed:", error);
  });

// Test with API wrapper
import { authAPI } from "./src/utils/api.js";

authAPI
  .login({
    email: "demo@expenzo.com",
    password: "password123",
  })
  .then((response) => {
    console.log("✅ API wrapper test successful:", response.data);
  })
  .catch((error) => {
    console.error("❌ API wrapper test failed:", error);
  });
