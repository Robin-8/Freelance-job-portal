const bcrypt = require("bcrypt");
const { generateToken } = require("../jwt/jwt");
const User = require("../model/clientModel");
const jobModel = require("../model/jobModel");
const proposalModel = require("../model/proposalModel");
const imagekit = require("../utils/imagekit"); 

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const file = req.file; 
  console.log(file,'file here')

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Freelance already registered with this email" });
    }

    // 1. Initialize profileImageUrl with the default placeholder
    let profileImageUrl = "https://via.placeholder.com/150?text=Profile";

    // 2. CHECK FOR FILE and UPLOAD to ImageKit
    if (file) {
      try {
        // Convert the file buffer to Base64 string, as required by ImageKit SDK
        const base64File = file.buffer.toString('base64');
        const fileName = `${name}_${Date.now()}`; // Create a unique file name

        const uploadResult = await imagekit.upload({
          file: base64File,
          fileName: fileName,
          folder: "/freelancer-profiles", // The virtual folder in your ImageKit dashboard
          useUniqueFileName: true,
        });

        // Use the URL returned by ImageKit for the user's profile
        profileImageUrl = uploadResult.url; 
        console.log("Image successfully uploaded to:", profileImageUrl);

      } catch (uploadError) {
        console.error("ImageKit Upload Error:", uploadError);
        // If upload fails (e.g., bad key, network issue), we fall back to the placeholder URL
      }
    }

    // 3. Hash Password and Create User
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: req.body.role || "freelancer",
      profileImage: profileImageUrl, // This will be the ImageKit URL or the default
    });

    await newUser.save();

    // 4. Generate Token and Respond
    const token = await generateToken(newUser);
    console.log(token, "token here");

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

const login = async (req, res) => {
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
const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobModel.findById(id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.status(200).json({ message: "Job fetched", job });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getJobs = async (req, res) => {
  try {
    const { skill, budget, sort, title } = req.query;
    let filter = { isDeleted: false };

    if (title) filter.title = { $regex: title, $options: "i" };

    if (skill) filter.skillsRequired = { $regex: skill, $options: "i" };

    if (budget) filter.budget = { $lte: Number(budget) };

    let query = jobModel.find(filter);

    if (sort === "latest") query = query.sort({ createdAt: -1 });
    else if (sort === "oldest") query = query.sort({ createdAt: 1 });
    else if (sort === "budget-high") query = query.sort({ budget: -1 });
    else if (sort === "budget-low") query = query.sort({ budget: 1 });

    const jobs = await query;

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    return res.status(200).json({ message: "Here is all jobs", jobs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const applyJobs = async (req, res) => {
  const jobId = req.params.id;
  const freelancerId = req.user.id;
  const { coverLetter, bidAmount } = req.body;

  try {
    // Check if job exists
    const job = await jobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if freelancer already applied
    const existingProposal = await proposalModel.findOne({
      job: jobId,
      freelancer: freelancerId,
    });

    if (existingProposal) {
      return res.status(409).json({
        message: "You have already applied for this job",
      });
    }

    // Create new proposal
    const proposal = await proposalModel.create({
      job: jobId,
      freelancer: freelancerId,
      coverLetter,
      bidAmount,
    });

    // Increase proposalsCount
    await jobModel.updateOne({ _id: jobId }, { $inc: { proposalsCount: 1 } });

    return res.status(200).json({
      message: "Applied successfully",
      proposal,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPreposals = async (req, res) => {
  try {
    const preposal = await proposalModel
      .find({ freelancer: req.user._id })
      .populate("job", "title budget deadline")
      .sort({ createdAt: -1 });

    if (!preposal) {
      return res.status(401).json({ message: "No preposal found" });
    }
    return res.status(200).json({ message: "all preposal here", preposal });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const update = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, password },
      {
        new: true,
      }
    );
    if (!update) {
      return res.status(401).json({ message: "no user found with this id" });
    }
    return res
      .status(200)
      .json({ message: "user updated successfully", update });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

const withdrawProposal = async (req, res) => {
  const { proposalId } = req.params;
  try {
    const preposal = await proposalModel.findOne({
      _id: proposalId,
      freelancer: req.user._id,
    });
    if (!preposal) {
      return res.status(201).json({ message: "no job found" });
    }
    await preposal.deleteOne();
    return res
      .status(200)
      .json({ message: "job preposal deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getPreposalCount = async (req, res) => {
  try {
    const count = await proposalModel.countDocuments({
      freelancer: req.user._id,
    });

    return res.status(200).json({
      message: "proposal count",
      count,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

const jobEditing = async (req, res) => {
  try {
    const id = req.params.id;
    const jobs = await jobModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!jobs) {
      return res.status(400).json({ message: "No jobs are founded" });
    }
    return res.status(200).json({ message: "Job edited successfully", jobs });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

module.exports = {
  register,
  login,
  getJobs,
  applyJobs,
  getAllPreposals,
  updateProfile,
  getPreposalCount,
  withdrawProposal,
  getJobById,
  getProfile,
};
