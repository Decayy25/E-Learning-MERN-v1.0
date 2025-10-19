const express = require('express');
const { body, validationResult } = require('express-validator');
const Grade = require('../models/Grade');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get grades
router.get('/', auth, async (req, res) => {
  try {
    const { student, course, semester, academicYear } = req.query;
    let filter = {};

    // Students can only see their own grades
    if (req.user.role === 'student') {
      filter.student = req.user._id;
    } else if (student) {
      filter.student = student;
    }

    if (course) filter.course = course;
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;

    const grades = await Grade.find(filter)
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'title subject')
      .populate('assignment', 'title type')
      .populate('teacher', 'firstName lastName');

    res.json(grades);
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create grade (Teachers/Staff/Principal only)
router.post('/', auth, authorize('teacher', 'staff', 'principal'), [
  body('student').notEmpty().withMessage('Student is required'),
  body('course').notEmpty().withMessage('Course is required'),
  body('grade').isNumeric().withMessage('Grade must be a number'),
  body('type').isIn(['assignment', 'exam', 'quiz', 'participation', 'final']).withMessage('Valid type is required'),
  body('semester').notEmpty().withMessage('Semester is required'),
  body('academicYear').notEmpty().withMessage('Academic year is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { student, course, assignment, grade, maxPoints, type, semester, academicYear, comments } = req.body;

    // Verify student is enrolled in course
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!courseDoc.students.includes(student)) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }

    const gradeDoc = new Grade({
      student,
      course,
      assignment,
      grade: parseFloat(grade),
      maxPoints: maxPoints || 100,
      type,
      semester,
      academicYear,
      teacher: req.user._id,
      comments
    });

    await gradeDoc.save();

    const populatedGrade = await Grade.findById(gradeDoc._id)
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'title subject')
      .populate('assignment', 'title type')
      .populate('teacher', 'firstName lastName');

    res.status(201).json({
      message: 'Grade recorded successfully',
      grade: populatedGrade
    });
  } catch (error) {
    console.error('Create grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update grade
router.put('/:id', auth, authorize('teacher', 'staff', 'principal'), [
  body('grade').optional().isNumeric().withMessage('Grade must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const gradeDoc = await Grade.findById(req.params.id);
    if (!gradeDoc) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    // Teachers can only update their own grades
    if (req.user.role === 'teacher' && gradeDoc.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { grade, comments } = req.body;

    if (grade !== undefined) {
      gradeDoc.grade = parseFloat(grade);
      gradeDoc.isPassed = gradeDoc.grade >= 60;
    }
    if (comments) gradeDoc.comments = comments;

    await gradeDoc.save();

    const populatedGrade = await Grade.findById(gradeDoc._id)
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'title subject')
      .populate('assignment', 'title type')
      .populate('teacher', 'firstName lastName');

    res.json({
      message: 'Grade updated successfully',
      grade: populatedGrade
    });
  } catch (error) {
    console.error('Update grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete grade
router.delete('/:id', auth, authorize('teacher', 'staff', 'principal'), async (req, res) => {
  try {
    const gradeDoc = await Grade.findById(req.params.id);
    if (!gradeDoc) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    // Teachers can only delete their own grades
    if (req.user.role === 'teacher' && gradeDoc.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Grade.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
