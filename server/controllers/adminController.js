// server/controllers/adminController.js
// Handles all admin actions

const User = require("../models/User");
const Quiz = require("../models/Quiz");

// GET /api/admin/stats
// Returns count of teachers, students and quizzes
exports.getStats = async (req, res) => {
  try {
    const teachers = await User.countDocuments({ role: "teacher" });
    const students = await User.countDocuments({ role: "student" });
    const quizzes = await Quiz.countDocuments();

    res.json({ teachers, students, quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/users
// Returns all users except passwords
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/user/:id
// Deletes a user by id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/quizzes
// Returns all quizzes with teacher name
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("teacher", "name")
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
