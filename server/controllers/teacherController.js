// server/controllers/teacherController.js
// Handles all teacher actions

const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

// Generate random 6-character quiz code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// POST /api/teacher/quiz
// Create a new quiz
exports.createQuiz = async (req, res) => {
  const { title, subject, duration, questions, expiryHours } = req.body;

  try {
    // Calculate expiry time
    // Default: quiz expires after 24 hours if not specified
    const hours = expiryHours || 24;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const quiz = await Quiz.create({
      title,
      subject,
      duration,
      code: generateCode(),
      teacher: req.user.id,
      questions,
      isActive: true,
      expiresAt,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/teacher/quizzes
// Get all quizzes created by this teacher
exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacher: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/teacher/quiz/:id
// Edit a quiz
exports.editQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user.id },
      req.body,
      { new: true },
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/teacher/quiz/:id
// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findOneAndDelete({
      _id: req.params.id,
      teacher: req.user.id,
    });

    // Also delete all results for this quiz
    await Result.deleteMany({ quiz: req.params.id });

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/teacher/results/:quizId
// Get all student results for a quiz
exports.getResults = async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
