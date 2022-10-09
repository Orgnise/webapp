const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
var taskRouter = require("./src/routes/task-route");
var authRouter = require("./src/routes/auth-route");
const mw = require("./src/middleware/middleware");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const router = new taskRouter();

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const socket = socketIO(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (socket) => {
  console.log(
    `⚡: ${socket.id} user just connected!`,
    new Date().toLocaleTimeString()
  );
  router.initSocket(socket);

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.use(mw());
app.use("/task", router.router);
app.use("/users", authRouter);

module.exports = socket;
