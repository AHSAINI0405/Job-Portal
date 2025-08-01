const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Absolute project root
const rootDir = path.join(__dirname, "public", "uploads");

// ✅ Ensure destination folders exist
const ensureDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const imagePath = path.join(rootDir, "images");
const resumePath = path.join(rootDir, "resumes");

ensureDirectory(imagePath);
ensureDirectory(resumePath);

// ✅ File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const allowedPdfType = /pdf/;

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedImageTypes.test(ext) || allowedPdfType.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and PDF files are allowed!"));
  }
};

// ✅ Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const mime = file.mimetype;
    if (mime === "application/pdf") {
      cb(null, resumePath); // resumes folder
    } else {
      cb(null, imagePath); // images folder
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + file.fieldname + ext;
    cb(null, uniqueName);
  }
});

// ✅ Multer instance
const upload = multer({
  storage,
  fileFilter
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "resume", maxCount: 1 }
]);

module.exports = upload;
