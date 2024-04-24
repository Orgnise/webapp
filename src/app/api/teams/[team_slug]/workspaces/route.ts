import { handleAndReturnErrorResponse } from "@/lib/api/errors";
import { withAuth } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { WorkspaceSchema } from "@/lib/schema/workspace.schema";
import { generateSlug } from "@/lib/utils";
import { createWorkspaceSchema } from "@/lib/zod/schemas/workspaces";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = withAuth(async ({ team, session }) => {
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

export const POST = withAuth(
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
        createdAt: new Date().toISOString(),
        createdBy: new ObjectId(userId),
        updatedAt: new Date().toISOString(),
        accessLevel: accessLevel,
      } as WorkspaceSchema;

      const dbResult = await workspaces.insertOne(workspace);
      return NextResponse.json({
        success: true,
        workspace: {
          ...workspace,
          _id: dbResult.insertedId,
        },
      });
    } catch (error: any) {
      return handleAndReturnErrorResponse(error);
    }
  },
  {
    requiredRole: ["owner", "moderator", "member"],
  },
);
