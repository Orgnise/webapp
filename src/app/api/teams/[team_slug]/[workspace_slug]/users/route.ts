import { handleAndReturnErrorResponse } from "@/lib/api/errors";
import { withTeam, withWorkspace } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { addWorkspaceMemberSchema, removeWorkspaceUserSchema, updateWorkspaceRoleSchema } from "@/lib/zod/schemas/workspaces";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";


// GET /api/team/[team_slug]/[workspace_slug]/users – get all users in a workspace
export const GET = withWorkspace(async ({ team, client, workspace }) => {
  const workspaceUsersCol = client.db(databaseName).collection("workspace_users");

  const dbResults = (await workspaceUsersCol
    .aggregate([
      {
        $match: {
          team: new ObjectId(team._id),
          workspace: new ObjectId(workspace._id),
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
          name: "$user.name",
          email: "$user.email",
          image: "$user.image",
        },
      },
    ])
    .toArray()) as unknown as any[];

  return NextResponse.json({ users: dbResults }, { status: 200 });
});

// POST /api/team/[team_slug]/[workspace_slug]/users - add a users to a workspace
export const POST = withWorkspace(async ({ team, client, workspace, req }) => {
  try {
    const members = addWorkspaceMemberSchema.parse(await req.json());

    const workspaceUsersCol = client.db(databaseName).collection("workspace_users");
    const usersCol = client.db(databaseName).collection("users");

    const users = await usersCol
      .find({ email: { $in: members.map((m) => m.email) } })
      .toArray();

    const workspaceUsers = members.map((member) => {
      const user = users.find((u) => u.email === member.email);
      if (!user) {
        throw new Error(`User with email ${member.email} not found`);
      }
      return {
        team: new ObjectId(team._id),
        workspace: new ObjectId(workspace._id),
        user: new ObjectId(user._id),
        role: member.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    const result = await workspaceUsersCol.insertMany(workspaceUsers);

    return NextResponse.json(
      {
        success: true,
        message: `${result.insertedCount} members added to workspace`,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return handleAndReturnErrorResponse(error);
  }
});

// PUT /api/team/[team_slug]/[workspace_slug]/users – update a user's role in a workspace
export const PUT = withWorkspace(
  async ({ req, team }) => {
    try {
      const { userId: documentId, role } = updateWorkspaceRoleSchema.parse(
        await req.json(),
      );
      const client = await mongoDb;
      const teamUserCollection = client
        .db(databaseName)
        .collection("workspace_users");
      const query = {
        _id: new ObjectId(documentId),
        team: new ObjectId(team._id),
      };
      const response = await teamUserCollection.updateOne(query, {
        $set: { role: role, updatedAt: new Date().toISOString(), },
      });

      return NextResponse.json(
        {
          success: true,
          message: "User role updated",
          response
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
    requiredTeamRole: ["owner", "moderator", 'member'],
    requiredWorkspaceRole: ["editor"]
  },
);

// DELETE /api/team/[team_slug]/[workspace_slug]/users – remove a user from a workspace
export const DELETE = withWorkspace(
  async ({ req, team, searchParams, client }) => {
    const { userId: documentId } = removeWorkspaceUserSchema.parse(searchParams);

    const teamUserCollection = client.db(databaseName).collection("workspace_users");
    const query = {
      _id: new ObjectId(documentId),
      team: new ObjectId(team._id),
    };
    const result = await teamUserCollection.deleteOne(query);
    return NextResponse.json({ message: "User removed from team", result, query });
  },
  {
    requiredTeamRole: ["owner", "moderator", 'member'],
    requiredWorkspaceRole: ["editor"]
  },
);
