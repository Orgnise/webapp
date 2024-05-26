import { handleAndReturnErrorResponse } from "@/lib/api";
import { inviteUser } from "@/lib/api/users";
import { withTeam } from "@/lib/auth";
import { TeamInviteDbSchema } from "@/lib/db-schema";
import { collections } from "@/lib/mongodb";
import { hasValue } from "@/lib/utils";
import { SendInviteSchema } from "@/lib/zod/schemas";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import z from "zod";

const emailInviteSchema = z.object({
  email: z.string().email(),
});

export const GET = withTeam(
  async ({ team, client }) => {

    try {
      const inviteCollection = collections<TeamInviteDbSchema>(client, "team-invites");

      const teamData = await inviteCollection.findOne({ team: new ObjectId(team._id) });
      if (!hasValue(teamData)) {
        return NextResponse.json({ users: [] }, { status: 200 });
      }
      const dbResults = (await inviteCollection
        .aggregate([
          {
            $match: {
              team: new ObjectId(team._id),
            },
          },
        ])
        .toArray()) as unknown as any[];


      return NextResponse.json({ users: dbResults }, { status: 200 });
    } catch (error) {
      return handleAndReturnErrorResponse(error);
    }
  },
  {
    requiredRole: ["owner", "moderator"],
  },
);

// POST /api/team/[slug]/invites – invite a team member
export const POST = withTeam(
  async ({ req, team, session, client }) => {
    const { invites } = await SendInviteSchema.parseAsync(await req.json())
    try {
      await inviteUser({
        client,
        invites: invites!,
        team,
        session,
      });
      return NextResponse.json({ message: "Invitation sent" });
    } catch (error) {
      return handleAndReturnErrorResponse(error);
    }
  },
  {
    requiredRole: ["owner", "moderator"],
  },
);

// DELETE /api/team/[slug]/invites – remove a team member invite
export const DELETE = withTeam(
  async ({ req, team, searchParams, client }) => {
    const { email } = emailInviteSchema.parse(searchParams);
    try {
      const inviteCollection = collections<TeamInviteDbSchema>(client, "team-invites");;
      const result = await inviteCollection.deleteOne({
        email,
        team: new ObjectId(team._id),
      });
      return NextResponse.json({ message: "Invite removed", result });
    } catch (error) {
      return handleAndReturnErrorResponse(error)
    }
  },
  {
    requiredRole: ["owner"],
  },
);