import { roles } from "@/lib/constants/team-role";
import z from "..";

export const updateUserInTeamRoleSchema = z.object({
  userId: z.string().min(1).describe("User Id of the user to update."),
  role: z.enum(roles, {
    errorMap: () => ({
      message: `Role to update the user to. Must be one of ${roles.join(", ")}.`,
    }),
  }).describe(`Role to update the user to. Must be one of ${roles.join(", ")}.`),
}).openapi({
  description: "Update a user's role for a specific team.",
  example: {
    userId: "60f4e6f5b0a3d2001f4d8a7d",
    role: "member",
  },
});

export const removeUserFromTeamSchema = z.object({
  userId: z.string().min(1).describe("User Id of the user to remove from the team."),
}).openapi({
  description: "Remove a member from a team.",
  example: {
    userId: "60f4e6f5b0a3d2001f4d8a7d",
  },
});