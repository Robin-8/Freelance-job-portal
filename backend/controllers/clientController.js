const bcrypt = require("bcrypt");
const clientModel = require("../model/clientModel");
const jobModel = require("../model/jobModel");
const { generateToken } = require("../jwt/jwt");
const proposalModel = require("../model/proposalModel");

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
    if (!title || !description || !budget || !deadline) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not found or unauthorized" });
    }

    
    const newJob = await jobModel.create({
      title,
      description,
      skillsRequired,
      budgetType,
      budget,
      deadline,
      postedBy: req.user._id,
    });

    return res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    console.error("Add Job Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, description, skillsRequired, budgetType, budget, deadline } = req.body;

  const updatedJobData = { title, description, skillsRequired, budgetType, budget, deadline };

  try {
    const updatedJob = await jobModel.findByIdAndUpdate(id, updatedJobData, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job updated successfully', updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const deleteJob = async (req, res) => {
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

const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find({ isDeleted: false });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const proposalReceived =async(req,res)=>{

   try {
    const jobs = await jobModel.find({postedBy:req.user._id})
    if(!jobs || jobs.length<0){
      return res.status(403).json({message:"job not found"})
    }
    const jobId = jobs.map(job=>job._id)

    const preposal = await proposalModel.find({job:{$in:jobId}}).populate("freelancer", "name email ") 
      .populate("job", "title budget deadline")
      .sort({ createdAt: -1 });

      if(preposal.length==0){
        return res.status(401).json({message:'no preposal'})
      }
      return res.status(200).json({message:"Preposal fetched successfully",preposal})
   } catch (error) {
    console.log(error)
    return res.status(500).json({message:"internal server error",error})
   }
}



module.exports = { register, login, addJob, updateJob, getAllJobs, deleteJob, proposalReceived};
