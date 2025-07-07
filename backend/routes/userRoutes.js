const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getUsers, getUserById } = require("../controllers/userController");

const router = express.Router();

//User Management Routes
router.get("/", protect, adminOnly, getUsers); //Get all users AdminOnly
router.get("/:id", protect, getUserById); //Get a specific User
// router.get("/:id", protect, adminOnly, deleteUser); //Delete a user (Admin only)

module.exports = router;
