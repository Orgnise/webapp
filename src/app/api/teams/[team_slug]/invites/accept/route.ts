import { OrgniseApiError, handleAndReturnErrorResponse } from "@/lib/api/errors";
import { withSession } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { Invite, Team } from "@/lib/types/types";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";


// POST /api/teams/[slug]/invites/accept – accept a team invite
export const POST = withSession(
  async ({ session, params }) => {
    const { team_slug } = params;

    const client = await mongoDb;
    const teamCollection = client.db(databaseName).collection("teams");
    const teamUserCollection = client.db(databaseName).collection("teamUsers");
    const teamInviteCollection = client.db(databaseName).collection("teamInviteUsers");


    try {
      const team = await teamCollection.findOne
        ({ 'meta.slug': team_slug }) as unknown as Team;
      if (!team) {
        throw new OrgniseApiError({
          code: "not_found",
          message: "Team not found",
        });
      }
      const invite = await teamInviteCollection.findOne({
        email: session.user.email,
        teamId: team._id,
      }) as unknown as Invite;



      if (!invite) {
        return new Response("Invalid invite", { status: 404 });
      }

      if (invite.expires < new Date()) {
        return new Response("Invite expired", { status: 410 });
      }



      const response = await Promise.all([
        await teamUserCollection.insertOne(
          {
            teamId: team._id,
            role: invite.role,
            user: new ObjectId(session.user.id),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ),
        await teamInviteCollection.deleteOne({
          email: session.user.email,
          teamId: team._id,
        }),
      ]);
      return NextResponse.json(response);
    } catch (error) {
      return handleAndReturnErrorResponse(error);
    }
  },
);