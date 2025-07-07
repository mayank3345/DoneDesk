const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//@desc  get all users (Admin only)
//@route GET/api/users/
//@access Private (Admin only)

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    // Add task counts to each user
    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json(userWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc  get all users
//@route GET/api/users/
//@access Private

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc  delete  users (Admin only)
//@route Delete/api/users/
//@access Private (Admin only)

// const deleteUser = async (req, res) => {
//   try {
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

module.exports = { getUsers, getUserById };
