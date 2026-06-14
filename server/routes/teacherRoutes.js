// server/routes/teacherRoutes.js
// Teacher routes — protected, only teacher can access

const router = require("express").Router();
const { protect, allowRoles } = require("../middleware/authMiddleware");
const {
  createQuiz,
  getMyQuizzes,
  editQuiz,
  deleteQuiz,
  getResults,
} = require("../controllers/teacherController");

// All routes below require login AND teacher role
router.use(protect, allowRoles("teacher"));

router.post("/quiz", createQuiz);
router.get("/quizzes", getMyQuizzes);
router.put("/quiz/:id", editQuiz);
router.delete("/quiz/:id", deleteQuiz);
router.get("/results/:quizId", getResults);

module.exports = router;
