import jwt  from "jsonwebtoken";
import clientModel  from "../model/clientModel.js"; // or adminModel if you have separate model

export const authAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only admin can access this route
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access forbidden. Admin only." });
    }

    const admin = await clientModel.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.user = admin;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


