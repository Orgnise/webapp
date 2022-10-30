const socketIO = require("socket.io");
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
      `🧑🏼‍⚕️: ${socket.id} user just connected!`,
      new Date().toLocaleTimeString()
    );

    socket.on("register-user", async (jwtToken) => {
      // get the user from token
      // try decoding the token
      try {
        const user = await UserService.getUserFromJwtToken(jwtToken);

        // add user to io users
        // make sure io users key is array
        if (!io.users[user.id]) {
          io.users[user.id] = {
            user, // add user
            sockets: [], // add connected sockets here
          };
        }
        // push the socket to user
        io.users[user.id].sockets.push(socket.id);

        // fire a registered event
        socket.emit("registered-user", { id: user.id });
        // log connection
        console.info("SOCKET: user connected!" + user.id);
        return true;
      } catch (error) {
        console.info("SOCKET: user not connected!");
        console.log({ error });
        return false;
      }
    });

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log("🔥: A user disconnected");
    });
  });

  return io;
};

module.exports = socket;
