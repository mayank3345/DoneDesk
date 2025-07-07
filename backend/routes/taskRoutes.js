const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getDashboardData,
  getUserDashboardData,
  getTask,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTasksStatus,
  updateTaskChecklist,
} = require("../controllers/taskController");

const router = express.Router();

//Task Management Routes

router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTask); //get all Tasks (Admin only)  User:Assigned Tasks
router.get("/:id", protect, getTaskById); //get task by id
router.post("/", protect, adminOnly, createTask); //create a task admin only
router.put("/:id", protect, updateTask); //update task details
router.delete("/:id", protect, adminOnly, deleteTask); //delete a task (Admin Only)
router.put("/:id/status", protect, updateTasksStatus); //update Task Status
router.put("/:id/todo", protect, updateTaskChecklist); //update task checklist

module.exports = router;
