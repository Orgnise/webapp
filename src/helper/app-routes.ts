/** Declare  app routes and export*/
export const AppRoutes = {
    login: '/login',
    signup: '/signup',
    register: 'register',
    dashboard: '/',
    onboard: {
        root: '/onboard/*',
        step1: '/onboard/:id/onboarding-projects',
    },
    organization: {
        root: 'organization/*',
        allOrganizations: '/organizations',
        detail: '/organization/:id',
        create: '/create-organization',
    },
    workspace: {
        root: '/workspace/*',
        home: '/workspace/:id',
        team: '/workspace/:id/team',
        project: '/workspace/:id/project',
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