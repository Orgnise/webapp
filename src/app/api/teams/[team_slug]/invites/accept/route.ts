import {
  OrgniseApiError,
  handleAndReturnErrorResponse,
} from "@/lib/api/errors";
import { withSession } from "@/lib/auth";
import { TeamDbSchema, TeamInviteDbSchema, TeamMemberDbSchema } from "@/lib/db-schema";
import { WorkspaceDbSchema, WorkspaceMemberDBSchema } from "@/lib/db-schema/workspace.schema";
import mongoDb, { collections, databaseName } from "@/lib/mongodb";
import { Invite } from "@/lib/types/types";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// POST /api/teams/[slug]/invites/accept – accept a team invite
export const POST = withSession(async ({ session, params }) => {
  const { team_slug } = params;

  const client = await mongoDb;
  const teamCollection = collections<TeamDbSchema>(client, "teams");
  const inviteCollection = collections<TeamInviteDbSchema>(client, "team-invites");
  const teamUserCollection = collections<TeamMemberDbSchema>(client, "team-users");

  try {
    const team = (await teamCollection.findOne({
      "meta.slug": team_slug,
    }))
    if (!team) {
      throw OrgniseApiError.NOT_FOUND("Team not found");
    }
    const invite = (await inviteCollection.findOne({
      email: session.user.email,
      team: team._id,
    })) as unknown as Invite;

    if (!invite) {
      return new Response("Invalid invite", { status: 404 });
    }

    if (invite.expires < new Date()) {
      return new Response("Invite expired", { status: 410 });
    }

    const response = await Promise.all([
      await teamUserCollection.insertOne({
        team: team._id,
        role: invite.role,
        user: new ObjectId(session.user.id),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      await inviteCollection.deleteOne({
        email: session.user.email,
        team: team._id,
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
