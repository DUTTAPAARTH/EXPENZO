// Test our current backend
const http = require("http");

const data = JSON.stringify({
  email: "demo@expenzo.com",
  password: "password123",
});

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

console.log("🔄 Testing login with:", {
  email: "demo@expenzo.com",
  password: "password123",
});

const req = http.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);

  let body = "";
  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    console.log("📦 Response:", body);
    try {
      const parsed = JSON.parse(body);
      if (parsed.success) {
        console.log("🎉 LOGIN SUCCESSFUL!");
        console.log("👤 User:", parsed.data.user.name);
        console.log("🔑 Token received:", parsed.data.token ? "YES" : "NO");
      } else {
        console.log("❌ LOGIN FAILED:", parsed.message);
      }
    } catch (e) {
      console.log("❌ Failed to parse response");
    }
  });
});

req.on("error", (e) => {
  console.error(`❌ Network Error: ${e.message}`);
});

req.write(data);
req.end();
