// server/routes/studentRoutes.js

const router = require("express").Router();
const { protect, allowRoles } = require("../middleware/authMiddleware");
const {
  joinQuiz,
  submitQuiz,
  getHistory,
  searchQuizzes,
} = require("../controllers/studentController");

router.use(protect, allowRoles("student"));

router.get("/quiz/:code", joinQuiz);
router.post("/submit", submitQuiz);
router.get("/history", getHistory);
router.get("/search", searchQuizzes);

module.exports = router;
