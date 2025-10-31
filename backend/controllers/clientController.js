const bcrypt = require("bcrypt");
const clientModel = require("../model/clientModel");
const jobModel = require("../model/jobModel");
const { generateToken } = require("../jwt/jwt");

// ==================== REGISTER ====================
const register = async (req, res) => {
  const { name, email, password, role, companyName, profileImage } = req.body;

  try {
    const userExisting = await clientModel.findOne({ email });
    if (userExisting) {
      return res
        .status(400)
        .json({ message: "User already registered with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new clientModel({
      name,
      email,
      password: hashedPassword,
      role: role || "client",
      companyName,
      profileImage,
    });

    await newUser.save();

    const token = await generateToken(newUser);

    return res.status(200).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== LOGIN ====================
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExisting = await clientModel.findOne({ email });
    if (!userExisting) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, userExisting.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await generateToken(userExisting);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: userExisting._id,
        name: userExisting.name,
        email: userExisting.email,
        role: userExisting.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== ADD JOB ====================
const addJob = async (req, res) => {
  const { title, description, skillsRequired, budgetType, budget, deadline } = req.body;

  try {
    // ✅ Validate input
    if (!title || !description || !budget || !deadline) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // ❌ Wrong: you had `if (!req.user || req.user.id)` → this is always true
    // ✅ Correct check:
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not found or unauthorized" });
    }

    // ✅ Correct model creation (no `new jobModel.create`)
    const newJob = await jobModel.create({
      title,
      description,
      skillsRequired,
      budgetType,
      budget,
      deadline,
      postedBy: req.user._id, // ✅ correct field
    });

    return res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    console.error("Add Job Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { register, login, addJob };
