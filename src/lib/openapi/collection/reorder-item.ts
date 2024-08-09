import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { reorderCollectionResponseSchema, ReorderCollectionSchema } from "@/lib/zod/schemas";

export const reorderItem = {
  operationId: "reorderItem",
  summary: "Reorder a collection/page",
  description: "Reorder a collection/page within or outside a collection. This will change the order of the collection/page in the collection.",
  requestParams: {
    path: z.object({
      team_slug: z.string().describe("The slug of the team."),
      workspace_slug: z.string().describe("The slug of the workspace."),
    }),
  },
  requestBody: {
    content: {
      "application/json": {
        schema: ReorderCollectionSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "Reorder collection/page",
      content: {
        "application/json": {
          schema: reorderCollectionResponseSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["collections"],
  security: [{ token: [] }],
};
