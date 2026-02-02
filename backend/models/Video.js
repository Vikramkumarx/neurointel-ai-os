const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    filename: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["uploaded", "processing", "processed", "flagged"],
        default: "uploaded",
    },
    isSafe: {
        type: Boolean,
        default: true,
    },
    progress: {
        type: Number,
        default: 0
    },
    analysisResults: {
        confidence: String,
        anomalyScore: String
    },
    patientData: {
        age: String,
        bloodType: String,
        phase: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Video", videoSchema);
