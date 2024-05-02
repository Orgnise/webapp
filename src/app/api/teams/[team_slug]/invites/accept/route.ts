import {
  OrgniseApiError,
  handleAndReturnErrorResponse,
} from "@/lib/api/errors";
import { withSession } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { WorkspaceMemberDBSchema, WorkspaceDbSchema } from "@/lib/db-schema/workspace.schema";
import { Invite, Team } from "@/lib/types/types";
import { InsertManyResult, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// POST /api/teams/[slug]/invites/accept – accept a team invite
export const POST = withSession(async ({ session, params }) => {
  const { team_slug } = params;

  const client = await mongoDb;
  const teamCollection = client.db(databaseName).collection("teams");
  const teamUserCollection = client.db(databaseName).collection("teamUsers");
  const teamInviteCollection = client
    .db(databaseName)
    .collection("teamInvites");

  try {
    const team = (await teamCollection.findOne({
      "meta.slug": team_slug,
    })) as unknown as Team;
    if (!team) {
      throw new OrgniseApiError({
        code: "not_found",
        message: "Team not found",
      });
    }
    const invite = (await teamInviteCollection.findOne({
      email: session.user.email,
      teamId: team._id,
    })) as unknown as Invite;

    if (!invite) {
      return new Response("Invalid invite", { status: 404 });
    }

    if (invite.expires < new Date()) {
      return new Response("Invite expired", { status: 410 });
    }

    const response = await Promise.all([
      await teamUserCollection.insertOne({
        teamId: team._id,
        role: invite.role,
        user: new ObjectId(session.user.id),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      await teamInviteCollection.deleteOne({
        email: session.user.email,
        teamId: team._id,
      }),
    ]);

    let workspaceAddResult: Number = 0;
    // Add the user to all public workspace if the user ir not guest
    if (invite.role !== "guest") {
      const workspaceCollection = client.db(databaseName).collection<WorkspaceDbSchema>("workspaces");
      const workspaces = await workspaceCollection.find({ team: new ObjectId(team._id), visibility: 'public' }).toArray();
      if (workspaces.length) {
        const workspaceUserColl = client.db(databaseName).collection<WorkspaceMemberDBSchema>("workspace_users");
        const workspaceMembers = workspaces.map(workspace => {
          return {
            role: workspace.defaultAccess == "full" ? "editor" : "reader",
            user: new ObjectId(session.user.id),
            workspace: new ObjectId(workspace._id),
            team: new ObjectId(team._id),
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }) as WorkspaceMemberDBSchema[];
        const res = await workspaceUserColl.insertMany(workspaceMembers);
        workspaceAddResult = res.insertedCount;
      }
      else {
        workspaceAddResult = -1;
      }

    }
    return NextResponse.json({ message: `Invitation accepted`, workspace: workspaceAddResult });
  } catch (error) {
    return handleAndReturnErrorResponse(error);
  }
});
