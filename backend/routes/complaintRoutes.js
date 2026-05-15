const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  assignComplaint,
  changePriority,
  updateStatus,
  getAssignedComplaints
} = require("../controllers/complaintController");

const { protect, isAdmin, isStaff } = require("../middleware/authMiddleware");

// POST
router.post("/", protect, createComplaint);

// GET — specific routes FIRST
router.get("/my-complaints", protect, getMyComplaints);
router.get("/assigned", protect, isStaff, getAssignedComplaints);
router.get("/all", protect, isAdmin, getAllComplaints);

// PUT
router.put("/assign/:id", protect, isAdmin, assignComplaint);
router.put("/priority/:id", protect, isAdmin, changePriority);
router.put("/status/:id", protect, isStaff, updateStatus);

// GET — dynamic route LAST
router.get("/:id", protect, getComplaintById);

module.exports = router;