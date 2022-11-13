const CompanySocketHAndler = require("./company-socket.handler");
const UserSocketHAndler = require("./user-socket.handler");

module.exports = (io, socket) => {
  // Register socket handlers
  UserSocketHAndler(io, socket);
  CompanySocketHAndler(io, socket);
};
