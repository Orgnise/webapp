/**
 * Define api endpoints
 */

export const Endpoints = {
  baseUrl: process.env.REACT_APP_BASE_URL || "http://localhost:4000",
  login: "/login",
  register: "/register",
  logout: "/logout",
  team: {
    get: "/team",
    getAll: "/team/all",
    create: "/team/create",
    update: "/team/update",
    delete: "/team/delete",
    getById: (orgId: string) => `/team/${orgId}`,
    getBySlug: (slug: string) => `/team/slug/${slug}`,
    workspace: (orgId: string) => {
      return {
        getAll: `/team/${orgId}/workspace/all`,
        create: `/team/${orgId}/workspace/create`,
        update: `/team/${orgId}/workspace/update`,
        delete: `/team/${orgId}/workspace/delete`,
        getById: (workspaceId: string) =>
          `/team/${orgId}/workspace/${workspaceId}`,
        addExampleWorkspaces: `/team/${orgId}/workspace/add_examples`,
      };
    },
    workspaceBySlug: (slug: string) => {
      return {
        getAll: `/team/slug/${slug}/workspace/all`,
        addExampleWorkspaces: `/team/slug/${slug}/workspace/add_examples`,
        getBySlug: () => `/workspace/slug/${slug}`,
        updateBySlug: `/workspace/slug/${slug}`,
      };
    },
  },
  collection: {
    create: "/items",
    delete: (id: String) => `/items/${id}`,
    update: (id: string) => `/items/${id}`,
    getAll: ({ teamId, parent, workspaceId, object, limit, query }: any) =>
      `/items?teamId=${teamId}&workspaceId=${workspaceId}&parent=${parent}&object=${object}&limit=${limit}&query=${query}`,
    getCollectionById: (id: string) => `/items/${id}`,
  },

  board: {
    create: "/board/create",
    update: "/board/update",
    delete: "/board/delete",
    get: "board/get",
  },
  tasks: {
    create: "/tasks/create",
    update: "/tasks/update",
    delete: "/tasks/delete",
    get: "/tasks",
  },
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
};
