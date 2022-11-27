export const SocketEvent = {
    // Socket events
    connect: 'connect',
    disconnect: 'disconnect',
    // Socket events for organization
    organization: {
        create: 'organization:create',
        update: 'organization:update',
        delete: 'organization:delete',
        get: 'organization:get',
        getAll: 'organization:getAll',
        project: {
            create: 'organization:project:create',
        }
    },

    // Socket events for board
    board: {
        create: 'board:create',
        update: 'board:update',
        delete: 'board:delete',
        get: 'board:get',
    },
    // Socket events for tasks
    tasks: {
        create: 'tasks:create',
        update: 'tasks:update',
        delete: 'tasks:delete',
        get: 'tasks:get',
    },
    // Socket events for auth
    auth: {
        login: 'auth:login',
        register: 'auth:register',
        logout: 'auth:logout',
        checkAuth: "auth:authorized"
    },

};