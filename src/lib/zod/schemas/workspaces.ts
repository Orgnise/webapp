import { Visibility } from "@/lib/schema/workspace.schema";
import { accessLevels } from "@/lib/types/types";
import z from "@/lib/zod";

export const WorkspaceSchema = z
  .object({
    _id: z.string().describe("The unique ID of the workspace."),
    name: z.string().describe("The name of the workspace."),
    slug: z.string().describe("The slug of the workspace."),
    description: z
      .string().max(120)
      .nullable()
      .describe("The description of the workspace."),
    visibility: z.enum([Visibility.Private, Visibility.Public]).default(Visibility.Public).describe("The visibility of the workspace. Private workspaces are only visible to members of the workspace."),
    accessLevel: z.enum(accessLevels).default("full").describe("The access level of the workspace. Full access allows members to perform all actions in the workspace. Read access allows members to view the workspace but not make changes."),
    meta: z.object({
      title: z.string().describe("The title of the workspace."),
      description: z.string().describe("The description of the workspace."),
      slug: z.string().describe("The slug of the workspace."),
    }).describe("The meta of the workspace."),
    Visibility: z.enum([Visibility.Private, Visibility.Public]),
    createdAt: z
      .date()
      .describe("The date and time when the workspace was created."),
    updatedAt: z
      .date()
      .describe("The date and time when the workspace was last updated."),
  })
  .openapi({
    title: "workspace",
    description: "A workspace is a collection of projects and tasks. Workspaces can be private or public. Private workspaces are only visible to members of the workspace.",
  });

export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(32).describe("The name of the workspace."),
  description: z.string().max(120).optional().default("").describe("The description of the workspace."),
  visibility: z.enum([Visibility.Private, Visibility.Public]).default(Visibility.Public).describe("The visibility of the workspace. Private workspaces are only visible to members of the workspace."),
  accessLevel: z.enum(accessLevels).default("full").describe("The access level of the workspace. Full access allows members to perform all actions in the workspace. Read access allows members to view the workspace but not make changes."),
})
  .openapi({
    title: "Create Workspace",
    description: "Create a new workspace. Workspaces are collections of projects and tasks. Workspaces can be private or public. Private workspaces are only visible to members of the workspace.",
    example: {
      name: "My Workspace",
      description: "This is my workspace.",
      visibility: Visibility.Public,
      accessLevel: "full",
    },
  });