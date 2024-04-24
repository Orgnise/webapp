import { OrgniseApiError, handleAndReturnErrorResponse } from "@/lib/api/errors";
import { withAuth } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { WorkspaceSchema } from "@/lib/schema/workspace.schema";
import { hasValue } from "@/lib/utils";
import { updateWorkspaceSchema } from "@/lib/zod/schemas/workspaces";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Update a workspace
export const PUT = withAuth(async ({ req, session, team, params }) => {
  try {
    const { workspace_slug, team_slug } = params ?? {};
    const client = await mongoDb;
    const { accessLevel, visibility, description, name, slug } = await updateWorkspaceSchema.parseAsync(await req.json());

    const workspaceDb = client.db(databaseName).collection("workspaces");
    const query = {
      "meta.slug": workspace_slug,
      team: new ObjectId(team._id),
    };
    const workspaceInDb = (await workspaceDb.findOne(
      query,
    )) as unknown as WorkspaceSchema;

    if (!workspaceInDb) {
      throw OrgniseApiError.NOT_FOUND("Workspace not found in database");
    }
    if (hasValue(slug) && workspaceInDb?.meta?.slug !== slug) {
      const work = await workspaceDb.findOne({
        "meta.slug": slug,
        team: new ObjectId(team._id),
      });
      if (work) {
        throw OrgniseApiError.CONFLICT(
          "workspace with this slug already exists",
        );
      }
    }

    const toUpdate = {
      name: name ?? workspaceInDb.name,
      description: description ?? workspaceInDb.description,
      visibility: visibility ?? workspaceInDb.visibility,
      accessLevel: accessLevel ?? workspaceInDb.accessLevel,
      updatedAt: new Date().toISOString(),
      updatedBy: new ObjectId(session.user.id),
    };
    const update = await workspaceDb.updateOne(query, {
      $set: { ...toUpdate, "meta.slug": slug ?? workspaceInDb.meta.slug }

    });
    return NextResponse.json(
      {
        success: true,
        message: "workspace updated",
        workspace: {
          ...workspaceInDb,
          ...toUpdate,
          meta: {
            ...workspaceInDb.meta,
            slug: slug ?? workspaceInDb.meta.slug,
          },
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return handleAndReturnErrorResponse(error);
  }
});

export const DELETE = withAuth(async ({ params }) => {
  try {
    const client = await mongoDb;
    const { workspace_slug } = params as { workspace_slug: string };

    const workspaceDb = client.db(databaseName).collection("workspaces");
    const query = { "meta.slug": workspace_slug };
    const workspaceInDb = (await workspaceDb.findOne(
      query,
    )) as unknown as WorkspaceSchema;

    if (!workspaceInDb) {
      throw OrgniseApiError.NOT_FOUND("Workspace not found in database");
    }

    const deleteResult = await workspaceDb.deleteMany(query);

    return NextResponse.json(
      {
        success: true,
        message: "Workspace is deleted successfully",
        deleteResult,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return handleAndReturnErrorResponse(error);
  }
});
