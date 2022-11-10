const UserService = require("../../services/user.service");
const CompanyService = require("../../services/company.service");
const ApiResponseHandler = require("../../helper/response/api-response");
module.exports = (auth, socket) => {
  // Register socket handlers
  const getJoinedCompanies = async (payload) => {
    // Check if user is authenticated
    if (!auth) {
      socket.emit("auth:authorized", false);
      return;
    }
    try {
      console.log("SOCKET:", auth.token);
      const user = await UserService.getUserFromJwtToken(auth.token);
      const list = await CompanyService.getJoinedCompanies(user.id);
      const companies = {
        data: list,
        message: "Company fetched successfully",
        dataKey: "companies",
        total: list.length,
      };
      socket.emit("company:joined:all:read", companies);
    } catch (error) {
      socket.emit("company:joined:all:read", error);
    }
  };

  socket.on("company:joined:all:read", getJoinedCompanies);
};
