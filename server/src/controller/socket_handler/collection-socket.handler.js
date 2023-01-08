const chalk = require("chalk");
const {UserService,CollectionService} = require("../../services/index");
const ApiResponseHandler = require("../../helper/response/api-response");
const { logError, logSuccess, logWarning, logInfo } = require("../../helper/logger");
module.exports = (io, socket) => {
  
  const UpdateItemParent = async (payload) => {
    // Check if user is authenticated
    if (!io.auth) {
      logWarning("User is not authenticated", "UpdateItemParent ~ line 39");
      socket.emit("auth:authorized", {
        isAuthenticated: false,
        event: "team:create",
        payload: payload,
      });
      return;
    }
    try {
      const user = await UserService.getUserFromJwtToken(io.auth.token);
      payload.user = user;
      const UpdatedItem = await CollectionService.updateItemParent(payload);
      socket.emit("item:update-parent", {
        item:UpdatedItem,
        index:payload.index,
        oldParent:payload.oldParent
      });
      logSuccess(UpdatedItem,"Item Updated successfully");
    }
     catch (error) {
      logError(error, "UpdateItemParent ~ line 26");
      socket.emit("item:update-parent:error", );
      logInfo("Error emitted successfully");
    }
  };

  socket.on("item:update-parent", UpdateItemParent);
};
