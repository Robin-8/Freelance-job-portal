import bcrypt from "bcrypt";
import { generateToken } from "../jwt/jwt.js";
import User from "../model/clientModel.js";
import jobModel from "../model/jobModel.js";
import proposalModel from "../model/proposalModel.js";
import imagekit from "../utils/imagekit.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const file = req.file;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Freelance already registered with this email" });
    }

    let profileImageUrl = "https://via.placeholder.com/150?text=Profile";

    if (file) {
      try {
        const base64File = file.buffer.toString("base64");
        const fileName = `${name}_${Date.now()}`;

        const uploadResult = await imagekit.upload({
          file: base64File,
          fileName,
          folder: "/freelancer-profiles",
          useUniqueFileName: true,
        });

        profileImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error("ImageKit Upload Error:", uploadError);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: req.body.role || "freelancer",
      profileImage: profileImageUrl,
    });

    await newUser.save();

    const token = await generateToken(newUser);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "Freelance registered successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await generateToken(existingUser);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= JOBS =================
export const getJobById = async (req, res) => {
  try {
    const job = await jobModel.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.status(200).json({ message: "Job fetched", job });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { skill, budget, sort, title } = req.query;
    let filter = { isDeleted: false };

    if (title) filter.title = { $regex: title, $options: "i" };
    if (skill) filter.skillsRequired = { $regex: skill, $options: "i" };
    if (budget) filter.budget = { $lte: Number(budget) };

    let query = jobModel.find(filter);

    if (sort === "latest") query.sort({ createdAt: -1 });
    if (sort === "oldest") query.sort({ createdAt: 1 });
    if (sort === "budget-high") query.sort({ budget: -1 });
    if (sort === "budget-low") query.sort({ budget: 1 });

    const jobs = await query;

    return res.status(200).json({ message: "Jobs fetched", jobs });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================= APPLY JOB =================
export const applyJobs = async (req, res) => {
  const jobId = req.params.id;
  const freelancerId = req.user._id;
  const { coverLetter, bidAmount } = req.body;

  try {
    const job = await jobModel.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existingProposal = await proposalModel.findOne({
      job: jobId,
      freelancer: freelancerId,
    });

    if (existingProposal) {
      return res.status(409).json({ message: "Already applied" });
    }

    const proposal = await proposalModel.create({
      job: jobId,
      freelancer: freelancerId,
      coverLetter,
      bidAmount,
    });

    await jobModel.updateOne(
      { _id: jobId },
      { $inc: { proposalsCount: 1 } }
    );

    return res.status(200).json({ message: "Applied successfully", proposal });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================= PROPOSALS =================
export const getAllPreposals = async (req, res) => {
  try {
    const preposal = await proposalModel
      .find({ freelancer: req.user._id })
      .populate("job", "title budget deadline")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: "All proposals", preposal });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const withdrawProposal = async (req, res) => {
  try {
    const preposal = await proposalModel.findOne({
      _id: req.params.proposalId,
      freelancer: req.user._id,
    });

    if (!preposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    await preposal.deleteOne();
    return res.status(200).json({ message: "Proposal withdrawn" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// ================= PROFILE =================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "Profile fetched", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const update = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: update,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getPreposalCount = async (req, res) => {
  try {
    const count = await proposalModel.countDocuments({
      freelancer: req.user._id,
    });

    return res.status(200).json({ message: "Proposal count", count });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
