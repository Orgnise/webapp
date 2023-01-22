const TeamSocketHandler = require("./team-socket.handler");
const UserSocketHAndler = require("./user-socket.handler");
const CollectionSocketHandler = require("./collection-socket.handler");

module.exports = (io, socket) => {
  // Register socket handlers
  UserSocketHAndler(io, socket);
  TeamSocketHandler(io, socket);
  CollectionSocketHandler(io, socket);
};
