// server/models/Result.js
// This stores each student's quiz attempt result

const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    // which student attempted
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // which quiz was attempted
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    // student's answers — array of numbers (0,1,2,3)
    answers: [{ type: Number }],
    correct: { type: Number },
    wrong: { type: Number },
    total: { type: Number },
    percent: { type: Number },
    passed: { type: Boolean },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Result", resultSchema);
