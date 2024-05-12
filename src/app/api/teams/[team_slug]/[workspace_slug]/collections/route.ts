import { OrgniseApiError, handleAndReturnErrorResponse } from "@/lib/api";
import { withTeam, withWorkspace } from "@/lib/auth";
import { CollectionDbSchema } from "@/lib/db-schema/collection.schema";
import { databaseName } from "@/lib/mongodb";
import { createTreeFromCollection } from "@/lib/utility/collection-tree-structure";
import { generateSlug } from "@/lib/utils";
import { CreateCollectionSchema } from "@/lib/zod/schemas/collection";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// GET /api/teams/:team_slug/workspaces/:workspace_slug/collections - Get list of collections
export const GET = withWorkspace(async ({ workspace, team, params, client }) => {
  try {
    const collections = client
      .db(databaseName)
      .collection<CollectionDbSchema>("collections");

    const query = {
      team: new ObjectId(team._id),
      workspace: new ObjectId(workspace?._id),
    };
    const dbResult = await collections.find(query).toArray();

    // create a tree structure from this
    const tree = createTreeFromCollection(dbResult);


    // create a tree structure from this
    // const tree = createTreeFromCollection(dbResult);
    return NextResponse.json({
      collections: tree,
      itemCount: dbResult.length,
    });
  } catch (err: any) {
    return handleAndReturnErrorResponse(err);
  }
});


//  POST /api/teams/:team_slug/workspaces/:workspace_slug/collections - Create a new collection
export const POST = withWorkspace(async ({ team, workspace, session, req, params, client }) => {
  try {

    const { name, object, parent } = await CreateCollectionSchema.parseAsync(await req.json());


    const collectionsDb = client
      .db(databaseName)
      .collection<CollectionDbSchema>("collections");
    const slug = await generateSlug({
      title: object === "collection" ? `col_${name ?? ''}` : `pag_${name ?? ''}`,
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
        title: name,
      },
      sortIndex: 0,
      name: name ?? "",
      object: object,
      parent: parent && new ObjectId(parent),
      content: '',
      children: [],
      updatedBy: new ObjectId(session.user.id),
      workspace: new ObjectId(workspace._id),
      updatedAt: new Date().toISOString(),
      createdBy: new ObjectId(session.user.id),
      createdAt: new Date().toISOString(),
    } as CollectionDbSchema;

    const dbResult = await collectionsDb.insertOne(collection);
    return NextResponse.json({
      success: true,
      collection: {
        ...collection,
        _id: dbResult.insertedId,
      },
      object,
      message:
        collection.object === "collection"
          ? "Collection has been created successfully"
          : "Page has been created successfully",
    });
  } catch (err: any) {
    return handleAndReturnErrorResponse(err);
  }
});
