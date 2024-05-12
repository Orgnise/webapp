import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { deleteWorkspaceUserSchema } from "@/lib/zod/schemas/workspaces";
import { ZodOpenApiOperationObject } from "zod-openapi";

export const deleteWorkspace: ZodOpenApiOperationObject = {
  operationId: "getWorkspaceInfo",
  summary: "Delete a workspace",
  description: "Delete a workspace of a team.",
  requestParams: {
    path: z.object({
      team_slug: z.string().describe("The slug of the team."),
      workspace_slug: z.string().describe("The slug of the workspace."),
    }),
  },
  responses: {
    "200": {
      description: "The deleted workspace",
      content: {
        "application/json": {
          schema: deleteWorkspaceUserSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["workspaces"],
  security: [{ token: [] }],
};
