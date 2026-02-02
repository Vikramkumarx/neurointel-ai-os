const Video = require("../models/Video");
const { processVideo } = require("../utils/ffmpeg");
const fs = require("fs");
const path = require("path");

// @desc    Upload a video
// @route   POST /api/videos/upload
// @access  Private
const uploadVideo = async (req, res) => {
    try {
        console.log("--- New Upload Request ---");
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);
        console.log("File:", req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        } : "NO FILE");
        console.log("User:", req.user ? req.user._id : "NO USER");

        if (!req.file) {
            console.log("Upload failed: No file found in request object");
            return res.status(400).json({ message: "Please upload a video file" });
        }

        const video = await Video.create({
            title: req.body.title || req.file.originalname,
            description: req.body.description,
            filename: req.file.filename,
            path: req.file.path.replace(/\\/g, "/"),
            uploader: req.user._id,
            status: "processing",
            patientData: {
                age: req.body.age || "UNKNOWN",
                bloodType: req.body.bloodType || "UNKNOWN",
                phase: req.body.phase || "STANDARD_SCAN"
            }
        });

        res.status(201).json(video);

        // Start background processing
        const io = req.app.get("io"); // Get Socket.io instance
        processVideo(video, io)
            .then(async (result) => {
                video.status = result.isSafe ? "processed" : "flagged";
                video.isSafe = result.isSafe;
                video.progress = 100;
                video.analysisResults = result.findings; // Add this to your Model or it will be ignored
                await video.save();

                if (io) {
                    io.emit("videoStatus", {
                        videoId: video._id,
                        status: video.status,
                        isSafe: video.isSafe,
                        findings: result.findings
                    });
                }
            })
            .catch((err) => {
                console.error("Processing Error:", err);
            });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({
            message: "Failed to upload video. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
    try {
        const videos = await Video.find()
            .populate("uploader", "username")
            .sort({ createdAt: -1 }); // Sort by newest first
        res.json(videos);
    } catch (error) {
        console.error("Fetch Videos Error:", error);
        res.status(500).json({ message: "Failed to retrieve videos." });
    }
};

// @desc    Stream video
// @route   GET /api/videos/:id/stream
// @access  Public
const streamVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const videoPath = path.resolve(video.path);

        // Ensure file exists
        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ message: "Video file missing on server" });
        }

        const videoSize = fs.statSync(videoPath).size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

            // Validate range
            if (start >= videoSize) {
                res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + videoSize);
                return;
            }

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4",
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                "Content-Length": videoSize,
                "Content-Type": "video/mp4",
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error) {
        console.error("Stream Error:", error);
        // Do not send JSON if headers already sent
        if (!res.headersSent) {
            res.status(500).json({ message: "Error streaming video content" });
        }
    }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Check user authorization
        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "User not authorized" });
        }

        // Delete file from filesystem
        const videoPath = path.resolve(video.path);
        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
        }

        await video.deleteOne();
        res.json({ message: "Video removed" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Failed to delete video" });
    }
};

module.exports = {
    uploadVideo,
    getVideos,
    streamVideo,
    deleteVideo
};
