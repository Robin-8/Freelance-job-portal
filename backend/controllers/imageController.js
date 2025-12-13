import imagekit from "../utils/imagekit.js"; // your configured ImageKit SDK

export const getImageKitAuth = (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.status(200).json(result);
  } catch (err) {
    console.error("ImageKit Auth Error:", err);
    res.status(500).json({ message: "Failed to get ImageKit auth" });
  }
};
