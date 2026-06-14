// server/controllers/studentController.js
// Handles all student actions

const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

// GET /api/student/quiz/:code
// Student joins quiz using 6-character code
// GET /api/student/quiz/:code
exports.joinQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ code: req.params.code });

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found. Check the code." });
    }

    // Check if quiz is active
    if (!quiz.isActive) {
      return res
        .status(400)
        .json({ message: "This quiz has been deactivated by the teacher." });
    }

    // Check if quiz has expired
    if (quiz.expiresAt && new Date() > quiz.expiresAt) {
      return res
        .status(400)
        .json({ message: "This quiz has expired and is no longer available." });
    }

    // Remove correct answers before sending to student
    const safeQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json({
      _id: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      duration: quiz.duration,
      code: quiz.code,
      expiresAt: quiz.expiresAt,
      questions: safeQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/student/submit
exports.submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Compare student answers with correct answers
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });

    const total = quiz.questions.length;
    const wrong = total - correct;
    const percent = Math.round((correct / total) * 100);
    const passed = percent >= 50;

    // Save result
    const result = await Result.create({
      student: req.user.id,
      quiz: quizId,
      answers,
      correct,
      wrong,
      total,
      percent,
      passed,
    });

    // Send result WITH correct answers for review
    // This is safe because quiz is already submitted
    const questionsWithAnswers = quiz.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer, // now we send correct answer
    }));

    res.status(201).json({
      result,
      questionsWithAnswers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/student/history
// Get all quiz results for logged in student
exports.getHistory = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id })
      .populate("quiz", "title subject")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/student/search?q=keyword
// Search quizzes by title or subject
// GET /api/student/search?q=keyword
exports.searchQuizzes = async (req, res) => {
  const { q } = req.query;
  try {
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Only show active and non-expired quizzes
    const quizzes = await Quiz.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
      ],
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    }).select("-questions.correctAnswer");

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/student/leaderboard
// Get top students ranked by average score
exports.getLeaderboard = async (req, res) => {
  try {
    // Get all results with student info
    const results = await Result.find()
      .populate("student", "name email")
      .populate("quiz", "title");

    // Group results by student
    const studentMap = {};

    results.forEach((r) => {
      const studentId = r.student?._id?.toString();
      if (!studentId) return;

      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          student: r.student,
          totalAttempts: 0,
          totalScore: 0,
          passed: 0,
          bestScore: 0,
        };
      }

      studentMap[studentId].totalAttempts++;
      studentMap[studentId].totalScore += r.percent;
      if (r.passed) studentMap[studentId].passed++;
      if (r.percent > studentMap[studentId].bestScore) {
        studentMap[studentId].bestScore = r.percent;
      }
    });

    // Calculate average and sort by highest avg score
    const leaderboard = Object.values(studentMap)
      .map((s) => ({
        student: s.student,
        totalAttempts: s.totalAttempts,
        avgScore: Math.round(s.totalScore / s.totalAttempts),
        passed: s.passed,
        bestScore: s.bestScore,
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
