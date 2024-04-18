import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { TeamSchema } from "@/lib/zod/schemas/teams";
import { ZodOpenApiOperationObject } from "zod-openapi";

export const getTeamInfo: ZodOpenApiOperationObject = {
  operationId: "getTeamInfo",
  "x-speakeasy-name-override": "get",
  summary: "Retrieve a team",
  description: "Retrieve a team for the authenticated user.",
  requestParams: {
    path: z.object({
      team_slug: z.string().describe("The slug of the team."),
    }),
  },
  responses: {
    "200": {
      description: "The retrieved team",
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
