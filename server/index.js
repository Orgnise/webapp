const app = require("./src/app");
const socket = require("./src/config/socket");
const mw = require("./src//middleware/middleware");
var TaskRouter = require("./src/routes/task-route");
var authRouter = require("./src/routes/auth-route");

const { API_PORT } = require("./src/config/config");

const port = API_PORT;

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const taskRouter = new TaskRouter();
new socket(server, (socket) => {
  taskRouter.initSocket(socket);
});

app.use("/task", taskRouter.router);
app.use("/auth", authRouter);

// Handling Error
process.on("unhandledRejection", (err) => {
  console.log(`❤️‍🔥 [unhandledRejection] An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = socket;
