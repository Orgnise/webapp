import { roles } from "@/lib/constants/team-role";
import z from "..";


export const SendInviteSchema = z.object({
  invites: z.array(z.object({
    email: z.string().email().min(1).describe("Email of the user to send the invite to."),
    role: z.enum(roles).describe("Role of the user to invite."),
  }))
}).describe("Send invite schema.").openapi({
  description: "Send invite to add them in team.",
  example: {
    invites: [
      {
        email: "john@doe.com",
        "role": "member"
      }
    ]
  }
});



export const InviteTeamMemberSchema = z.object({
  _id: z.string().min(1).describe("Id of the team member."),
  email: z.string().email().min(1).describe("Email of the team member."),
  role: z.enum(roles).describe("Role of the team member."),
  expires: z.date().describe("Date when the invite expires."),
  createdAt: z.date().describe("Date when the invite was sent"),
});

export const TeamInvitesSchema = z.object({
  users: z.array(InviteTeamMemberSchema),
});