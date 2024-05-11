import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { CollectionSchema } from "@/lib/zod/schemas";

import { ZodOpenApiOperationObject } from "zod-openapi";

export const getCollections: ZodOpenApiOperationObject = {
  operationId: "getCollections",
  "x-speakeasy-name-override": "list",
  summary: "Retrieve a list of collections",
  description: "Retrieve a list of collections of the workspace.",
  requestParams: {
    path: z.object({
      team_slug: z.string().describe("The slug of the team."),
      workspace_slug: z.string().describe("The slug of the workspace."),
    }),
  },
  responses: {
    "200": {
      description: "A list of collections",
      content: {
        "application/json": {
          schema: z.array(CollectionSchema),
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["collections"],
  security: [{ token: [] }],
};
