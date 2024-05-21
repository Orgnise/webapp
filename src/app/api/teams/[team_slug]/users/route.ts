import { handleAndReturnErrorResponse } from "@/lib/api/errors";
import { withTeam } from "@/lib/auth";
import { TeamMemberDbSchema } from "@/lib/db-schema";
import { WorkspaceMemberDBSchema } from "@/lib/db-schema/workspace.schema";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { pluralize } from "@/lib/utils";
import { TeamUsersListSchema, removeUserFromTeamSchema, updateUserInTeamRoleSchema } from "@/lib/zod/schemas";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";


// GET /api/teams/[team_slug]/users – get all users in a team
export const GET = withTeam(async ({ team, client }) => {
  try {
    const teamUsersDb = client.db(databaseName).collection<TeamMemberDbSchema>("team-users");

    const dbResults = (await teamUsersDb
      .aggregate([
        {
          $match: {
            team: new ObjectId(team._id),
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
            createdAt: "$createdAt",
          },
        },
      ])
      .toArray())

    const users = dbResults.map((user) => {
      return {
        ...user,
        _id: user._id.toHexString(),
      }
    });

    return NextResponse.json(TeamUsersListSchema.parse({ users: users }), { status: 200 });

  } catch (error) {
    return handleAndReturnErrorResponse(error);
  }
});

// PUT /api/teams/[slug]/users – update a user's role for a specific team
export const PUT = withTeam(
  async ({ req, team, client }) => {
    try {
      const { userId, role } = updateUserInTeamRoleSchema.parse(
        await req.json(),
      );
      const teamUserCollection = client.db(databaseName).collection("team-users");


      const query = {
        user: new ObjectId(userId),
        team: new ObjectId(team._id),
      };
      const response = await teamUserCollection.updateOne(query, {
        $set: { role: role, updatedAt: new Date().toISOString(), },
      });

      return NextResponse.json(
        {
          message: response.modifiedCount == 1 ? "User role updated" : "User role not updated",
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
  async ({ team, searchParams }) => {
    try {
      const { userId } = removeUserFromTeamSchema.parse(searchParams);

      const client = await mongoDb;
      const teamUserCollection = client.db(databaseName).collection<TeamMemberDbSchema>("team-users");
      const workspaceUSerCollection = client.db(databaseName).collection<WorkspaceMemberDBSchema>("workspace_users");
      const query = {
        user: new ObjectId(userId),
        team: new ObjectId(team._id),
      };

      // Remove the user from the team
      const [teamResult, workspaceResult] = await Promise.all([
        await teamUserCollection.deleteOne(query),
        await workspaceUSerCollection.deleteMany({ user: new ObjectId(userId) }),
      ]);

      // Return the result
      return NextResponse.json({
        message: `User removed from team and revoked access to ${workspaceResult.deletedCount} ${pluralize('workspace', workspaceResult.deletedCount)}`,
      });
    } catch (error) {
      return handleAndReturnErrorResponse(error);
    }
  },
  {
    requiredRole: ["owner"],
  },
);
