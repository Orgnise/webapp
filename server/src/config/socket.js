const socketIO = require("socket.io");

module.exports = function(server, Function = (socket) => {}) {
  this.socket = socketIO(server, {
    cors: {
      origin: `http://localhost:3000`,
      methods: ["GET", "POST"],
    },
  });

  this.socket.on("connection", (socket) => {
    console.log(
      `🧑🏼‍⚕️: ${socket.id} user just connected!`,
      new Date().toLocaleTimeString()
    );
    Function(socket);

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log("🔥: A user disconnected");
    });
  });
};
