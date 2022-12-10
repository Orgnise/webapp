/** Declare  app routes and export*/
export const AppRoutes = {
    login: '/login',
    signup: '/signup',
    register: 'register',
    dashboard: '/',
    onboard: {
        root: '/onboard/*',
        step1: '/onboard/:id/step1',
    },
    organization: {
        root: 'organization/*',
        allOrganizations: '/organizations',
        detail: '/organization/:id',
    },
    workspace: {
        root: '/workspace/*',
        home: '/workspace/:id',
        team: '/workspace/:id/team',
        project: '/workspace/:id/project',
    },

    setting: 'setting',
    notFound: '*',
    maintenance: 'maintenance',
    addTask: '?task=create',
    task: "task",
    comments: "/comments/:category/:id"
};