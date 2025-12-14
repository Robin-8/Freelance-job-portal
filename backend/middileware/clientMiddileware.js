import jwt from "jsonwebtoken";
import clientModel from "../model/clientModel.js";

export const authClient = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "client") {
      return res
        .status(403)
        .json({ message: "Access forbidden. Only clients allowed." });
    }

    const clientId = decoded.id || decoded.userId;

    const user = await clientModel
      .findById(clientId)
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account is blocked, contact support" });
    }

    req.user = user;
    req.client = user;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
