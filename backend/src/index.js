const app = require("./app");
const connectDatabase = require("./config/database");
const config = require("./config/index");
const Pincode = require("./models/Pincode");

const port = config.port;

const startServer = async () => {
    try {
        console.log("🕒 Warming up...");
        
        // First, connect to the database
        await connectDatabase();

        // Log the document count to verify data exists
        const count = await Pincode.countDocuments();
        console.log(`📊 Found ${count} records in collection: ${config.database.collectionName}`);

        // Then, start the server
        const server = app.listen(port, () => {
            console.log("-----------------------------------------");
            console.log(`🚀 API Status: ONLINE`);
            console.log(`📡 Mode:       ${config.env.toUpperCase()}`);
            console.log(`🔌 Port:       ${port}`);
            console.log(`📁 DB:         ${config.database.dbName}`);
            console.log(`📍 Collection: ${config.database.collectionName}`);
            console.log("-----------------------------------------");
        });

        // Handle unhandled promise rejections
        process.on("unhandledRejection", (err) => {
            console.log(`❌ Error: ${err.message}`);
            // Close server & exit process
            server.close(() => process.exit(1));
        });

    } catch (error) {
        console.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
