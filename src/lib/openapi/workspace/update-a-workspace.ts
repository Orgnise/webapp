import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { WorkspaceSchema, updateWorkspaceSchema } from "@/lib/zod/schemas/workspaces";

export const updateWorkspace = {
  operationId: "updateWorkspace",
  summary: "update a workspace",
  description: "Update a workspace.",
  requestParams: {
    path: z.object({
      team_slug: z.string().describe("The slug of the team."),
      workspace_slug: z.string().describe("The slug of the workspace.")
    }),
  },
  requestBody: {
    content: {
      "application/json": {
        schema: updateWorkspaceSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "The updated workspace",
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
