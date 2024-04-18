import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { WorkspaceSchema } from "@/lib/zod/schemas/workspaces";

import { ZodOpenApiOperationObject } from "zod-openapi";

export const getWorkspaces: ZodOpenApiOperationObject = {
  operationId: "getWorkspaces",
  "x-speakeasy-name-override": "list",
  summary: "Retrieve a list of workspace",
  description: "Retrieve a list of workspace for the authenticated user.",
  requestParams: {
    path: z.object({
      team_slug: z.string().describe("The slug of the team."),
    }),
  },
  responses: {
    "200": {
      description: "A list of workspace",
      content: {
        "application/json": {
          schema: z.array(WorkspaceSchema),
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["workspaces"],
  security: [{ token: [] }],
};
