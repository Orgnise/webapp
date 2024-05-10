import { workspaceRole } from "@/lib/constants/workspace-role";
import { trim } from "@/lib/functions/trim";
import { Visibility, accessLevels } from "@/lib/types";
import { validSlugRegex } from "@/lib/utils";
import z from "@/lib/zod";
import slugify from "@sindresorhus/slugify";

const visibility = z.custom<Visibility>().default('public').describe("The visibility of the workspace. Private workspaces are only visible to members of the workspace.").openapi({
  ref: 'visibility',
  example: 'public',
});

const defaultAccess = z.enum(accessLevels).default("full").describe("The default access level of the workspace. Full access allows members to perform all actions in the workspace. Read access allows members to view the workspace but not make changes.").openapi({
  ref: 'defaultAccess',
  example: 'full',
});
const description = z.string().max(120).optional().default("").describe("The description of the workspace.");


export const WorkspaceSchema = z
  .object({
    _id: z.string().describe("The unique ID of the workspace."),
    name: z.string().describe("The name of the workspace."),

    description: description,

    defaultAccess: defaultAccess,
    meta: z.object({
      title: z.string().describe("The title of the workspace."),
      description: z.string().describe("The description of the workspace."),
      slug: z.string().describe("The slug of the workspace."),
    }).describe("The meta of the workspace."),
    Visibility: visibility,
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
  description: description,
  visibility: visibility,
  defaultAccess: defaultAccess,
})
  .openapi({
    title: "Create Workspace",
    description: "Create a new workspace. Workspaces are collections of projects and tasks. Workspaces can be private or public. Private workspaces are only visible to members of the workspace.",
    example: {
      name: "Engineering Workspace",
      description: "A workspace for the engineering team.",
      visibility: 'public',
      defaultAccess: "full",
    },
  });

/**
 * Update workspace schema
 */
export const updateWorkspaceSchema = z.object({
  name: z.preprocess(trim, z.string().min(1).max(32)).optional().describe("The name of the workspace."),
  description: z.preprocess(trim, z.string().max(120)).optional().describe("The description of the workspace."),
  slug: z
    .preprocess(
      trim,
      z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .max(48, "Slug must be less than 48 characters")
        .transform((v) => slugify(v))
        .refine((v) => validSlugRegex.test(v), {
          message: "Invalid slug format",
        })
        .refine(
          // @ts-ignore
          async (v) => !['settings'][v],
          {
            message: "Cannot use reserved slugs",
          },
        ),
    )
    .optional().describe("The slug of the workspace."),
  visibility: visibility,
  defaultAccess: defaultAccess,
}).openapi({
  title: "Update Workspace",
  description: "Update a workspace. Workspaces are collections of projects and tasks. Workspaces can be private or public. Private workspaces are only visible to members of the workspace.",
  example: {
    name: "Engineering Workspace",
    description: "A workspace for the engineering team.",
    visibility: 'public',
    defaultAccess: "full",
  },
});

/**
 * Add workspace member schema
 */
export const addWorkspaceMemberSchema = z.array(
  z.object({
    email: z.string().email().describe("The ID of the user to add to the workspace."),
    role: z.enum(workspaceRole).describe("The role of the user in the workspace."),
  }),
).openapi({
  title: "Add Workspace Member",
  description: "Add a user to a workspace. Users can have the role of editor or reader.",
  example: [
    {
      email: "jondoe@gmail.com",
      role: "editor",
    },
  ],
});

/**
 * Update workspace role schema
 */
export const updateWorkspaceRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(workspaceRole, {
    errorMap: () => ({
      message: `Role must be one of "editor" or "reader"`,
    }),
  }),
}).openapi({
  title: "Update Workspace Role",
  description: "Update the role of a user in a workspace. Users can have the role of editor or reader.",
  example: {
    userId: "60f1a3c7d6d1e3e9b0b1b6f3",
    role: "editor",
  },
});

/**
 * Remove workspace user schema
 */
export const removeWorkspaceUserSchema = z.object({
  userId: z.string().min(1),
}).openapi({
  title: "Remove Workspace User",
  description: "Remove a user from a workspace.",
  example: {
    userId: "60f1a3c7d6d1e3e9b0b1b6f3",
  },
});

export const deleteWorkspaceUserSchema = z.object({
  message: z.string().optional().default(""),
  // deletedContent:z.object({
  //   collection: z.number().optional().default(0),
  // })
})