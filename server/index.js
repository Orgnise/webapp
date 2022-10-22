const chalk = require("chalk");
const app = require("./src/app");
const socket = require("./src/config/socket");
const mw = require("./src//middleware/middleware");
var TaskRouter = require("./src/routes/task-route");
var authRouter = require("./src/routes/auth-route");
const errorHandler = require("./src/middleware/handle-error/error-handler");
const UserController = require("./src/routes/user.controller");

const { API_PORT } = require("./src/config/config");

const port = API_PORT;

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const taskRouter = new TaskRouter();
new socket(server, (socket) => {
  taskRouter.initSocket(socket);
});

// global error middleware

app.use("/board", taskRouter.router);
app.use("/auth", authRouter);
app.use("/users", UserController);

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
