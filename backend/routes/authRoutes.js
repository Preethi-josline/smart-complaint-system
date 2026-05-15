const express = require("express");
const router = express.Router();
const { register, login, getProfile, getStaff } = require("../controllers/authController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.get("/staff", protect, isAdmin, getStaff);

module.exports = router;