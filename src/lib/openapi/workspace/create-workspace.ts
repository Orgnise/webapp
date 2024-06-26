import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { WorkspaceSchema, createWorkspaceSchema } from "@/lib/zod/schemas/workspaces";

export const createWorkspace = {
  operationId: "createWorkspace",
  "x-speakeasy-name-override": "create",
  summary: "Create a workspace",
  description: "Create a new workspace. Workspaces are collections of projects and tasks. Workspaces can be private or public. Private workspaces are only visible to members of the workspace.",
  requestParams: {
    path: z.object({
      team_slug: z.string().describe("The slug of the team.")
    }),
  },
  requestBody: {
    content: {
      "application/json": {
        schema: createWorkspaceSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "The created workspace",
      content: {
        "application/json": {
          schema: WorkspaceSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["workspaces"],
  security: [{ token: [] }],
};
