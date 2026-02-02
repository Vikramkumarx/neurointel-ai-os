const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

const mongoose = require("mongoose");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get(/(.*)/, (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
}

// Request Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/videos", require("./routes/video.routes"));

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("Backend Service Running"));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Backend Error:", err);

    // Handle Multer Errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            message: "File too large. Maximum limit is 100MB."
        });
    }

    if (err.name === 'MulterError') {
        return res.status(400).json({
            message: `Upload error: ${err.message}`
        });
    }

    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = app;