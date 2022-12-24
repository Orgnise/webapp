
/**
 * Define api endpoints
 */

export const Endpoints = {
    baseUrl: 'http://localhost:4000',
    login: '/login',
    register: '/register',
    logout: '/logout',
    team: {
        get: '/team',
        getAll: '/team/all',
        create: '/team/create',
        update: '/team/update',
        delete: '/team/delete',
        getById: (orgId: string) => `/team/${orgId}`,
        getBySlug: (slug: string) => `/team/slug/${slug}`,
        workspace: (orgId: string) => {
            return {
                getAll: `/team/${orgId}/workspace/all`,
                create: `/team/${orgId}/workspace/create`,
                update: `/team/${orgId}/workspace/update`,
                delete: `/team/${orgId}/workspace/delete`,
                getById: (workspaceId: string) => `/team/${orgId}/workspace/${workspaceId}`,
                addExampleWorkspaces: `/team/${orgId}/workspace/add_examples`,
            }
        },
        workspaceBySlug: (slug: string) => {
            return {
                getAll: `/team/slug/${slug}/workspace/all`,
                addExampleWorkspaces: `/team/slug/${slug}/workspace/add_examples`,
                getBySlug: () => `/workspace/slug/${slug}`,
            }
        }
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