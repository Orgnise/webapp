import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import mongoDb from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";
import { Collection } from "@/lib/types/types";
import { generateSlug, hasValue } from "@/lib/utils";
import { CollectionDTO } from "@/lib/models/collection.model";
import { Workspace } from "@/lib/models/workspace.model";


// Update a collection
export const PATCH = withAuth(async ({ req, session },) => {
  try {
    const client = await mongoDb;
    const { collection } = await req.json() as { collection?: Collection };

    if (!collection || !ObjectId.isValid(collection!._id)) {
      return NextResponse.json(
        { success: false, message: 'Operation failed', error: 'Invalid collection' },
        { status: 400 }
      );
    }

    const collectionsDb = client.db('pulse-db').collection('collections');
    const query = { "_id": new ObjectId(collection._id), object: "collection" };
    const collectionInDb = await collectionsDb.findOne(query) as unknown as CollectionDTO;

    if (!collectionInDb) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to update collection',
          error: 'collection not found in database',
          query
        },
        { status: 404 }
      );
    }
    let data = { ...collection } as any;
    delete data._id;
    delete data.children;
    delete data.team;
    delete data.workspace;
    delete data.parent;
    delete data.ceratedBy;
    delete data.lastUpdatedUserId;
    // remove all null or undefined fields from the collection object and update the collection
    for (const key in data) {
      if (data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    }
    let slug = collectionInDb.meta.slug;
    if (!hasValue(collectionInDb?.name) && hasValue(collection?.name)) {
      slug = await generateSlug({
        title: collection?.name, didExist: async (val: string) => {
          const work = await collectionsDb.findOne({ "meta.slug": val, workspace: new ObjectId(collectionInDb.workspace) })
          return !!work;
        }
      });

      console.log('slug', slug);
    }

    const update = await collectionsDb.updateOne(
      query,
      {
        "$set": {
          ...data,
          "meta": {
            ...collectionInDb.meta,
            "slug": slug
          },
          name: hasValue(collection?.name) ? collection?.name : hasValue(collectionInDb.title) ? collectionInDb.title : collectionInDb.name,
          updatedAt: new Date().toISOString(),
          updatedBy: new ObjectId(session.user.id),
        }
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'collection updated',
        collection: {
          ...collection,
          "meta": {
            ...collectionInDb.meta,
            "slug": slug
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Operation failed', error: error.toString() },
      { status: 500 }
    );
  }
});

// Delete a collection
export const DELETE = withAuth(async ({ params, team },) => {
  try {
    const client = await mongoDb;
    const { collection_slug, workspace_slug } = params as { collection_slug: string, workspace_slug: string };

    const workspaceDb = client.db('pulse-db').collection('workspaces');
    const workspace = await workspaceDb.findOne({ 'meta.slug': workspace_slug, team: new ObjectId(team._id) }) as unknown as Workspace;
    if (!workspace) {
      return NextResponse.json(
        {
          success: false,
          message: 'workspace not found in database',
          error: 'Operation failed',
        },
        { status: 404 }
      );
    }

    const collectionsDb = client.db('pulse-db').collection('collections');
    const query = { 'meta.slug': collection_slug, workspace: new ObjectId(workspace._id), team: new ObjectId(team._id) };
    const collectionInDb = await collectionsDb.findOne(query) as unknown as Collection;

    if (!collectionInDb) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to delete collection',
          error: 'collection not found in database',
          query,
          workspace
        },
        { status: 404 }
      );
    }
    // const query to delete collections and all collection having parent as the collection
    const deleteQuery = {
      $or: [
        { 'meta.slug': collection_slug },
        { 'parent': new ObjectId(collectionInDb._id) }
      ]
    };

    const deleteResult = await collectionsDb.deleteMany(deleteQuery);

    return NextResponse.json(
      {
        success: true,
        message: 'Collection is deleted successfully',
        deleteResult
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Operation failed', error: error.toString() },
      { status: 500 }
    );
  }
});