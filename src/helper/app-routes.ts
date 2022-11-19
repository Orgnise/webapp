/** Declare  app routes and export*/
export const AppRoutes = {
    login: '/login',
    signup: '/signup',
    register: 'register',
    dashboard: '/',
    organization: '/organization/:id',
    setting: 'setting',
    notFound: '*',
    maintenance: 'maintenance',
    addTask: '?task=create',
    task: "task",
    comments: "/comments/:category/:id"
};