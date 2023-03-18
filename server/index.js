const chalk = require("chalk");
const app = require("./src/app");
const SocketIO = require("./src/config/socket");
const mw = require("./src//middleware/middleware");
const errorHandler = require("./src/middleware/handle-error/error-handler");
const {
  UserController,
  TeamController,
  WorkspaceController,
  CollectionController,
} = require("./src/controller");
const SocketHandler = require("./src/controller/socket_handler");

const { API_PORT } = require("./src/config/config");

const server = app.listen(API_PORT, () => {
  console.log(`Server listening on ${API_PORT}`);
});

const io = SocketIO(server);
require("./src/config/global");

// Register socket handlers
io.on("connection", (socket) => {
  SocketHandler(io, socket);
  global.socket = socket;
  global.io = io;
});

// global error middleware
app.use("/", UserController);
app.use("/", TeamController);
app.use("/", WorkspaceController);
app.use("/", CollectionController);

// Handle unknown routes
app.use("*", function (req, res, next) {
  console.log("Unknown route", req.originalUrl);
  res.status(404).send({ error: "Sorry can't find that!" });
});

// Handling Error
process.on("unhandledRejection", (err) => {
  console.log("❤️‍🔥", chalk.red("[unhandledRejection]"), err);
  console.log(chalk.red("[Message]"), err?.message || err?.error || err);
  server.close(() => process.exit(1));
});

app.use(errorHandler());
module.exports = io;
