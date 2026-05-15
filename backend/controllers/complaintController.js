const Complaint = require("../models/Complaint");

// User: Create complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      image: "",
      userId: req.user.id
    });

    res.status(201).json({ message: "Complaint created successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// User: Get my complaints
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// User: Get single complaint
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("userId", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Assign staff to complaint
const assignComplaint = async (req, res) => {
  try {
    const { staffId } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: staffId, status: "In Progress" },
      { new: true }
    );

    res.status(200).json({ message: "Staff assigned successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Change priority
const changePriority = async (req, res) => {
  try {
    const { priority } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    );

    res.status(200).json({ message: "Priority updated", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Staff: Update status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({ message: "Status updated", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user.id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  assignComplaint,
  changePriority,
  updateStatus,
  getAssignedComplaints  
};