const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get schedules
router.get('/', auth, async (req, res) => {
  try {
    const { teacher, grade, day } = req.query;
    let filter = { isActive: true };

    if (teacher) filter.teacher = teacher;
    if (grade) filter.grade = grade;
    if (day) filter['schedule.day'] = day;

    // Students can only see schedules for their courses
    if (req.user.role === 'student') {
      filter.students = req.user._id;
    }

    const courses = await Course.find(filter)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName studentId')
      .sort({ 'schedule.day': 1, 'schedule.time': 1 });

    res.json(courses);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update schedule (Teachers/Staff/Principal only)
router.put('/:id', auth, authorize('teacher', 'staff', 'principal'), [
  body('schedule.day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).withMessage('Valid day is required'),
  body('schedule.time').notEmpty().withMessage('Time is required'),
  body('schedule.duration').isNumeric().withMessage('Duration must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Teachers can only update their own course schedules
    if (req.user.role === 'teacher' && course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { schedule } = req.body;

    if (schedule) {
      course.schedule = {
        day: schedule.day,
        time: schedule.time,
        duration: parseInt(schedule.duration)
      };
    }

    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName studentId');

    res.json({
      message: 'Schedule updated successfully',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
