const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "/config/.env") });
const cors = require("cors");

const server = express();

const routes = require("./routes/routes");

server.use(cors());

server.use("/files", express.static("files"));

server.use("/files", routes);

server.listen(process.env.PORT || 3000, "0.0.0.0");

module.exports = server;
