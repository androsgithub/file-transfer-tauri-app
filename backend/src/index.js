const express = require("express");
const server = require("./server");

const app = express();

app.use(server);
