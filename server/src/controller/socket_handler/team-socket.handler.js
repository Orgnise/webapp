const chalk = require("chalk");
const UserService = require("../../services/user.service");
const TeamService = require("../../services/team.service");
const ApiResponseHandler = require("../../helper/response/api-response");
const { logError, logSuccess, logWarning } = require("../../helper/logger");
module.exports = (io, socket) => {
  // Register socket handlers
  const getJoinedTeams = async (payload) => {
    // Check if user is authenticated
    if (!io.auth) {
      logError("User is not authenticated", "getJoinedTeams ~ line 16");
      socket.emit("auth:authorized", false);
      return;
    }
    try {
      const user = await UserService.getUserFromJwtToken(io.auth.token);
      const list = await TeamService.getJoinedTeams(user.id);
      const teams = {
        data: list,
        message: "Team fetched successfully",
        dataKey: "teams",
        total: list.length,
      };
      socket.emit("team:joined:all:read", teams);
      logSuccess("Team fetched successfully");
    } catch (error) {
      logError(error, "getJoinedTeams ~ line 32");
    }
  };

  const createTeam = async (payload) => {
    // Check if user is authenticated
    if (!io.auth) {
      logWarning("User is not authenticated", "createTeam ~ line 39");
      socket.emit("auth:authorized", {
        isAuthenticated: false,
        event: "team:create",
        payload: payload,
      });
      return;
    }
    try {
      const user = await UserService.getUserFromJwtToken(io.auth.token);
      const team = await TeamService.createTeam(payload, user.id);
      socket.emit("team:create", team.toJSON());
      logSuccess("Team created successfully");
    } catch (error) {
      socket.emit("team:create", error);
      logError(error, "createTeam ~ line 50");
    }
  };

  socket.on("team:joined:all:read", getJoinedTeams);
  socket.on("team:create", createTeam);
};
