import { withTeam } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { WorkspaceDbSchema } from "@/lib/db-schema/workspace.schema";
import { Collection } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Update an item
export const PATCH = withTeam(async ({ req, session }) => {
  try {
    const client = await mongoDb;
    const { item } = (await req.json()) as { item?: Collection };

    if (!item || !ObjectId.isValid(item!._id)) {
      return NextResponse.json(
        { success: false, message: "Operation failed", error: "Invalid item" },
        { status: 400 },
      );
    }

    const collectionsDb = client.db(databaseName).collection("collections");
    const query = { _id: new ObjectId(item._id), object: "item" };
    const itemInDb = (await collectionsDb.findOne(
      query,
    )) as unknown as Collection;

    if (!itemInDb) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "item not found in database",
        },
        { status: 404 },
      );
    }
    let data = { ...item } as any;
    delete data._id;
    delete data.children;
    delete data.team;
    delete data.workspace;
    delete data.parent;
    delete data.ceratedBy;
    delete data.lastUpdatedUserId;
    // remove all null or undefined fields from the item object and update the collection
    for (const key in data) {
      if (data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    }
    const update = await collectionsDb.updateOne(query, {
      $set: {
        ...data,
        name: hasValue(item?.name) ? item?.name : itemInDb.name,
        updatedAt: new Date().toISOString(),
        updatedBy: new ObjectId(session.user.id),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "item updated",
        item,
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

// Delete an item
export const DELETE = withTeam(async ({ req, params, team }) => {
  try {
    const client = await mongoDb;
    const { item_slug, workspace_slug } = params as {
      item_slug: string;
      collection_slug: string;
      workspace_slug: string;
    };

    const workspaceDb = client.db(databaseName).collection("workspaces");
    const workspace = (await workspaceDb.findOne({
      "meta.slug": workspace_slug,
      team: new ObjectId(team._id),
    })) as unknown as WorkspaceDbSchema;
    if (!workspace) {
      return NextResponse.json(
        {
          success: false,
          message: "workspace not found in database",
          error: "Operation failed",
        },
        { status: 404 },
      );
    }
    const collectionsDb = client.db(databaseName).collection("collections");
    const query = {
      "meta.slug": item_slug,
      workspace: new ObjectId(workspace._id),
      team: new ObjectId(team._id),
    };
    const itemInDb = (await collectionsDb.findOne(
      query,
    )) as unknown as Collection;

    if (!itemInDb) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "Item not found in database",
          query,
        },
        { status: 404 },
      );
    }
    const deleteResult = await collectionsDb.deleteOne(query);

    return NextResponse.json(
      {
        success: true,
        message: "Item deleted",
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
