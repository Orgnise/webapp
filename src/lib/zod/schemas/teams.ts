import z from "@/lib/zod";
import slugify from "@sindresorhus/slugify";
import { planSchema } from "./misc";
import { validSlugRegex } from "@/lib/utils";
import { DEFAULT_REDIRECTS } from "@/lib/constants/constants";
import { trim } from "@/lib/functions/trim";
import { TeamRole } from "@/lib/constants";

export const LimitSchema = z.object({
  pages: z.number().default(0).describe('The limit of pages for the team'),
  users: z.number().default(0).describe('The limit of users for the team'),
  workspaces: z.number().default(0).describe('The limit of workspaces for the team'),
});
export const TeamSchema = z
  .object({
    _id: z.string().describe("The unique ID of the team."),
    name: z.string().describe("The name of the team."),
    logo: z
      .string()
      .nullable()
      .default(null)
      .describe("The logo of the team."),
    description: z
      .string().max(120)
      .nullable()
      .describe("The description of the team."),
    role: z.custom<TeamRole>().describe("The role of the authenticated user in the team."),
    membersCount: z.number().describe("The members count of the team."),
    meta: z.object({
      title: z.string().describe("The title of the team."),
      description: z.string().describe("The description of the team."),
      slug: z.string().describe("The slug of the team."),
    }).describe("The meta of the team."),
    inviteCode: z.string().max(24).describe("The invite code of the team."),
    plan: planSchema,
    billingCycleStart: z
      .number()
      .describe(
        "The date and time when the billing cycle starts for the team.",
      ),
    usage: LimitSchema.describe("The usage of the resource of a team."),
    limit: LimitSchema.describe("The limit of the team resources."),
    createdAt: z
      .date()
      .describe("The date and time when the team was created."),
    updatedAt: z
      .date()
      .describe("The date and time when the team was last updated."),
  })
  .openapi({
    title: "team",
  });

export const createTeamSchema = z.object({
  name: z.string().min(1).max(32),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(48, "Slug must be less than 48 characters")
    .transform((v) => slugify(v))
    .refine((v) => validSlugRegex.test(v), { message: "Invalid slug format" })
    .refine(
      // @ts-ignore
      async (v) => !DEFAULT_REDIRECTS[v], {
      message: "Cannot use reserved slugs",
    }),
  description: z
    .string()
    .max(120)
    .optional()
});

export const updateTeamSchema = z.object({
  name: z.preprocess(trim, z.string().min(1).max(32)).optional(),
  description: z.preprocess(trim, z.string().max(120)).optional(),
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
          async (v) => !DEFAULT_REDIRECTS[v],
          {
            message: "Cannot use reserved slugs",
          },
        ),
    )
    .optional(),
}).openapi({
  title: "Update Team",
  description: "Update a team.",
  example: {
    name: "Engineering Team",
    description: "A team for the engineering department.",
    slug: "engineering",
  },
});