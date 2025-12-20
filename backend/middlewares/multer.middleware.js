const multer = require("multer");
const path = require("path");
const fs = require("fs");

// absolute path to media folder
const uploadDir = path.join(__dirname, "../media");

// ensure folder exists (VERY IMPORTANT for Render)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
