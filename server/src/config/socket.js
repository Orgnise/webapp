const socketIO = require("socket.io");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authConfig = require("../config/auth.config");
const UserService = require("../services/user.service");

const socket = (server) => {
  console.log("🚀: socket initialized",{'origin':process.env.SOCKET_URL});

  const io = socketIO(server, {
    cors: {
      // origin: process.env.SOCKET_URL,
      methods: ["GET", "POST"],
    },
  });

  // add users to socket itself
  io.users = {};

  io.on("connection", (socket) => {
    console.log(
      chalk.blue("🎢[Socket]"),
      `${socket.id} user just connected!`,
      new Date().toLocaleTimeString()
    );
    socket.use(([event, ...args], next) => {
      console.log(
        "🚥:",
        chalk.red("Event"),
        chalk.blue(event),
        new Date().toLocaleTimeString()
      );
      next();
    });

    socket.on("error", (err) => {
      if (err && err.message === "unauthorized event") {
        socket.disconnect();
      }
      console.log("🚀 ~ file: socket.js ~ line 42 ~ socket.on ~ err", err);
    });
  });

  return io;
};

module.exports = socket;
