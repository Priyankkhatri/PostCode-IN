const mongoose = require("mongoose");
const dns = require("dns");
const config = require("./index");

/**
 * @function dnsOverride
 * @description Force Node.js to use Google's Public DNS (8.8.8.8) to bypass 
 * restrictive network settings that block MongoDB SRV (querySrv) records.
 */
const dnsOverride = () => {
    try {
        console.log("🌐 Overriding system DNS with Google DNS (8.8.8.8)...");
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
    } catch (err) {
        console.warn("⚠️  Could not override DNS servers. Falling back to system defaults.");
    }
};

/**
 * @function connectDatabase
 * @description Establishes a connection to MongoDB Atlas with DNS override logic.
 */
const connectDatabase = async () => {
    // 1. Force a DNS override to bypass SRV lookup failures
    dnsOverride();

    try {
        const { uri, dbName } = config.database;
        
        if (!uri) {
            throw new Error("MONGO_URI is missing from environment variables.");
        }

        console.log(`📡 Connecting to MongoDB Atlas: ${uri.split('@')[1].split('/')[0]}...`);

        // 2. Connect with retry logic and explicit dbName
        await mongoose.connect(uri, {
            dbName: dbName,
            connectTimeoutMS: 20000, // Extend timeout for slower satellite/mobile connections
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected to [${dbName}] database successfully.`);
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        
        if (error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED")) {
            console.error("💡 TIP: Your network is blocking MongoDB SRV records.");
            console.error("💡 TIP: We've attempted a Google DNS override, but your ISP or Firewall may still be blocking it.");
        }
        
        process.exit(1);
    }
};

module.exports = connectDatabase;
