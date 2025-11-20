const bcrypt =require('bcrypt')
const adminModel =require('../model/clientModel');
const { generateToken } = require('../jwt/jwt');
const clientModel = require('../model/clientModel');



const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const adminExisting = await adminModel.findOne({ email });
    if (adminExisting) {
      return res
        .status(400)
        .json({ message: "Admin already registered with this email" });
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

const login = async (req, res) => {
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
        id: adminExisting._id,
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

const getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: "client" });

    return res.status(200).json({
      message: "All clients fetched",
      clients,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getFreelancers=async()=>{
  try {
    const freelancer = await clientModel.find({role:"freelancer"})
    res.status(200).json({message:"All freelancer fetched",freelancer})
  } catch (error) {
      return res.status(500).json({ message: "Server error", error });
  }
}
module.exports={register,login, getClients, getFreelancers}