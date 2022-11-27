const socketIO = require("socket.io");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authConfig = require("../config/auth.config");
const UserService = require("../services/user.service");

const socket = (serer) => {
  console.log("🚀: socket initialized");

  const io = socketIO(serer, {
    cors: {
      origin: `http://localhost:3000`,
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
      // if (isUnauthorized(event)) {
      //   return next(new Error("unauthorized event"));
      // }
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
      console.log("🚀 ~ file: socket.js ~ line 36 ~ socket.on ~ err", err);
    });
  });

  // in a middleware

  // io.on("connection", (socket) => {
  //   console.log(
  //     `🧑🏼‍⚕️: ${socket.id} user just connected!`,
  //     new Date().toLocaleTimeString()
  //   );

  //   socket.use(([event, ...args], next) => {
  //     // if (isUnauthorized(event)) {
  //     //   return next(new Error("unauthorized event"));
  //     // }
  //     console.log("⚡️ Event: ", event, args);
  //     next();
  //   });

  //   socket.on("error", (err) => {
  //     if (err && err.message === "unauthorized event") {
  //       socket.disconnect();
  //     }
  //   });

  //   socket.on("register-user", async (data) => {
  //     // get the user from token
  //     // try decoding the token
  //     try {
  //       const { jwtToken } = data;
  //       const user = await UserService.getUserFromJwtToken(jwtToken);

  //       // add user to io users
  //       // make sure io users key is array
  //       if (!io.users[user.id]) {
  //         io.users[user.id] = {
  //           user, // add user
  //           sockets: [], // add connected sockets here
  //         };
  //       }
  //       // push the socket to user
  //       io.users[user.id].sockets.push(socket.id);
  //       socket.join("register-user");

  //       // fire a registered event
  //       socket.emit("registered-user", { user });
  //       // log connection
  //       console.info("SOCKET: user connected!" + user.id);
  //       return true;
  //     } catch (error) {
  //       console.info("SOCKET: user not connected!");
  //       console.log({ error });
  //       return false;
  //     }
  //   });

  //   // Get user from token
  //   socket.on("get-user", async () => {
  //     // try decoding the token
  //     try {
  //       console.log("SOCKET:", io.users);
  //       // const user = await UserService.getUserFromJwtToken(jwtToken);
  //       // fire a registered event
  //       // socket.emit("get-user-profile", { socket });
  //       // log connection
  //       // console.info("SOCKET: user connected!" + user.id);
  //       // return user;
  //     } catch (error) {
  //       console.info("SOCKET: user not connected!");
  //       console.log({ error });
  //       return false;
  //     }
  //   });

  //   socket.on("disconnect", () => {
  //     socket.disconnect();
  //     console.log("🔥: A user disconnected");
  //   });
  // });

  return io;
};

module.exports = socket;
