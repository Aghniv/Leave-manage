const express = require('express');
const { body } = require('express-validator');
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  reviewLeave,
  getLeaveById,
} = require('../controllers/leaveController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Employee routes
router.post(
  '/',
  restrictTo('employee'),
  [
    body('leaveType')
      .isIn(['Annual', 'Sick', 'Maternity', 'Paternity', 'Unpaid', 'Other'])
      .withMessage('Invalid leave type'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('reason')
      .trim()
      .notEmpty()
      .withMessage('Reason is required')
      .isLength({ min: 10 })
      .withMessage('Reason must be at least 10 characters'),
  ],
  applyLeave
);

router.get('/my', restrictTo('employee'), getMyLeaves);

// Employer routes
router.get('/', restrictTo('employer'), getAllLeaves);

router.patch(
  '/:id/review',
  restrictTo('employer'),
  [
    body('status').isIn(['Approved', 'Rejected']).withMessage('Status must be Approved or Rejected'),
    body('reviewNote').optional().trim(),
  ],
  reviewLeave
);

// Shared route
router.get('/:id', getLeaveById);

module.exports = router;
