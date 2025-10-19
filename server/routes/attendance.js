const express = require('express');
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get attendance records
router.get('/', auth, async (req, res) => {
  try {
    const { student, course, semester, academicYear, date } = req.query;
    let filter = {};

    // Students can only see their own attendance
    if (req.user.role === 'student') {
      filter.student = req.user._id;
    } else if (student) {
      filter.student = student;
    }

    if (course) filter.course = course;
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;
    if (date) filter.date = new Date(date);

    const attendance = await Attendance.find(filter)
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'title subject')
      .populate('teacher', 'firstName lastName')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create attendance record (Teachers/Staff/Principal only)
router.post('/', auth, authorize('teacher', 'staff', 'principal'), [
  body('student').notEmpty().withMessage('Student is required'),
  body('course').notEmpty().withMessage('Course is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Valid status is required'),
  body('semester').notEmpty().withMessage('Semester is required'),
  body('academicYear').notEmpty().withMessage('Academic year is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { student, course, date, status, notes, semester, academicYear } = req.body;

    // Verify student is enrolled in course
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!courseDoc.students.includes(student)) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }

    const attendance = new Attendance({
      student,
      course,
      teacher: req.user.role === 'teacher' ? req.user._id : req.body.teacher,
      date: new Date(date),
      status,
      notes,
      semester,
      academicYear
    });

    await attendance.save();

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'title subject')
      .populate('teacher', 'firstName lastName');

    res.status(201).json({
      message: 'Attendance recorded successfully',
      attendance: populatedAttendance
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update attendance record
router.put('/:id', auth, authorize('teacher', 'staff', 'principal'), [
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Teachers can only update their own attendance records
    if (req.user.role === 'teacher' && attendance.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, notes } = req.body;

    if (status) attendance.status = status;
    if (notes) attendance.notes = notes;

    await attendance.save();

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'title subject')
      .populate('teacher', 'firstName lastName');

    res.json({
      message: 'Attendance updated successfully',
      attendance: populatedAttendance
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete attendance record
router.delete('/:id', auth, authorize('teacher', 'staff', 'principal'), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Teachers can only delete their own attendance records
    if (req.user.role === 'teacher' && attendance.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
