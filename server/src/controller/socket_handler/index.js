const CompanySocketHAndler = require("./organization-socket.handler");
const UserSocketHAndler = require("./user-socket.handler");

module.exports = (io, socket) => {
  // Register socket handlers
  UserSocketHAndler(io, socket);
  CompanySocketHAndler(io, socket);
};
