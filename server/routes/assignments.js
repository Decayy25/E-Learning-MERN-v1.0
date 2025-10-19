const express = require('express');
const { body, validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get assignments
router.get('/', auth, async (req, res) => {
  try {
    const { course, type, teacher } = req.query;
    let filter = { isActive: true };

    if (course) filter.course = course;
    if (type) filter.type = type;
    if (teacher) filter.teacher = teacher;

    // Students can only see assignments for their courses
    if (req.user.role === 'student') {
      const studentCourses = await Course.find({ students: req.user._id });
      filter.course = { $in: studentCourses.map(c => c._id) };
    }

    const assignments = await Assignment.find(filter)
      .populate('course', 'title subject grade')
      .populate('teacher', 'firstName lastName')
      .populate('submissions.student', 'firstName lastName studentId')
      .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assignment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'title subject grade')
      .populate('teacher', 'firstName lastName')
      .populate('submissions.student', 'firstName lastName studentId');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Students can only view assignments for their courses
    if (req.user.role === 'student') {
      const course = await Course.findById(assignment.course._id);
      if (!course.students.includes(req.user._id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(assignment);
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create assignment (Teachers/Staff/Principal only)
router.post('/', auth, authorize('teacher', 'staff', 'principal'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('course').notEmpty().withMessage('Course is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('maxPoints').isNumeric().withMessage('Max points must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, course, dueDate, maxPoints, type, materials } = req.body;

    const assignment = new Assignment({
      title,
      description,
      course,
      teacher: req.user.role === 'teacher' ? req.user._id : req.body.teacher,
      dueDate,
      maxPoints: parseFloat(maxPoints),
      type: type || 'homework',
      materials: materials || []
    });

    await assignment.save();

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('course', 'title subject grade')
      .populate('teacher', 'firstName lastName');

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment: populatedAssignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit assignment (Students only)
router.post('/:id/submit', auth, authorize('student'), [
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(assignment.course);
    if (!course.students.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    const { content, fileUrl } = req.body;

    assignment.submissions.push({
      student: req.user._id,
      content,
      fileUrl
    });

    await assignment.save();

    res.json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Grade assignment (Teachers/Staff/Principal only)
router.put('/:id/grade', auth, authorize('teacher', 'staff', 'principal'), [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('grade').isNumeric().withMessage('Grade must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const { studentId, grade, feedback } = req.body;

    const submission = assignment.submissions.find(
      sub => sub.student.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = parseFloat(grade);
    submission.feedback = feedback;
    submission.gradedAt = new Date();

    await assignment.save();

    res.json({ message: 'Assignment graded successfully' });
  } catch (error) {
    console.error('Grade assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update assignment
router.put('/:id', auth, authorize('teacher', 'staff', 'principal'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Teachers can only update their own assignments
    if (req.user.role === 'teacher' && assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, dueDate, maxPoints, materials } = req.body;

    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (dueDate) assignment.dueDate = dueDate;
    if (maxPoints) assignment.maxPoints = parseFloat(maxPoints);
    if (materials) assignment.materials = materials;

    await assignment.save();

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('course', 'title subject grade')
      .populate('teacher', 'firstName lastName');

    res.json({
      message: 'Assignment updated successfully',
      assignment: populatedAssignment
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete assignment
router.delete('/:id', auth, authorize('teacher', 'staff', 'principal'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Teachers can only delete their own assignments
    if (req.user.role === 'teacher' && assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    assignment.isActive = false;
    await assignment.save();

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
