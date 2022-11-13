const chalk = require("chalk");
const UserService = require("../../services/user.service");
const CompanyService = require("../../services/company.service");
const ApiResponseHandler = require("../../helper/response/api-response");
const { logError, logSuccess, logInfo } = require("../../helper/logger");
module.exports = (io, socket) => {
  // Register socket handlers
  const getJoinedCompanies = async (payload) => {
    // Check if user is authenticated
    if (!auth) {
      logError("User is not authenticated");
      socket.emit("auth:authorized", false);
      return;
    }
    try {
      const user = await UserService.getUserFromJwtToken(auth.token);
      const list = await CompanyService.getJoinedCompanies(user.id);
      const companies = {
        data: list,
        message: "Company fetched successfully",
        dataKey: "companies",
        total: list.length,
      };
      socket.emit("organization:joined:all:read", companies);
      logSuccess("Company fetched successfully");
    } catch (error) {
      logError(error);
    }
  };

  const createOrganization = async (payload) => {
    // Check if user is authenticated
    if (!io.auth) {
      logError("User is not authenticated", "createOrganization ~ line 36");
      socket.emit("auth:authorized", false);
      return;
    }
    try {
      const user = await UserService.getUserFromJwtToken(io.auth.token);
      const organization = await CompanyService.createCompany(payload, user.id);
      socket.emit("organization:create", organization.toJSON());
      logSuccess(organization.toJSON());
    } catch (error) {
      socket.emit("company:organization:create", error);
      logError(error);
    }
  };

  socket.on("organization:joined:all:read", getJoinedCompanies);
  socket.on("organization:create", createOrganization);
};
