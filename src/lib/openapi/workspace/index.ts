import { ZodOpenApiPathsObject } from "zod-openapi";

import { createWorkspace } from "../workspace/create-workspace";
import { getWorkspaces } from "../workspace/get-workspaces";
import { getWorkspaceInfo } from "../workspace/get-workspace-info";

export const workspacePath: ZodOpenApiPathsObject = {
  "/teams/{team_slug}/workspaces": {
    post: createWorkspace,
    get: getWorkspaces,
  },
  "/teams/{team_slug}/workspaces/{workspace_slug}": {
    get: getWorkspaceInfo,
  },
};
