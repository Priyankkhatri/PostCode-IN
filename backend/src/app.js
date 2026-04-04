const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error.middleware");
const pincodeRoutes = require("./routes/pincode.routes");

const app = express();

// Set up security/utility middleware
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));
app.use(express.json());

// API Routes
// Note: pincode.routes.js already defines paths like /states, /stats, /search, etc.
// So we mount it at /api directly to match the frontend expectations.
app.use("/api", pincodeRoutes);

// Root/Health route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Indian Pincode API is online 🚀",
        version: "2.0.0"
    });
});

// Advanced Error handling middleware
app.use(errorHandler);

module.exports = app;
