// server/routes/adminRoutes.js
// Admin routes — protected, only admin can access

const router = require("express").Router();
const { protect, allowRoles } = require("../middleware/authMiddleware");
const {
  getStats,
  getUsers,
  deleteUser,
  getAllQuizzes,
} = require("../controllers/adminController");

// All routes below require login AND admin role
router.use(protect, allowRoles("admin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.delete("/user/:id", deleteUser);
router.get("/quizzes", getAllQuizzes);

module.exports = router;
