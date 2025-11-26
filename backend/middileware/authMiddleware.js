const jwt = require("jsonwebtoken");
const clientModel = require("../model/clientModel");

// Universal auth for client, freelancer, and admin
const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Accept any valid role: client, freelancer, or admin
    if (!["client", "freelancer", "admin"].includes(decoded.role)) {
      return res.status(403).json({ message: "Invalid user role" });
    }

    const user = await clientModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account is blocked, contact support" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authUser };
