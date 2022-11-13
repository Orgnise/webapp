const { logError, logInfo, logWarning } = require("../../helper/logger");
const UserService = require("../../services/user.service");
module.exports = (io, socket) => {
  // Register socket handlers
  const registerUser = async (payload) => {
    // get the user from token
    // try decoding the token
    try {
      const { jwtToken } = payload;
      const user = await UserService.getUserFromJwtToken(jwtToken);
      user.token = jwtToken;
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
      io.auth = user;

      // fire a registered event
      socket.emit("auth:register", user.userWithoutPassword());
      // log connection
      logInfo("SOCKET: user connected!" + user.id);
      return true;
    } catch (error) {
      socket.emit("auth:authorized", error);
      logError("User is not authenticated");
    }
  };

  const getUser = async () => {
    console.log("SOCKET:", io.auth);

    try {
      if (io.auth) {
        console.log("SOCKET:", io.auth.token);
        const user = await UserService.getUserFromJwtToken(io.auth.token);
        socket.emit("auth:read", user.userWithoutPassword());
      } else {
        socket.emit("auth:authorized", false);
        logWarning("User is not authenticated");
      }
    } catch (error) {
      socket.emit("auth:authorized", error);
      logError({ error });
    }
  };

  socket.on("auth:register", registerUser);
  socket.on("auth:read", getUser);
};
