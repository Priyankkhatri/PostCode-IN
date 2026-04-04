require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS to bypass potential network SRV blocks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is not defined");
  process.exit(1);
}

console.log(`📡 Connecting with DNS override: ${uri.split('@')[1]?.split('/')[0]}...`);

mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB Atlas with new credentials.");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  });
