const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    const allowedExtensions = /jpeg|jpg|png|webp/i;
    const extName = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (allowedMimeTypes.includes(file.mimetype) || extName) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WEBP and JPG files are allowed"));
    }
  },
});

module.exports = upload;
