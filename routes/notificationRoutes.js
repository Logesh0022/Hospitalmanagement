const express = require("express");
const { getNotifications, createNotification, markRead, markAllRead, deleteNotification } = require("../controllers/notificationController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getNotifications);
router.post("/", protect, authorize("admin"), createNotification);
router.put("/read-all", protect, markAllRead);
router.put("/:id/read", protect, markRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
