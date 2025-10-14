const bcrypt = require("bcryptjs");

async function testHash() {
  const password = "password123";

  // Generate hash
  const hash = await bcrypt.hash(password, 12);
  console.log("New hash for password123:", hash);

  // Test existing hash
  const existingHash =
    "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewgfPIvLT1FqBZqK";
  const isMatch = await bcrypt.compare(password, existingHash);
  console.log("Does password123 match existing hash?", isMatch);

  // Test new hash
  const isMatchNew = await bcrypt.compare(password, hash);
  console.log("Does password123 match new hash?", isMatchNew);
}

testHash().catch(console.error);
