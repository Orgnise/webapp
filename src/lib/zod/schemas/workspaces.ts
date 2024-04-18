import { Visibility } from "@/lib/schema/workspace.schema";
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
  });

export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(32),
  description: z
    .string()
    .max(120)
    .optional()
});
