const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const { teacher, grade, subject } = req.query;
    let filter = { isActive: true };

    if (teacher) filter.teacher = teacher;
    if (grade) filter.grade = grade;
    if (subject) filter.subject = subject;

    // Students can only see courses they're enrolled in
    if (req.user.role === 'student') {
      filter.students = req.user._id;
    }

    const courses = await Course.find(filter)
      .populate('teacher', 'firstName lastName email')
      .populate('students', 'firstName lastName studentId');

    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'firstName lastName email')
      .populate('students', 'firstName lastName studentId');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Students can only view courses they're enrolled in
    if (req.user.role === 'student') {
      const isEnrolled = course.students.some(student => 
        student._id.toString() === req.user._id.toString()
      );
      if (!isEnrolled) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create course (Teachers/Staff/Principal only)
router.post('/', auth, authorize('teacher', 'staff', 'principal'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('grade').notEmpty().withMessage('Grade is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, subject, grade, schedule, students } = req.body;

    const course = new Course({
      title,
      description,
      teacher: req.user.role === 'teacher' ? req.user._id : req.body.teacher,
      students: students || [],
      subject,
      grade,
      schedule
    });

    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('teacher', 'firstName lastName email')
      .populate('students', 'firstName lastName studentId');

    res.status(201).json({
      message: 'Course created successfully',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course
router.put('/:id', auth, authorize('teacher', 'staff', 'principal'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty')
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

    // Teachers can only update their own courses
    if (req.user.role === 'teacher' && course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, schedule, students, materials } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (schedule) course.schedule = schedule;
    if (students) course.students = students;
    if (materials) course.materials = materials;

    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('teacher', 'firstName lastName email')
      .populate('students', 'firstName lastName studentId');

    res.json({
      message: 'Course updated successfully',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll students in course (Staff/Principal only)
router.post('/:id/enroll', auth, authorize('staff', 'principal'), [
  body('studentIds').isArray().withMessage('Student IDs must be an array')
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

    const { studentIds } = req.body;

    // Verify all students exist
    const students = await User.find({ _id: { $in: studentIds }, role: 'student' });
    if (students.length !== studentIds.length) {
      return res.status(400).json({ message: 'Some students not found' });
    }

    // Add students to course
    course.students = [...new Set([...course.students, ...studentIds])];
    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('teacher', 'firstName lastName email')
      .populate('students', 'firstName lastName studentId');

    res.json({
      message: 'Students enrolled successfully',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Enroll students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course
router.delete('/:id', auth, authorize('teacher', 'staff', 'principal'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Teachers can only delete their own courses
    if (req.user.role === 'teacher' && course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    course.isActive = false;
    await course.save();

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
