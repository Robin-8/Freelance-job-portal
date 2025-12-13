import bcrypt from "bcrypt";
import adminModel from "../model/clientModel.js";
import { generateToken } from "../jwt/jwt.js";
import clientModel from "../model/clientModel.js";
import jobModel from "../model/jobModel.js";
import proposalModel from "../model/proposalModel.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const adminExisting = await adminModel.findOne({ email });
    if (adminExisting) {
      return res.status(400).json({
        message: "Admin already registered with this email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminModel({
      name,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    await newAdmin.save();

    const token = await generateToken(newAdmin);

    return res.status(200).json({
      message: "Admin registered successfully",
      admin: newAdmin,
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminExisting = await adminModel.findOne({ email });
    if (!adminExisting) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, adminExisting.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await generateToken(adminExisting);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: adminExisting._id,
        name: adminExisting.name,
        email: adminExisting.email,
        role: adminExisting.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= USERS =================
export const getUsers = async (req, res) => {
  try {
    const users = await clientModel.find().select("-password");
    return res.status(200).json({ message: "All users fetched", users });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find().select("-password");
    return res.status(200).json({ success: true, admins });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await clientModel.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const blockUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await clientModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await clientModel.findByIdAndUpdate(
      id,
      { isBlocked: !user.isBlocked },
      { new: true }
    );

    return res.status(200).json({
      message: updatedUser.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ================= JOBS =================
export const adminGetJobs = async (req, res) => {
  try {
    const jobs = await jobModel
      .find({ isDeleted: false })
      .populate("postedBy", "name email");

    return res.status(200).json({ message: "All jobs fetched", jobs });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getAllProposalsAdmin = async (req, res) => {
  try {
    const proposals = await proposalModel
      .find()
      .populate("freelancer", "name email bidAmount")
      .populate("job", "title budget deadline postedBy")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: "All proposals", proposals });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const editJobs = async (req, res) => {
  try {
    const job = await jobModel.findById(req.params.id)
      .populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job found", job });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateJob = async (req, res) => {
  try {
    const updatedJob = await jobModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job updated", job: updatedJob });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await jobModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job deleted successfully", job });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
