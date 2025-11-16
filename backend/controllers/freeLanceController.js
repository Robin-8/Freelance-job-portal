const bcrypt = require("bcrypt");
const { generateToken } = require("../jwt/jwt");
const User = require("../model/clientModel");
const jobModel = require("../model/jobModel");
const proposalModel = require("../model/proposalModel");
const clientModel = require("../model/clientModel");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Freelance already registered with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "freelancer",
    });

    await newUser.save();

    const token = await generateToken(newUser);
    console.log(token, "token here");
    return res.status(201).json({
      message: "Freelance registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
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
        id: existingUser._id,
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
  const {id}=req.params
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
  const id = req.params.id;
  const freelancerId = req.user.id;
  const { coverLetter, bidAmount } = req.body;

  try {
    const job = await jobModel.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Create proposal
    const proposal = await proposalModel.create({
      job: id,
      freelancer: freelancerId,
      coverLetter,
      bidAmount,
    });

    // Increment proposal count WITHOUT re-validating the job
    await jobModel.updateOne(
      { _id: id },
      { $inc: { proposalsCount: 1 } }
    );

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
    const { name, email, skills } = req.body;

    const update = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, skills },
      {
        new: true,
      }
    );
    if(!update){
      return res.status(401).json({message:"no user found with this id"})
    }
    return res.status(200).json({message:"user updated successfully",update})
  } catch (error) {
    return res.status(500).json({message:"internal server error",error})
  }
};

const withdrawProposal = async(req,res)=>{
  const {proposalId}=req.params
  try {
    const preposal = await proposalModel.findOne({
      _id: proposalId,
      freelancer: req.user._id
    });
    if(!preposal){
      return res.status(201).json({message:"no job found"})
    }
    await preposal.deleteOne()
    return res.status(200).json({message:"job preposal deleted successfully"})
  } catch (error) {
     return res.status(500).json({message:"internal server error",error})
  }
}
module.exports ={register, login, getJobs, applyJobs, getAllPreposals, updateProfile, withdrawProposal, getJobById};
