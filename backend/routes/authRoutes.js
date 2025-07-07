const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const router = express.Router();
const upload = require("../middlewares/cloudinaryUpload");

//Auth routes
router.post("/register", registerUser); //Register User
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); // Get User Profile
router.put("/profile/:id", protect, updateUserProfile); // Update profile

//image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    console.log("Uploaded file:", req.file); // Confirm file presence

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      success: true,
      imageUrl: req.file.path, // Cloudinary hosted image URL
      public_id: req.file.filename, // Optional
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});

module.exports = router; // ✅ Correct way
