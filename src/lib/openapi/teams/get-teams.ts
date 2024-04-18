import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { TeamSchema } from "@/lib/zod/schemas/teams";

import { ZodOpenApiOperationObject } from "zod-openapi";

export const getTeams: ZodOpenApiOperationObject = {
  operationId: "getTeams",
  "x-speakeasy-name-override": "list",
  summary: "Retrieve a list of team",
  description: "Retrieve a list of team for the authenticated user.",
  responses: {
    "200": {
      description: "A list of team",
      content: {
        "application/json": {
          schema: z.array(TeamSchema),
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["teams"],
  security: [{ token: [] }],
};
