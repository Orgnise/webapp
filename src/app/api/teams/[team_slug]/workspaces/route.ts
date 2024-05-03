import { handleAndReturnErrorResponse } from "@/lib/api/errors";
import { withTeam } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { TeamMemberDbSchema } from "@/lib/db-schema";
import { WorkspaceMemberDBSchema, WorkspaceDbSchema } from "@/lib/db-schema/workspace.schema";
import { generateSlug } from "@/lib/utils";
import { createWorkspaceSchema } from "@/lib/zod/schemas/workspaces";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// GET /api/teams/:team_slug/workspaces - Get all workspaces for a team
export const GET = withTeam(async ({ team, session }) => {
  const client = await mongoDb;
  try {
    const workspaceUsersCol = client
      .db(databaseName)
      .collection<WorkspaceDbSchema>("workspace_users");

    const list = await workspaceUsersCol.aggregate([
      {
        $match: {
          user: new ObjectId(
            session?.user?.id
          ),
          team: new ObjectId(
            team._id
          ),
        },
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace",
          foreignField: "_id",
          as: "workspace",
        },
      },
      {
        $unwind: {
          path: "$workspace",
          includeArrayIndex: "string",
        },
      },
      {
        $addFields: {
          "workspace.role": "$role",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$workspace",
        },
      },

      {
        $project: {
          members: 0,
          updatedAt: 0,
        },
      },
    ]).toArray();
    return NextResponse.json({ workspaces: list });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: err.toString() },
      { status: 500 },
    );
  }
});


// POST /api/teams/:team_slug/workspaces - Create a new workspace
export const POST = withTeam(
  async ({ team, session, req }) => {
    const client = await mongoDb;
    try {
      const { name, description, defaultAccess, visibility } = await createWorkspaceSchema.parseAsync(await req.json());

      const userId = session?.user?.id;
      const workspaces = client
        .db(databaseName)
        .collection<WorkspaceDbSchema>("workspaces");
      const slug = await generateSlug({
        title: name,
        didExist: async (val: string) => {
          const work = await workspaces.findOne({ "meta.slug": val });
          return !!work;
        },
      });
      const workspace = {
        name: name,
        team: new ObjectId(team._id),
        description: description || "",
        meta: {
          slug: slug,
          title: name,
          description: description,
        },
        visibility: visibility,
        defaultAccess: defaultAccess,
        updatedBy: new ObjectId(userId),
        updatedAt: new Date(),
        createdBy: new ObjectId(userId),
        createdAt: new Date(),
      } as WorkspaceDbSchema;

      const dbResult = await workspaces.insertOne(workspace);

      // Add all members of the team to the workspace users if the workspace is public
      // Otherwise, only add the creator of the workspace

      let workspaceUsersCount: number = 0;

      const workspaceUserCollection = client.db(databaseName).collection<WorkspaceMemberDBSchema>("workspace_users");
      if (visibility === "public") {
        // Fetch all the members of the team
        const teamsUsersColl = client.db(databaseName).collection<TeamMemberDbSchema>("teamUsers");
        const teamMembers = await teamsUsersColl.find({ teamId: new ObjectId(team._id) }).toArray();
        // console.log(`Found ${teamMembers.length} members in the team ${team._id}`)
        if (teamMembers.length > 0) {

          // Add all the members if the team to public workspace except guests
          const workspaceUsers = teamMembers.filter((user) => user.role !== 'guest').map((member) => {
            return {
              role: defaultAccess === "full" ? "editor" : "reader",
              user: new ObjectId(member.user),
              workspace: new ObjectId(dbResult.insertedId),
              team: new ObjectId(team._id),
              createdAt: new Date(),
              updatedAt: new Date(),
            } as WorkspaceMemberDBSchema;
          });

          if (workspaceUsers.length > 0) {

            // console.log(`Adding ${workspaceUsers.length} members to the workspace ${dbResult.insertedId}`)
            // console.log(`Adding ${workspaceUsers.map((e) => e.user)}`)
            const res = await workspaceUserCollection.insertMany(workspaceUsers);
            workspaceUsersCount = res.insertedCount;
          }
          else {
            console.log(`No members found in the team ${team._id} to add to the workspace ${dbResult.insertedId}`)
          }
        }
      }
      else {
        const workspaceUser = {
          role: "editor",
          user: new ObjectId(userId),
          workspace: new ObjectId(dbResult.insertedId),
          team: new ObjectId(team._id),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as WorkspaceMemberDBSchema;
        const res = await workspaceUserCollection.insertOne(workspaceUser);
        workspaceUsersCount = 1;

      }

      return NextResponse.json({
        success: true,
        workspace: {
          ...workspace,
          _id: dbResult.insertedId,
        },
        users: workspaceUsersCount || 0,
      });
    } catch (error: any) {
      return handleAndReturnErrorResponse(error);
    }
  },
  {
    requiredRole: ["owner", "moderator", "member"],
  },
);
