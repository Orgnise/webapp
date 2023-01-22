export const SocketEvent = {
  // Socket events
  connect: "connect",
  disconnect: "disconnect",
  // Socket events for team
  team: {
    create: "team:create",
    update: "team:update",
    delete: "team:delete",
    get: "team:get",
    getAll: "team:getAll",
    workspace: {
      create: "team:workspace:create",
    },
  },

  // Socket events for board
  board: {
    create: "board:create",
    update: "board:update",
    delete: "board:delete",
    get: "board:get",
  },
  item: {
    updateParent: "item:update-parent",
    updateParentError: "item:update-parent:error",
  },
  // Socket events for tasks
  tasks: {
    create: "tasks:create",
    update: "tasks:update",
    delete: "tasks:delete",
    get: "tasks:get",
  },
  // Socket events for auth
  auth: {
    login: "auth:login",
    register: "auth:register",
    logout: "auth:logout",
    checkAuth: "auth:authorized",
  },
};
