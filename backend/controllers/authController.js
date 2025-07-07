const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//generating jwt token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//@desc  Register a new user
//@route POST  /api/auth/register
//@access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;

    //checking is user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      //Determine user role: Admin if correct token is provided,otherwise member
      let role = "member";
      if (
        adminInviteToken &&
        adminInviteToken == process.env.ADMIN_INVITE_TOKEN
      ) {
        role = "admin";
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //create new user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        profileImageUrl,
        role,
      });

      // Return user data with JWT
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc  Login a user
//@route POST  /api/auth/login
//@access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //checking user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    //return user data with JWT
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc  Get user profile
//@route GET  /api/auth/profile
//@access Private (require JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc    Update user profile
//@route   PUT  /api/auth/profile
//@access    Private (require JWT)
// const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id); //may be id==_id
//     if (!user) {
//       return res.status(403).json({ message: "User Not Found" });
//     }
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     // user.name=req.body.name||user.name;

//     if (req.body.password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(req.body.password, salt);
//     }
//     const updateUser = await user.save();

//     res.status(201).json({
//       _id: updateUser._id,
//       name: updateUser.name,
//       email: updateUser.email,
//       role: updateUser.role,
//       token: generateToken(updateUser._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(403).json({ message: "User Not Found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Handle password update
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // ✅ Handle profile image update
    if (req.file && req.file.path) {
      user.profileImageUrl = req.file.path; // Cloudinary hosted image URL
    }

    const updateUser = await user.save();

    res.status(201).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      profileImageUrl: updateUser.profileImageUrl,
      role: updateUser.role,
      token: generateToken(updateUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
