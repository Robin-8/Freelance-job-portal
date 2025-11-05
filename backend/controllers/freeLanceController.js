
const bcrypt =require('bcrypt')
const { generateToken } = require("../jwt/jwt");
const User = require("../model/clientModel");
const jobModel = require('../model/jobModel');

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
    console.log(token,'token here')
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

const getJobs = async(req,res)=>{
    try {
        const jobs = await jobModel.find({isDeleted:false})
        if(!jobs){
            return res.status(401).json({message:"No jobs finded"})
        }
        return res.status(200).json({message:'Here is all jobs',jobs})
    } catch (error) {
        return res.status(500).json({message:'internal server error'})
    }
}

module.exports = { register, login,getJobs };

