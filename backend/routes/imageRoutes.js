// routes/imageRoutes.js

// ✅ Fixed: Removed stray semicolon and cleaned up
router.post("/", upload.single("images"), (req, res) => {
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
