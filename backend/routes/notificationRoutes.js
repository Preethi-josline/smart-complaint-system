const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAllRead,
  getUnreadCount
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/mark-read", protect, markAllRead);

module.exports = router;
