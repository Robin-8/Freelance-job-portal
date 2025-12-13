import multer from "multer";

const storage = multer.memoryStorage(); // stores file in req.file.buffer
const upload = multer({ storage });

export default upload;
