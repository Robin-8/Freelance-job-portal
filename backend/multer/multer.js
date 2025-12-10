// upload.middleware.js (Example)
const multer = require('multer');

const storage = multer.memoryStorage(); // IMPORTANT: Stores file in memory (req.file.buffer)
const upload = multer({ storage: storage });

module.exports = upload;