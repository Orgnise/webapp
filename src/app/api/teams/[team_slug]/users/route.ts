import { handleAndReturnErrorResponse } from "@/lib/api/errors";
import { withTeam } from "@/lib/auth";
import { roles } from "@/lib/constants/team-role";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { TeamMemberSchema } from "@/lib/schema";
import { WorkspaceMemberDBSchema } from "@/lib/schema/workspace.schema";
import { TeamMemberProps } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";
import { removeUserFromTeamSchema, updateUserInTeamRoleSchema } from "@/lib/zod/schemas";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import z from "zod";


// GET /api/teams/[team_slug]/users – get all users in a team
export const GET = withTeam(async ({ team, headers }) => {
  const client = await mongoDb;
  const teamUsersDb = client.db(databaseName).collection<TeamMemberProps>("teamUsers");
  const query = { teamId: new ObjectId(team._id) };

  const dbResults = (await teamUsersDb
    .aggregate([
      {
        $match: {
          teamId: new ObjectId(team._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          role: 1,
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          image: "$user.image",
        },
      },
    ])
    .toArray()) as unknown as any[];

  return NextResponse.json({ users: dbResults, query }, { status: 200 });
});

// PUT /api/teams/[slug]/users – update a user's role for a specific team
export const PUT = withTeam(
  async ({ req, team, client }) => {
    try {
      const { userId: documentId, role } = updateUserInTeamRoleSchema.parse(
        await req.json(),
      );
      const teamUserCollection = client.db(databaseName).collection("teamUsers");


      const query = {
        _id: new ObjectId(documentId),
        // TODO: Change teamId to team in db schema
        teamId: new ObjectId(team._id),
      };
      const response = await teamUserCollection.updateOne(query, {
        $set: { role: role, updatedAt: new Date().toISOString(), },
      });

      return NextResponse.json(
        {
          success: true,
          message: "User role updated",
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      return handleAndReturnErrorResponse(error);
    }
  },
  {
    requiredRole: ["owner", "moderator"],
  },
);

// DELETE /api/team/[slug]/users – remove a member from team
export const DELETE = withTeam(
  async ({ req, team, searchParams }) => {
    const { userId } = removeUserFromTeamSchema.parse(searchParams);
    if (!hasValue(userId)) {
      return new Response("User Id is required", { status: 400 });
    }
    const client = await mongoDb;
    const teamUserCollection = client.db(databaseName).collection<TeamMemberSchema>("teamUsers");
    const workspaceUSerCollection = client.db(databaseName).collection<WorkspaceMemberDBSchema>("workspace_users");
    const query = {
      user: new ObjectId(userId),
      teamId: new ObjectId(team._id),
    };

    // Remove the user from the team
    const [teamResult, workspaceResult] = await Promise.all([
      await teamUserCollection.deleteOne(query),
      await workspaceUSerCollection.deleteMany({ user: new ObjectId(userId) }),
    ]);

    // Return the result
    return NextResponse.json({
      message: `User removed from team and revoked access to ${workspaceResult.deletedCount} workspace`,
    });
  },
  {
    requiredRole: ["owner"],
  },
);
