const express = require('express');
const { body, validationResult } = require('express-validator');
const Announcement = require('../models/Announcement');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all announcements
router.get('/', auth, async (req, res) => {
  try {
    const { priority, targetAudience } = req.query;
    let filter = { isActive: true };

    if (priority) filter.priority = priority;
    if (targetAudience) filter.targetAudience = targetAudience;

    // Filter by user role and grade
    if (req.user.role === 'student') {
      filter.$or = [
        { targetAudience: 'all' },
        { targetAudience: 'students' },
        { targetAudience: 'specific_grade', specificGrade: req.user.grade }
      ];
    }

    const announcements = await Announcement.find(filter)
      .populate('author', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create announcement (Staff/Principal only)
router.post('/', auth, authorize('staff', 'principal'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('targetAudience').isIn(['all', 'students', 'teachers', 'staff', 'specific_grade']).withMessage('Valid target audience is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, targetAudience, specificGrade, priority, attachments, expiresAt } = req.body;

    const announcement = new Announcement({
      title,
      content,
      author: req.user._id,
      targetAudience,
      specificGrade,
      priority: priority || 'medium',
      attachments: attachments || [],
      expiresAt
    });

    await announcement.save();

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('author', 'firstName lastName');

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: populatedAnnouncement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update announcement
router.put('/:id', auth, authorize('staff', 'principal'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const { title, content, priority, attachments, expiresAt } = req.body;

    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (priority) announcement.priority = priority;
    if (attachments) announcement.attachments = attachments;
    if (expiresAt) announcement.expiresAt = expiresAt;

    await announcement.save();

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('author', 'firstName lastName');

    res.json({
      message: 'Announcement updated successfully',
      announcement: populatedAnnouncement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete announcement
router.delete('/:id', auth, authorize('staff', 'principal'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    announcement.isActive = false;
    await announcement.save();

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
