const jwt = require("jsonwebtoken");
const clientModel = require("../model/clientModel");

const authClient = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🟢 Received token:", token);
  console.log("🔍 [VERIFY] process.env.JWT_SECRET =", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "client") {
      return res
        .status(403)
        .json({ message: "Access forbidden. Only Clients can post jobs." });
    }
    const user = await clientModel.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authClient };
