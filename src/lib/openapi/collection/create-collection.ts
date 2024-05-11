import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { CollectionSchema, CreateCollectionSchema } from "@/lib/zod/schemas";

export const createCollection = {
  operationId: "createCollection",
  "x-speakeasy-name-override": "create",
  summary: "Create a collection/page",
  description: "Create a new collection. Collections group related pages together. A collection can have as many as sub-collection or pages as you want, allowing you to organize your content in a flexible way. ",
  requestParams: {
    path: z.object({
      team_slug: z.string().describe("The slug of the team."),
      workspace_slug: z.string().describe("The slug of the workspace."),
    }),
  },
  requestBody: {
    content: {
      "application/json": {
        schema: CreateCollectionSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "The created collection/page",
      content: {
        "application/json": {
          schema: CollectionSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["collections"],
  security: [{ token: [] }],
};
