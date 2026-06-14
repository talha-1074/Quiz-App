// server/models/User.js
// This defines how a user is stored in MongoDB

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two users with same email
    },
    password: {
      type: String,
      required: true,
    },
    // role decides which dashboard the user sees
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
