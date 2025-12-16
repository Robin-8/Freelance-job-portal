import bcrypt from "bcrypt";
import clientModel from "../model/clientModel.js";
import jobModel from "../model/jobModel.js";
import { generateToken } from "../jwt/jwt.js";
import proposalModel from "../model/proposalModel.js";

// ==================== REGISTER ====================
export const register = async (req, res) => {
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
export const login = async (req, res) => {
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
        _id: userExisting._id,
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
export const addJob = async (req, res) => {
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

    if (!req.client || !req.client._id) {
      return res.status(401).json({
        message: "User not found or unauthorized",
      });
    }

    const existingJob = await jobModel.findOne({
      title: title.trim().toLowerCase(),
      postedBy: req.client._id,
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
      postedBy: req.client._id,
      place,
    });

    return res.status(201).json({
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Add Job Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, description, skillsRequired } = req.body;

  const updatedJobData = {
    title,
    description,
    skillsRequired,
  };

  try {
    const updatedJob = await jobModel.findByIdAndUpdate(id, updatedJobData, {
      new: true,
    });
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job updated successfully", updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await jobModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job soft deleted successfully", job });
  } catch (error) {
    console.error("Error soft deleting job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find({ isDeleted: false });
    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const proposalReceived = async (req, res) => {
  try {
    if (!req.client || !req.client._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jobs = await jobModel.find({ postedBy: req.client._id });

    if (!jobs || jobs.length === 0) {
      return res.status(200).json({ message: "No jobs found", proposals: [] });
    }

    const jobIds = jobs.map((job) => job._id);

    const proposals = await proposalModel
      .find({ job: { $in: jobIds } })
      .populate("freelancer", "name email")
      .populate("job", "title budget deadline")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: "Proposals fetched", proposals });
  } catch (err) {
    console.error("proposalReceived error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const proposalStatus = async (req, res) => {
  const { preposalId } = req.params;
  const { status } = req.body;

  try {
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(401).json({ message: "Preposal not found" });
    }
    const updatePreposal = await proposalModel.findByIdAndUpdate(
      preposalId,
      { status },
      { new: true }
    );

    if (!updatePreposal) {
      return res.status(401).json({ message: "perposal not found" });
    }
    return res.status(200).json({
      message: `Proposal status updated to ${status}`,
      preposal: updatePreposal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const editJobs = async (req, res) => {
  try {
    const id = req.params.id;
    const jobs = await jobModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!jobs) {
      return res.status(400).json({ message: "Job not found" });
    }
    return res.status(200).json({ message: "Job updated successfully", jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicantsCount = async (req, res) => {
  try {
    const jobId = req.params.id;

    const count = await Proposal.countDocuments({ job: jobId });

    return res.status(200).json({
      success: true,
      applicantsCount: count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

export const getClientTotalFreelancersApplied = async (req, res) => {
  try {
    const clientId = req.user?._id; // from auth middleware (use _id not id)

    // Step 1: Find all jobs posted by this client
    const jobs = await jobModel.find({ postedBy: clientId }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    if (jobIds.length === 0) {
      return res.status(200).json({ totalApplicants: 0 });
    }

    // Step 2: Count proposals for these jobs
    const totalApplicants = await proposalModel.countDocuments({
      job: { $in: jobIds },
    });

    return res.status(200).json({ totalApplicants });
  } catch (error) {
    console.log("Client applicant count error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClientJobsPosted = async (req, res) => {
  try {
    const clientId = req.user?._id;

    // Count jobs posted by this client
    const jobsCount = await jobModel.countDocuments({
      postedBy: clientId,
      isDeleted: false,
    });

    return res.status(200).json({ jobsPosted: jobsCount });
  } catch (error) {
    console.log("Client jobs count error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClientProposalStats = async (req, res) => {
  try {
    const clientId = req.user?._id;

    const jobs = await jobModel.find({ postedBy: clientId }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    if (jobIds.length === 0) {
      return res.status(200).json({
        applied: 0,
        accepted: 0,
        rejected: 0,
      });
    }

    const proposalStats = await proposalModel.aggregate([
      {
        $match: { job: { $in: jobIds } },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    let applied = 0,
      accepted = 0,
      rejected = 0;
    proposalStats.forEach((stat) => {
      if (stat._id === "pending") applied = stat.count;
      if (stat._id === "accepted") accepted = stat.count;
      if (stat._id === "rejected") rejected = stat.count;
    });

    return res.status(200).json({
      applied: applied || 0,
      accepted: accepted || 0,
      rejected: rejected || 0,
    });
  } catch (error) {
    console.log("Client proposal stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClientHomeData = async (req, res) => {
  try {
    const clientId = req.client?._id;
    if (!clientId) return res.status(401).json({ message: "Unauthorized" });

    // Jobs posted
    const jobs = await jobModel.find({ postedBy: clientId, isDeleted: false }).select("_id title");
    const jobsPosted = jobs.length;
    const jobIds = jobs.map((j) => j._id);

    // Freelancers applied
    const totalFreelancersApplied =
      jobIds.length > 0 ? await proposalModel.countDocuments({ job: { $in: jobIds } }) : 0;

    // Proposal stats
    let applied = 0,
      accepted = 0,
      rejected = 0;
    if (jobIds.length > 0) {
      const stats = await proposalModel.aggregate([
        { $match: { job: { $in: jobIds } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      stats.forEach((s) => {
        if (s._id === "pending") applied = s.count;
        if (s._id === "accepted") accepted = s.count;
        if (s._id === "rejected") rejected = s.count;
      });
    }

    // Total payment
    const totalPaymentAgg = await paymentModel.aggregate([
      { $match: { client: clientId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalPayment = totalPaymentAgg[0]?.total || 0;

    // Monthly payment summary
    const monthlyPaymentsAgg = await paymentModel.aggregate([
      { $match: { client: clientId } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyPayments = monthlyPaymentsAgg.map((m) => ({
      month: `${m._id.month}-${m._id.year}`,
      amount: m.amount,
    }));

    return res.status(200).json({
      jobsPosted,
      totalFreelancersApplied,
      proposalStats: { applied, accepted, rejected },
      totalPayment,
      monthlyPayments,
    });
  } catch (error) {
    console.error("Client home data error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  register,
  login,
  addJob,
  updateJob,
  getAllJobs,
  deleteJob,
  proposalReceived,
  proposalStatus,
  editJobs,
  getApplicantsCount,
  getClientTotalFreelancersApplied,
  getClientJobsPosted,
  getClientProposalStats,
};
