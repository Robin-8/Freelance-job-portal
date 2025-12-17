import bcrypt from "bcrypt";
import adminModel from "../model/clientModel.js";
import clientModel from "../model/clientModel.js";
import jobModel from "../model/jobModel.js";
import proposalModel from "../model/proposalModel.js";
import generateToken from "../jwt/jwt.js";
import paymentModel from "../model/paymentModel.js";

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


// Assuming this is your Admin Login Controller file
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await clientModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Admin login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token, 
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Server error" });
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
    const user = await clientModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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

export const getAdminTotalPayments = async (req, res) => {
  try {
    const result = await paymentModel.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalPaid: { $sum: "$amount" } } },
    ]);

    const total = result.length > 0 ? result[0].totalPaid : 0;
    res.status(200).json({ total });
  } catch (err) {
    console.error("Admin total payments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Freelancers Applied (all jobs)
export const getAdminTotalFreelancersApplied = async (req, res) => {
  try {
    const jobs = await jobModel.find({ isDeleted: false }).select("_id");
    const jobIds = jobs.map(j => j._id);

    if (jobIds.length === 0) return res.status(200).json({ totalApplicants: 0 });

    const totalApplicants = await proposalModel.countDocuments({ job: { $in: jobIds } });
    res.status(200).json({ totalApplicants });
  } catch (err) {
    console.error("Admin total freelancers applied error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ Jobs Posted (all jobs)
export const getAdminJobsPosted = async (req, res) => {
  try {
    const jobsPosted = await jobModel.countDocuments({ isDeleted: false });
    res.status(200).json({ jobsPosted });
  } catch (err) {
    console.error("Admin jobs posted error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 4️⃣ Proposal Stats (applied / accepted / rejected)
export const getAdminProposalStats = async (req, res) => {
  try {
    const jobs = await jobModel.find({ isDeleted: false }).select("_id");
    const jobIds = jobs.map(j => j._id);

    if (jobIds.length === 0) return res.status(200).json({ applied: 0, accepted: 0, rejected: 0 });

    const proposalStats = await proposalModel.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    let applied = 0, accepted = 0, rejected = 0;
    proposalStats.forEach(stat => {
      if (stat._id === "pending") applied = stat.count;
      if (stat._id === "accepted") accepted = stat.count;
      if (stat._id === "rejected") rejected = stat.count;
    });

    res.status(200).json({ applied, accepted, rejected });
  } catch (err) {
    console.error("Admin proposal stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 5️⃣ Monthly Payments (for chart)
export const getAdminMonthlyPayments = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const monthlyResult = await paymentModel.aggregate([
      { $match: { status: "paid", createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
      { $group: { _id: { month: { $month: "$createdAt" } }, amount: { $sum: "$amount" } } },
      { $sort: { "_id.month": 1 } },
    ]);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthly = Array(12).fill(0).map((_, i) => ({ month: months[i], amount: 0 }));
    monthlyResult.forEach(m => { monthly[m._id.month - 1].amount = m.amount; });

    res.status(200).json({ monthly });
  } catch (err) {
    console.error("Admin monthly payments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const AdminAddJob = async (req, res) => {
  const {
    title,
    description,
    skillsRequired,
    budgetType,
    budget,
    deadline,
    place,
  } = req.body;

  try {
    if (!title || !description || !budget || !deadline || !place) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "User not found or unauthorized" });
    }

    const existingJob = await jobModel.findOne({
      title: title.trim().toLowerCase(),
      postedBy: req.user._id,
    });

    if (existingJob) {
      return res.status(409).json({
        message: "A job with this title already exists!",
      });
    }

    const newJob = await jobModel.create({
      title: title.trim().toLowerCase(),
      description,
      skillsRequired,
      budgetType,
      budget,
      deadline,
      postedBy: req.user._id, // 🔥 from token
      place,
    });

    return res.status(201).json({
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Admin Add Job Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
