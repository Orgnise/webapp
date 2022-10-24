const chalk = require("chalk");
const app = require("./src/app");
const SocketIO = require("./src/config/socket");
const mw = require("./src//middleware/middleware");
var BoardController = require("./src/routes/board.controller");
var authRouter = require("./src/routes/auth-route");
const errorHandler = require("./src/middleware/handle-error/error-handler");
const UserController = require("./src/routes/user.controller");

const { API_PORT } = require("./src/config/config");

const port = API_PORT;

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const socket = SocketIO(server);
require("./src/config/global");
global.socket = socket;

// global error middleware

app.use("/board", BoardController);
app.use("/auth", UserController);

// Handle unknown routes
app.use("*", function (req, res, next) {
  console.log("Unknown route", req.originalUrl);
  res.status(404).send({ error: "Sorry can't find that!" });
});

// Handling Error
process.on("unhandledRejection", (err) => {
  console.log("❤️‍🔥", chalk.red("[unhandledRejection]"), err);
  console.log(chalk.red("[Message]"), err.message);
  server.close(() => process.exit(1));
});

app.use(errorHandler());
module.exports = socket;
