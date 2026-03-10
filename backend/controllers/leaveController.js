const { validationResult } = require('express-validator');
const Leave = require('../models/Leave');

// Employee: Apply for leave
const applyLeave = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { leaveType, startDate, endDate, reason } = req.body;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past.' });
    }
    if (end < start) {
      return res.status(400).json({ message: 'End date must be after or equal to start date.' });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
    });

    await leave.populate('employee', 'name email department');

    res.status(201).json({ message: 'Leave application submitted.', leave });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error applying for leave.' });
  }
};

// Employee: Get own leaves
const getMyLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { employee: req.user._id };
    if (status) filter.status = status;

    const leaves = await Leave.find(filter)
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Leave.countDocuments(filter);

    res.json({ leaves, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests.' });
  }
};

// Employer: Get all leaves
const getAllLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const leaves = await Leave.find(filter)
      .populate('employee', 'name email department')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Leave.countDocuments(filter);

    res.json({ leaves, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests.' });
  }
};

// Employer: Review a leave request
const reviewLeave = async (req, res) => {
  const { id } = req.params;
  const { status, reviewNote } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be Approved or Rejected.' });
  }

  try {
    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }
    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'This leave request has already been reviewed.' });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewNote = reviewNote || '';
    leave.reviewedAt = new Date();

    await leave.save();
    await leave.populate('employee', 'name email department');
    await leave.populate('reviewedBy', 'name email');

    res.json({ message: `Leave request ${status.toLowerCase()}.`, leave });
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing leave request.' });
  }
};

// Get a single leave by ID
const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employee', 'name email department')
      .populate('reviewedBy', 'name email');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    // Employees can only view their own leaves
    if (req.user.role === 'employee' && leave.employee._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json({ leave });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave request.' });
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, reviewLeave, getLeaveById };
