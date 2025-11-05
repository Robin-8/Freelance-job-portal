const bcrypt = require("bcrypt");
const User = require("../model/clientModel");
const { generateToken } = require("../jwt/jwt");


const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body,"bod here")

  try {
    const adminExisting = await User.findOne({ email });
    if (adminExisting) {
      return res
        .status(400)
        .json({ message: "Admin already registered with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin", // force admin role
    });

    await newAdmin.save();

    const token = generateToken(newAdmin);

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
      token,
    });
  } catch (error) {
    console.error("Admin Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminExisting = await User.findOne({ email });
    if (!adminExisting || adminExisting.role !== "admin") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, adminExisting.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(adminExisting);

    return res.status(200).json({
      message: "Login successful",
      admin: {
        id: adminExisting._id,
        name: adminExisting.name,
        email: adminExisting.email,
        role: adminExisting.role,
      },
      token,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
