const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const connectDb = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.config");
require("dotenv").config();
const YAML = require("yamljs");

// middleware
const mw = require("./middleware/middleware");

const swaggerDocument = YAML.load("./swagger.yaml");

connectDb.connect();

const app = express();
// let’s you use the cookieParser in your application
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(mw());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

module.exports = app;
