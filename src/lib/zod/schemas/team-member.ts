import { roles } from "@/lib/constants/team-role";
import z from "..";


export const TeamMemberSchema = z.object({
  _id: z.string().min(1).describe("Id of the team member."),
  name: z.string().min(1).describe("Name of the team member."),
  email: z.string().email().min(1).describe("Email of the team member."),
  image: z.string().optional().describe("Image URL of the team member."),
  role: z.enum(roles).describe("Role of the team member."),
}).openapi({
  description: "A team member.",
  example: {
    _id: "60f4e6f5b0a3d2001f4d8a7d",
    name: "John Doe",
    email: "john@doe.com",
    role: "member",
    image: "https://example.com/image.jpg",
  }
})

export const TeamUsersListSchema = z.object({
  users: z.array(TeamMemberSchema),
}).openapi({
  description: "List of team members.",
});

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