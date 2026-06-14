// server/routes/authRoutes.js

const router = require("express").Router();
const {
  register,
  login,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// Change password — user must be logged in
router.post("/change-password", protect, changePassword);

module.exports = router;
