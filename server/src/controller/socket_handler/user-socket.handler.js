const {
  logError,
  logInfo,
  logWarning,
  logSuccess,
} = require("../../helper/logger");
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
      logInfo("user connected!" + user.id, "Socket");
      return true;
    } catch (error) {
      socket.emit("auth:authorized", error);
      logError("User is not authenticated", "registerUser ~ line 31");
    }
  };

  const getUser = async () => {
    try {
      if (io.auth) {
        const user = await UserService.getUserFromJwtToken(io.auth.token);
        socket.emit("auth:read", user.userWithoutPassword());
        logSuccess("User fetched successfully", "getUser ~ line 40");
      } else {
        socket.emit("auth:authorized", false);
        logWarning("User is not authenticated", "getUser ~ line 43");
      }
    } catch (error) {
      socket.emit("auth:authorized", error);
      logError(error, "getUser ~ line 47");
    }
  };

  socket.on("auth:register", registerUser);
  socket.on("auth:read", getUser);
};
