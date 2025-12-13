// middleware/authFreelancer.js
import jwt  from "jsonwebtoken";
import User from "../model/clientModel.js";

export const authFreelancer = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "freelancer") {
      return res.status(403).json({ message: "Access forbidden. Only Freelancers can apply." });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isBlocked) {
  return res.status(403).json({ message: "Your account is blocked, contact support" });
}


    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

