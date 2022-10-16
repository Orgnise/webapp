const cors = require("cors");
const express = require("express");
const connectDb = require("./config/db");
const mw = require("./middleware/middleware");

connectDb.connect();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(mw());

module.exports = app;
