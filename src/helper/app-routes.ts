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
    organization: {
        create: '/create-organization',
    },
    workspace: {

        root: '/workspace/*',
        home: '/workspace/:id',
        team: '/workspace/:id/team',
        project: '/workspace/:slug/project/:id',
    },
    users: {
        root: '/users/*',
        me: '/users/me',
        myOrganization: '/users/me/organization',
    },

    setting: 'setting',
    notFound: '*',
    maintenance: 'maintenance',
    addTask: '?task=create',
    task: "task",
    comments: "/comments/:category/:id"
};