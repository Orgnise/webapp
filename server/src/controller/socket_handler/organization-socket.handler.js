const chalk = require("chalk");
const UserService = require("../../services/user.service");
const CompanyService = require("../../services/organization.service");
const ApiResponseHandler = require("../../helper/response/api-response");
const { logError, logSuccess, logWarning } = require("../../helper/logger");
module.exports = (io, socket) => {
  // Register socket handlers
  const getJoinedCompanies = async (payload) => {
    // Check if user is authenticated
    if (!auth) {
      logError("User is not authenticated", "getJoinedCompanies ~ line 16");
      socket.emit("auth:authorized", false);
      return;
    }
    try {
      const user = await UserService.getUserFromJwtToken(auth.token);
      const list = await CompanyService.getJoinedCompanies(user.id);
      const companies = {
        data: list,
        message: "Organization fetched successfully",
        dataKey: "companies",
        total: list.length,
      };
      socket.emit("organization:joined:all:read", companies);
      logSuccess("Organization fetched successfully");
    } catch (error) {
      logError(error, "getJoinedCompanies ~ line 32");
    }
  };

  const createOrganization = async (payload) => {
    // Check if user is authenticated
    if (!io.auth) {
      logWarning("User is not authenticated", "createOrganization ~ line 39");
      socket.emit("auth:authorized", {
        isAuthenticated: false,
        event: "organization:create",
        payload: payload,
      });
      return;
    }
    try {
      const user = await UserService.getUserFromJwtToken(io.auth.token);
      const organization = await CompanyService.createCompany(payload, user.id);
      socket.emit("organization:create", organization.toJSON());
      logSuccess("Organization created successfully");
    } catch (error) {
      socket.emit("organization:create", error);
      logError(error, "createOrganization ~ line 50");
    }
  };

  socket.on("organization:joined:all:read", getJoinedCompanies);
  socket.on("organization:create", createOrganization);
};
