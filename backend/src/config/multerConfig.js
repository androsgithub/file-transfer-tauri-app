const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve("files"));
  },
  filename: (req, file, callback) => {
    const name = `${new Date().getTime()}_${file.originalname}`;
    callback(null, name);
  },
});

module.exports = { storage };
