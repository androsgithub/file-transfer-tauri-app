const router = require("express").Router();
const upload_route = require("./upload-route");
const see_all_files_route = require("./see-all-files");

router.use("/", upload_route);
router.use("/", see_all_files_route);

module.exports = router;
