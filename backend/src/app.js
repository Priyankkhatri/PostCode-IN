const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error.middleware");
const pincodeRoutes = require("./routes/pincode.routes");

const helmet = require("helmet");

const app = express();

// Security and utility middleware
app.use(helmet());

// CORS configuration
const getOrigins = () => {
    const origins = process.env.FRONTEND_URL 
        ? process.env.FRONTEND_URL.split(",").map(url => url.trim()) 
        : [];
    
    // Always include common local ports for development
    return [...new Set([
        ...origins,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:4173" // Vite preview port
    ])];
};

const allowedOrigins = getOrigins();

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed === "*") return true;
            return origin === allowed || origin.endsWith(allowed.replace(/^https?:\/\//, ""));
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`⚠️ CORS blocked for origin: ${origin}`);
            callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
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
