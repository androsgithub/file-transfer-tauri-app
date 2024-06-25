const router = require("express").Router();
const fs = require("fs");

router.get("/", (req, res) => {
  let files = fs.readdirSync("./files");
  res.status(201).json({ files });
});

module.exports = router;
