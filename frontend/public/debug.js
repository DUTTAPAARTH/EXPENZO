// Test if we can reach the backend from frontend
console.log("🔧 Testing backend connectivity...");

// Test 1: Simple fetch to backend root
fetch("http://localhost:5000/")
  .then((response) => response.json())
  .then((data) => console.log("✅ Backend root accessible:", data))
  .catch((error) => console.error("❌ Backend root failed:", error));

// Test 2: Login API with explicit URL
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
  .then((response) => {
    console.log("📊 Response status:", response.status);
    return response.json();
  })
  .then((data) => {
    console.log("✅ Direct login test:", data);
  })
  .catch((error) => {
    console.error("❌ Direct login failed:", error);
  });

// Test 3: Check environment variables
console.log("🔧 Environment check:");
console.log("- VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("- DEV mode:", import.meta.env.DEV);
console.log("- All env vars:", import.meta.env);
