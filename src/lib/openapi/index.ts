
import { ZodOpenApiObject } from "zod-openapi";
import { collectionsPath } from "./collection";
import { openApiErrorResponses } from "./responses";
import { teamsPath } from "./teams";
import { workspacePath } from "./workspace";
import {
  WorkspaceSchema,
  CollectionSchema,
  TeamSchema,
  CreateCollectionSchema,
  InviteTeamMemberSchema,
  SendInviteSchema,
  TeamInvitesSchema,
  TeamMemberSchema,
  TeamUsersListSchema,
  UpdateCollectionSchema,
  addWorkspaceMemberSchema,
  createWorkspaceSchema,
  deleteWorkspaceUserSchema,
  removeUserFromTeamSchema,
  updateTeamSchema,
  removeWorkspaceUserSchema,
  updateUserInTeamRoleSchema,
  updateWorkspaceRoleSchema,
  updateWorkspaceSchema,
  ReorderCollectionSchema,
} from "../zod/schemas";

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
      CreateCollectionSchema,
      InviteTeamMemberSchema,
      ReorderCollectionSchema,
      SendInviteSchema,
      TeamInvitesSchema,
      TeamMemberSchema,
      TeamUsersListSchema,
      UpdateCollectionSchema,
      addWorkspaceMemberSchema,
      createWorkspaceSchema,
      deleteWorkspaceUserSchema,
      removeUserFromTeamSchema,
      updateTeamSchema,
      removeWorkspaceUserSchema,
      updateUserInTeamRoleSchema,
      updateWorkspaceRoleSchema,
      updateWorkspaceSchema,
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
