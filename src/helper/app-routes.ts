/** Declare  app routes and export*/
export const AppRoutes = {
    login: '/login',
    signup: '/signup',
    register: 'register',
    dashboard: '/',
    onboard: {
        root: '/onboard/*',
        addExamples: '/onboard/:slug',
    },
    team: {
        create: '/create-team',
    },
    workspace: {

        root: '/workspace/*',
        home: '/workspace/:id',
        team: '/workspace/:id/team',
        workspace: '/workspace/:slug/workspace/:id',
    },
    users: {
        root: '/users/*',
        me: '/users/me',
        myTeam: '/users/me/team',
    },

    setting: 'setting',
    notFound: '*',
    maintenance: 'maintenance',
    addTask: '?task=create',
    task: "task",
    comments: "/comments/:category/:id"
};