import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import mongoDb from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";
import { Collection } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";


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
    const collectionDb = await collectionsDb.findOne(query) as unknown as Collection;

    if (!collectionDb) {
      return NextResponse.json(
        {
          success: false,
          message: 'Operation failed',
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
    const update = await collectionsDb.updateOne(
      query,
      {
        "$set": {
          ...data,
          name: hasValue(collection?.name) ? collection?.name : hasValue(collectionDb.title) ? collectionDb.title : collectionDb.name,
          updatedAt: new Date().toISOString(),
          updatedBy: new ObjectId(session.user.id),
        }
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'collection updated',
        collection: collection,
        name: hasValue(collection?.name) ? collection?.name : hasValue(collectionDb.title),
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

export const DELETE = withAuth(async ({ params },) => {
  try {
    const client = await mongoDb;
    const { collection_slug } = params as { collection_slug: string };

    const collectionsDb = client.db('pulse-db').collection('collections');
    const query = { 'meta.slug': collection_slug };
    const collectionInDb = await collectionsDb.findOne(query) as unknown as Collection;

    if (!collectionInDb) {
      return NextResponse.json(
        {
          success: false,
          message: 'Operation failed',
          error: 'collection not found in database',
          query
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
        message: 'collection deleted',
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