import { openApiErrorResponses } from "@/lib/openapi/responses";
import { TeamSchema, createTeamSchema } from "@/lib/zod/schemas/teams";

export const createTeam = {
  operationId: "createTeam",
  "x-speakeasy-name-override": "create",
  summary: "Create a team",
  description: "Create a new team for the authenticated user.",
  requestBody: {
    content: {
      "application/json": {
        schema: createTeamSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "The created team",
      content: {
        "application/json": {
          schema: TeamSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["teams"],
  security: [{ token: [] }],
};
