
import { ZodOpenApiObject } from "zod-openapi";
import { openApiErrorResponses } from "./responses";
import { API_DOMAIN } from "../constants/constants";
import { TeamSchema } from "../zod/schemas/teams";
import { workspacePath } from "./workspace";
import { teamsPath } from "./teams";
import { collectionsPath } from "./collection";
import { CollectionSchema, WorkspaceSchema } from "../zod/schemas";

export const openApiObject: ZodOpenApiObject = {
  openapi: "3.0.3",
  info: {
    title: "Orgnise API",
    description: "Streamline your work with our all-in-one knowledge, doc, and project management system.",
    version: "0.0.1",
    contact: {
      name: "Orgnise Support",
      email: "orgnisehq@gmail.com",
      url: "http://docs.orgnise.in/api-reference/introduction",
    },
    license: {
      name: "AGPL-3.0 license",
      url: "https://github.com/Orgnise/webapp/blob/main/LICENSE.md",
    },
  },
  servers: [
    {
      url: `https://api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
      description: "Production API",
    },
  ],
  paths: {
    ...teamsPath,
    ...workspacePath,
    ...collectionsPath,
  },
  components: {
    schemas: {
      TeamSchema,
      WorkspaceSchema,
      CollectionSchema,
    },
    securitySchemes: {
      token: {
        type: "http",
        description: "Default authentication mechanism",
        scheme: "bearer",
      },
    },
    responses: {
      ...openApiErrorResponses,
    },
  },
  "x-speakeasy-globals": {
    parameters: [
      {
        "x-speakeasy-globals-hidden": true,
        name: "teamId",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
};
