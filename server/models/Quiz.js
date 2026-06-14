// server/models/Quiz.js

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true },
    code: { type: String, unique: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [questionSchema],

    // Quiz active status — teacher can deactivate quiz
    isActive: { type: Boolean, default: true },

    // Quiz start time — set when first student joins
    startedAt: { type: Date, default: null },

    // Quiz expiry time — set by teacher when creating
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Quiz", quizSchema);
