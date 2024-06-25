const router = require("express").Router();
const multer = require("multer");
const storage = require("../config/multerConfig").storage;
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  res.status(201).json(req.file);
});

module.exports = router;
