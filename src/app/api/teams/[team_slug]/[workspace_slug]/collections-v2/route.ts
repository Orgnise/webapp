import { withTeam } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { CollectionDbSchema } from "@/lib/db-schema/collection.schema";
import { WorkspaceDbSchema } from "@/lib/db-schema/workspace.schema";
import { createTreeFromCollection } from "@/lib/utility/collection-tree-structure";
import { generateSlug } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Get list of collections
export const GET = withTeam(async ({ team, params }) => {
  const client = await mongoDb;
  try {
    const { workspace_slug, team_slug } = params ?? {};
    const collections = client
      .db(databaseName)
      .collection<CollectionDbSchema>("collections");

    const workspaces = client
      .db(databaseName)
      .collection<WorkspaceDbSchema>("workspaces");
    const workspaceDate = (await workspaces.findOne({
      "meta.slug": workspace_slug,
      team: new ObjectId(team._id),
    })) as unknown as WorkspaceDbSchema;

    if (!workspaceDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "Workspace not found",
          workspace_slug: workspace_slug,
          team_slug: team_slug,
        },
        { status: 404 },
      );
    }

    const query = {
      workspace: new ObjectId(workspaceDate?._id),
    };
    const dbResult = await collections.find(query).toArray();

    // create a tree structure from this
    const tree = createTreeFromCollection(dbResult);
    return NextResponse.json({
      collections: tree,
      itemCount: dbResult.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: err.toString() },
      { status: 500 },
    );
  }
});

// Create a new collection
export const POST = withTeam(async ({ team, session, req, params }) => {
  const client = await mongoDb;
  try {
    const workspace_slug = params?.workspace_slug;
    const body = await req.json();
    const collectionToCreate = body?.collection;
    if (
      !collectionToCreate ||
      !["item", "collection", undefined].includes(collectionToCreate?.object)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to create collection",
          error: "Invalid request",
        },
        { status: 400 },
      );
    }
    const workspaceDb = client
      .db(databaseName)
      .collection<CollectionDbSchema>("workspaces");
    const workspace = await workspaceDb.findOne({
      "meta.slug": workspace_slug,
      team: new ObjectId(team._id),
    });

    if (!workspace) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "Workspace not found",
          workspace_slug: workspace_slug,
        },
        { status: 404 },
      );
    }

    const collectionsDb = client
      .db(databaseName)
      .collection<CollectionDbSchema>("collections");
    const slug = await generateSlug({
      title: collectionToCreate?.name ?? "collection ",
      didExist: async (val: string) => {
        const work = await collectionsDb.findOne({
          "meta.slug": val,
          workspace: new ObjectId(workspace._id),
        });
        return !!work;
      },
      suffixLength: 6,
    });
    const collection = {
      team: new ObjectId(team._id),
      meta: {
        slug: slug,
        title: collectionToCreate?.name?.splice(0, 50),
        description: collectionToCreate?.description?.splice(0, 150),
      },
      sortIndex: 0,
      children: [],
      title: collectionToCreate?.name ?? "",
      name: collectionToCreate?.name ?? "",
      content: collectionToCreate.content ?? "",
      object: collectionToCreate.object
        ? collectionToCreate.object
        : collectionToCreate.parent
          ? "item"
          : "collection",
      parent: collectionToCreate.parent
        ? new ObjectId(collectionToCreate.parent)
        : undefined,
      updatedBy: new ObjectId(session.user.id),
      workspace: new ObjectId(workspace._id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: new ObjectId(session.user.id),
    } as CollectionDbSchema;

    const dbResult = await collectionsDb.insertOne(collection);
    return NextResponse.json({
      success: true,
      collection: {
        ...collection,
        _id: dbResult.insertedId,
      },
      message:
        collection.object === "collection"
          ? "Collection has been created successfully"
          : "Page has been created successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: err.toString() },
      { status: 500 },
    );
  }
});
