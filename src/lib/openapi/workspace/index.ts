import { ZodOpenApiPathsObject } from "zod-openapi";

import { createWorkspace } from "../workspace/create-workspace";
import { getWorkspaceInfo } from "../workspace/get-workspace-info";
import { getWorkspaces } from "../workspace/get-workspaces";
import { updateWorkspace } from "./update-a-workspace";
import { deleteWorkspace } from "./delete-workspace";

export const workspacePath: ZodOpenApiPathsObject = {
  "/teams/{team_slug}/workspaces": {
    post: createWorkspace,
    get: getWorkspaces,


  },
  "/teams/{team_slug}/workspaces/{workspace_slug}": {
    get: getWorkspaceInfo,
    put: updateWorkspace,
    delete: deleteWorkspace,
  },
};
