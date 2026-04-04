require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  database: {
    uri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME || "Pincode",
    collectionName: process.env.COLLECTION_NAME || "Pincode",
  },
};

module.exports = config;
