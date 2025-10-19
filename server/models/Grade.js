const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  maxPoints: {
    type: Number,
    required: true,
    default: 100
  },
  type: {
    type: String,
    enum: ['assignment', 'exam', 'quiz', 'participation', 'final'],
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: String,
  isPassed: {
    type: Boolean,
    default: function() {
      return this.grade >= 60;
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Grade', gradeSchema);
