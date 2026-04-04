require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

console.log(`📡 Attempting to connect to: ${uri.split('@')[1]?.split('/')[0] || "Unknown Host"}...`);

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected successfully to MongoDB Atlas");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection error:", err.message);
    process.exit(1);
  });
