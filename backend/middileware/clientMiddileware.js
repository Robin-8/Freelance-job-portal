import jwt from "jsonwebtoken";
import clientModel from "../model/clientModel.js";

export const authClient = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "client") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const client = await clientModel.findById(decoded.id).select("-password");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    req.client = client;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

