import { removeAllTeamCollections, removeAllTeamWorkspaceMembers, removeAllWorkspaceCollection, removeAllWorkspaceMembers, removeWorkspace } from "@/lib/api";
import { OrgniseApiError, handleAndReturnErrorResponse } from "@/lib/api/errors";
import { withTeam, withWorkspace } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { WorkspaceDbSchema } from "@/lib/db-schema/workspace.schema";
import { hasValue } from "@/lib/utils";
import { updateWorkspaceSchema } from "@/lib/zod/schemas/workspaces";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// PUT /api/teams/:team_slug/:workspace_slug - Update a workspace
export const PUT = withTeam(async ({ req, session, team, params }) => {
  try {
    const { workspace_slug, team_slug } = params ?? {};
    const client = await mongoDb;
    const { defaultAccess, visibility, description, name, slug } = await updateWorkspaceSchema.parseAsync(await req.json());

    const workspaceDb = client.db(databaseName).collection("workspaces");
    const query = {
      "meta.slug": workspace_slug,
      team: new ObjectId(team._id),
    };
    const workspaceInDb = (await workspaceDb.findOne(
      query,
    )) as unknown as WorkspaceDbSchema;

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
      defaultAccess: defaultAccess ?? workspaceInDb.defaultAccess,
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

export const DELETE = withWorkspace(async ({ params, team, workspace }) => {
  try {
    const client = await mongoDb;
    const { workspace_slug } = params as { workspace_slug: string };

    const workspaceDb = client.db(databaseName).collection("workspaces");
    const query = { "meta.slug": workspace_slug };
    const workspaceInDb = (await workspaceDb.findOne(
      query,
    )) as unknown as WorkspaceDbSchema;

    if (!workspaceInDb) {
      throw OrgniseApiError.NOT_FOUND("Workspace not found in database");
    }

    // Delete all collections and workspace members and associated with the workspace
    const [deleteCollection, deleteWorkspaceMembers, deleteWorkspace] = await Promise.all([
      await removeAllWorkspaceCollection(client, team._id, workspace._id),
      await removeAllWorkspaceMembers(client, team._id, workspace._id),
      await removeWorkspace(client, team._id, workspace._id),
    ]);


    return NextResponse.json(
      {
        success: true,
        message: "Workspace is deleted successfully",
        deletedContent: {
          collection: deleteCollection.deletedCount,
          workspace: deleteWorkspace.deletedCount,
          workspaceMembers: deleteWorkspaceMembers.deletedCount,
        }
      },
      { status: 200 },
    );
  } catch (error: any) {
    return handleAndReturnErrorResponse(error);
  }
},
  {
    requiredTeamRole: ['owner', 'moderator'],
  });
