const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  studentId: String,
  school: String,
  parent_phone: String,
  family_no: Number,
  family_income: Number,
  marks: {
    maths: { type: [Number], default: [] },
    science: { type: [Number], default: [] },
    social: { type: [Number], default: [] }
  },
  feedbacks: { type: [String], default: [] },
  age: Number,
  class: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
