import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { TeamSchema, updateTeamSchema } from "@/lib/zod/schemas/teams";

export const updateTeam = {
  operationId: "updateTeam",
  summary: "update a team",
  description: "Update a team.",
  requestParams: {
    path: z.object({
      team_slug: z.string().describe("The slug of the team."),
    }),
  },
  requestBody: {
    content: {
      "application/json": {
        schema: updateTeamSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "The updated team",
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
