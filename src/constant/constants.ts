/**
 * Define api endpoints
 */

export const Endpoints = {
    baseUrl: 'http://localhost:4000',
    login: '/login',
    register: '/register',
    logout: '/logout',
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