import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { WorkspaceSchema } from "@/lib/zod/schemas/workspaces";
import { ZodOpenApiOperationObject } from "zod-openapi";

export const getWorkspaceInfo: ZodOpenApiOperationObject = {
  operationId: "getWorkspaceInfo",
  "x-speakeasy-name-override": "get",
  summary: "Retrieve a workspace",
  description: "Retrieve a workspace for the authenticated user.",
  requestParams: {
    path: z.object({
      team_slug: z.string().describe("The slug of the team."),
      workspace_slug: z.string().describe("The slug of the workspace."),
    }),
  },
  responses: {
    "200": {
      description: "The retrieved workspace",
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
