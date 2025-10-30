const { genSalt } = require("bcrypt");
const clientModel = require("../model/clientModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../jwt/jwt");

const register = async (req, res) => {
  const { name, email, password, role, companyName, profileImage } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userExisting = await clientModel.findOne({ email });
    if (userExisting) {
      return res
        .status(400)
        .json({ message: "User already register with this email" });
    }
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
    
    return res
      .status(200)
      .json({ message: "user saved successfully", user: newUser, token });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExisting = await clientModel.findOne({ email });
    if (!userExisting) {
      return res.status(401).json({ message: "invalid password or email" });
    }
    const isMatch = await bcrypt.compare(password, userExisting.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is not matching" });
    }
    const token = await generateToken(userExisting);
    
    return res.status(200).json({
      message: "Login successfull",
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

module.exports = { register, login };
