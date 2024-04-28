import { handleAndReturnErrorResponse } from "@/lib/api/errors";
import { withTeam } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { WorkspaceSchema, WorkspaceMemberDBSchema } from "@/lib/schema/workspace.schema";
import { generateSlug } from "@/lib/utils";
import { createWorkspaceSchema } from "@/lib/zod/schemas/workspaces";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = withTeam(async ({ team, session }) => {
  const client = await mongoDb;
  try {
    const workspaces = client
      .db(databaseName)
      .collection<WorkspaceSchema>("workspaces");
    const query = {
      team: new ObjectId(team._id),
    };
    const list = await workspaces.find(query).toArray();
    return NextResponse.json({ workspaces: list });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: err.toString() },
      { status: 500 },
    );
  }
});

export const POST = withTeam(
  async ({ team, session, req }) => {
    const client = await mongoDb;
    try {
      const { name, description, accessLevel, visibility } = await createWorkspaceSchema.parseAsync(await req.json());

      const userId = session?.user?.id;
      const workspaces = client
        .db(databaseName)
        .collection<WorkspaceSchema>("workspaces");
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
        members: [
          {
            role: "owner",
            user: new ObjectId(userId),
          },
        ],
        description: description || "",
        meta: {
          slug: slug,
          title: name,
          description: description,
        },
        visibility: visibility,
        updatedBy: new ObjectId(userId),
        createdAt: new Date(),
        createdBy: new ObjectId(userId),
        updatedAt: new Date(),
        accessLevel: accessLevel,
      } as WorkspaceSchema;

      const dbResult = await workspaces.insertOne(workspace);

      // Add all members of the team to the workspace users if the workspace is public
      // Otherwise, only add the creator of the workspace

      let workspaceUsersCount: number = 0;

      const workspaceUserCollection = client.db(databaseName).collection<WorkspaceMemberDBSchema>("workspace_users");
      if (visibility === "public") {
        // Fetch all the members of the team
        const teamsUsersColl = client.db(databaseName).collection("teamUsers");
        const teamMembers = await teamsUsersColl.find({ teamId: new ObjectId(team._id) }).toArray();
        if (teamMembers.length > 0) {
          const workspaceUsers = teamMembers.map((member) => {
            return {
              role: "reader",
              user: member.user,
              accessLevel: accessLevel,
              workspace: new ObjectId(dbResult.insertedId),
              team: new ObjectId(team._id),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }) as WorkspaceMemberDBSchema[];

          const res = await workspaceUserCollection.insertMany(workspaceUsers);
          workspaceUsersCount = res.insertedCount;
        }
      }
      else {
        const workspaceUser = {
          role: "editor",
          user: new ObjectId(userId),
          accessLevel: accessLevel,
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
