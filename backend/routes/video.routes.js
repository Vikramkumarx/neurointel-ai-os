const express = require("express");
const router = express.Router();
const {
    uploadVideo,
    getVideos,
    streamVideo,
    deleteVideo
} = require("../controllers/video.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/upload", protect, upload.single("video"), uploadVideo);
router.get("/", getVideos);
router.get("/:id/stream", streamVideo);
router.delete("/:id", protect, deleteVideo);

module.exports = router;
