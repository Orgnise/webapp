
/**
 * Define api endpoints
 */

export const Endpoints = {
    baseUrl: 'http://localhost:4000',
    login: '/login',
    register: '/register',
    logout: '/logout',
    organization: {
        get: '/organization',
        getAll: '/organization/all',
        create: '/organization/create',
        update: '/organization/update',
        delete: '/organization/delete',
        getById: (orgId: string) => `/organization/${orgId}`,
        project: (orgId: string) => {
            return {
                getAll: `/organization/${orgId}/project/all`,
                create: `/organization/${orgId}/project/create`,
                update: `/organization/${orgId}/project/update`,
                delete: `/organization/${orgId}/project/delete`,
                getById: (projectId: string) => `/organization/${orgId}/project/${projectId}`,
            }
        },
    },


    board: {
        create: '/board/create',
        update: '/board/update',
        delete: '/board/delete',
        get: 'board/get',
    },
    tasks: {
        create: '/tasks/create',
        update: '/tasks/update',
        delete: '/tasks/delete',
        get: '/tasks',
    },
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
    }
}