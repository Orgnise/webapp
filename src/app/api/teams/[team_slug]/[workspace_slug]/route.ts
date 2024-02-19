import { withAuth } from "@/lib/auth";
import { Workspace } from "@/lib/models/workspace.model";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { hasValue } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Update a workspace
export const PATCH = withAuth(async ({ req, session, team }) => {
  try {
    const client = await mongoDb;
    const { workspace: reqWorkspace } = (await req.json()) as {
      workspace: Workspace;
    };

    if (!reqWorkspace || !ObjectId.isValid(reqWorkspace!._id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "Invalid workspace",
        },
        { status: 400 },
      );
    }

    const workspaceDb = client.db(databaseName).collection("workspaces");
    const query = { _id: new ObjectId(reqWorkspace._id) };
    const workspaceInDb = (await workspaceDb.findOne(
      query,
    )) as unknown as Workspace;

    if (!workspaceInDb) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "workspace not found in database",
          query,
        },
        { status: 404 },
      );
    }
    let data = { ...reqWorkspace } as any;
    delete data._id;
    delete data.team;
    delete data.createdBy;
    delete data.members;
    // remove all null or undefined fields from the workspace object and update the workspace
    for (const key in data) {
      if (data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    }
    let slug = reqWorkspace?.meta?.slug;
    if (hasValue(slug) && workspaceInDb?.meta?.slug !== slug) {
      const work = await workspaceDb.findOne({
        "meta.slug": reqWorkspace?.meta?.slug,
        team: new ObjectId(team._id),
      });
      if (work) {
        return NextResponse.json(
          {
            success: false,
            message: "workspace with this slug already exists",
            error: "Operation failed",
            query,
          },
          { status: 409 },
        );
      }
    } else {
      slug = workspaceInDb.meta.slug;
    }

    const update = await workspaceDb.updateOne(query, {
      $set: {
        ...data,
        meta: {
          ...workspaceInDb.meta,
          slug: slug,
        },
        updatedAt: new Date().toISOString(),
        updatedBy: new ObjectId(session.user.id),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "workspace updated",
        workspace: {
          ...data,
          meta: {
            ...workspaceInDb.meta,
            slug: slug,
          },
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: error.toString() },
      { status: 500 },
    );
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
    )) as unknown as Workspace;

    if (!workspaceInDb) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "Workspace not found in database",
          query,
        },
        { status: 404 },
      );
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
    return NextResponse.json(
      { success: false, message: "Operation failed", error: error.toString() },
      { status: 500 },
    );
  }
});
