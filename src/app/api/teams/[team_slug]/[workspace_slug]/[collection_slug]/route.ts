import { OrgniseApiError, handleAndReturnErrorResponse } from "@/lib/api";
import { withWorkspace } from "@/lib/auth";
import { CollectionDbSchema } from "@/lib/db-schema/collection.schema";
import { databaseName } from "@/lib/mongodb";
import { generateSlug, hasValue } from "@/lib/utils";
import { UpdateCollectionSchema } from "@/lib/zod/schemas/collection";
import { Collection, Filter, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// PATCH - /api/teams/:team_slug/workspaces/:workspace_slug/:collection_slug - Update a collection
export const PATCH = withWorkspace(async ({ req, session, client, params, team, workspace }) => {
  try {
    const collection_slug = params.collection_slug as string;
    const { name, parent } = await UpdateCollectionSchema.parseAsync(await req.json());



    const collectionsColl = client.db(databaseName).collection<CollectionDbSchema>("collections");
    const query = {
      team: new ObjectId(team._id),
      workspace: new ObjectId(workspace._id),
      object: "collection",
      "meta.slug": collection_slug,
    } as Filter<CollectionDbSchema>;

    const collectionInDb = (await collectionsColl.findOne(
      query,
    ));

    if (!collectionInDb) {

      throw OrgniseApiError.NOT_FOUND("Collection not found")

    }

    let slug = collectionInDb.meta.slug;
    if (!hasValue(collectionInDb?.name) && hasValue(name) || collectionInDb?.name !== name && name) {
      slug = await generateSlug({
        title: collectionInDb.object === "collection" ? `col_${name ?? ''}` : `pag_${name ?? ''}`,
        didExist: async (val: string) => {
          const work = await collectionsColl.findOne({
            "meta.slug": val,
            workspace: new ObjectId(collectionInDb.workspace),
          });
          return work ? true : false;
        },
        suffixLength: 6,
      });

      console.log("slug", slug);
    }

    const collectionToUpdate = {
      name: name ?? collectionInDb.name,
      parent: collectionInDb.parent && new ObjectId(parent ?? collectionInDb.parent),
      meta: {
        ...collectionInDb.meta,
        slug: slug,
      },
    };

    const update = await collectionsColl.updateOne(query, {
      $set: {

        ...collectionToUpdate,
        updatedAt: new Date().toISOString(),
        updatedBy: new ObjectId(session.user.id),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "collection updated successfully",
        collection: {
          ...collectionInDb,
          ...collectionToUpdate,
        }
      },
      { status: 200 },
    );
  } catch (error: any) {
    return handleAndReturnErrorResponse(error);
  }
});

// DELETE - /api/teams/:team_slug/workspaces/:workspace_slug/:collection_slug - Delete a collection
export const DELETE = withWorkspace(async ({ params, team, client, workspace }) => {
  try {
    const { collection_slug } = params as {
      collection_slug: string;
      workspace_slug: string;
    };

    const collectionsColl = client.db(databaseName).collection<CollectionDbSchema>("collections");
    const query = {
      "meta.slug": collection_slug,
      workspace: new ObjectId(workspace._id),
      team: new ObjectId(team._id),
    };
    const collectionInDb = (await collectionsColl.findOne(
      query,
    ));

    if (!collectionInDb) {
      throw OrgniseApiError.NOT_FOUND("Collection not found")
    }
    const deleteQuery = {
      $or: [
        { parent: new ObjectId(collectionInDb._id) },
        { _id: new ObjectId(collectionInDb._id) },
      ],
    } as Filter<CollectionDbSchema>;

    // delete all children recursively
    const deletedCount = await deleteDocumentAndChildren(
      collectionsColl,
      new ObjectId(collectionInDb._id),
    );

    // delete the record itself
    const deleteResult = await collectionsColl.deleteMany(deleteQuery);

    return NextResponse.json(
      {
        success: true,
        message: "Collection is deleted successfully",
        subCollectionsAndPageCount: deletedCount,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return handleAndReturnErrorResponse(error);
  }
}, {
  requiredWorkspaceRole: ['editor'],
});

/**
 * Delete all the children (n-level) of a given documentId (MongoId) and a collection
 */
async function deleteDocumentAndChildren(collection: Collection<CollectionDbSchema>, documentId: any, deletedCount = 0) {
  const children = await collection.find({ parent: documentId }).toArray();
  for (const child of children) {
    deletedCount = await deleteDocumentAndChildren(collection, child._id, deletedCount);
    await collection.deleteOne({ _id: child._id });
    deletedCount++;
  }
  return deletedCount;
}
