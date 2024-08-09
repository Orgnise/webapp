import { OrgniseApiError, handleAndReturnErrorResponse } from "@/lib/api";
import { withWorkspace } from "@/lib/auth";
import { CollectionDbSchema } from "@/lib/db-schema";
import { collections } from "@/lib/mongodb";
import { Collection } from "@/lib/types/types";
import { ReorderCollectionSchema } from "@/lib/zod/schemas";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// POST /api/teams/:team_slug/:workspace_slug/collections/reorder - Reorder a collection/page
export const POST = withWorkspace(async ({ req, client, workspace, team }) => {
  try {
    const { id, index: newIndex, parent, object, newParent } = await ReorderCollectionSchema.parseAsync(await req.json());


    if (!ObjectId.isValid(id)) {
      throw OrgniseApiError.BAD_REQUEST("Invalid id value");
    }
    if (newIndex < 0) {
      throw OrgniseApiError.BAD_REQUEST("Invalid newIndex value");
    }

    const collectionsDb = collections<CollectionDbSchema>(client, "collections");
    const query = { _id: new ObjectId(id), object: object, parent: new ObjectId(parent) };
    const currentItem = (await collectionsDb.findOne(
      query
    )) as unknown as Collection;

    if (!currentItem) {
      throw OrgniseApiError.NOT_FOUND(`${object} with Id:${id} not found`);
    }
    else if (!newParent && currentItem.sortIndex === newIndex) {
      return NextResponse.json({ success: true, message: `Result: ItemID - ${currentItem._id} moved to same index - ${newIndex}` });
    }


    if (!newParent) {
      // console.log("\n 👉 Move to same column")
      // Move within the same column: Update the order index of affected items

      // Determine if moving forward or backward in the same column
      const isForwardMove = newIndex > currentItem.sortIndex;
      const increment = isForwardMove ? -1 : 1;

      // Update order indexes based on move direction
      if (isForwardMove) {
        await collectionsDb.updateMany(
          {
            parent: currentItem.parent,
            sortIndex: { $lte: newIndex, $gt: currentItem.sortIndex },
            workspace: new ObjectId(workspace._id),
            team: new ObjectId(team._id)
          },
          {
            $inc: { sortIndex: -1 },
            $set: { updatedAt: new Date() }
          }
        );
        // console.log("\n 👉 Move in forward direction")
      } else {
        // console.log("\n 👉 Move in backward direction", { newIndex, current: currentItem.sortIndex })
        await collectionsDb.updateMany(
          {
            parent: currentItem.parent,
            sortIndex: { $gte: newIndex, $lt: currentItem.sortIndex },
            workspace: new ObjectId(workspace._id),
            team: new ObjectId(team._id)
          },
          {
            $inc: { sortIndex: 1 },
            $set: { updatedAt: new Date() }
          }
        );
      }

      // Set the new order index for the moved item
      await collectionsDb.updateOne(
        {
          _id: new ObjectId(id),
          workspace: new ObjectId(workspace._id),
          team: new ObjectId(team._id)
        },
        { $set: { sortIndex: newIndex, updatedAt: new Date() } }
      );

    } else {

      // console.log(`\n\n 1:)👉 Move to new column at index ${newIndex}`)
      // Move to a new column: Update the item and adjust order indexes in both columns
      await collectionsDb.updateOne(
        {
          _id: new ObjectId(id),
          workspace: new ObjectId(workspace._id),
          team: new ObjectId(team._id)
        },
        { $set: { parent: new ObjectId(newParent), sortIndex: newIndex, updatedAt: new Date() } }
      );

      // console.log(`\n 2:)👉 Updating previous column indexes greater then ${currentItem.sortIndex}`)
      // Update order indexes in the previous column (decrement items after the moved item)
      await collectionsDb.updateMany(
        {
          parent: new ObjectId(parent),
          sortIndex: { $gt: currentItem.sortIndex },
          workspace: new ObjectId(workspace._id),
          team: new ObjectId(team._id)
        },
        {
          $inc: { sortIndex: -1 },
          $set: { updatedAt: new Date() }
        }
      );

      // console.log(`\n 3:)👉 Update new column indexes greater then ${newIndex}`)
      // Update order indexes in the new column (increment items after newIndex)
      await collectionsDb.updateMany(
        {
          parent: new ObjectId(newParent),
          sortIndex: { $gte: newIndex }, _id: { $ne: new ObjectId(id) },
          workspace: new ObjectId(workspace._id),
          team: new ObjectId(team._id),
        },
        {
          $inc: { sortIndex: 1 },
          $set: { updatedAt: new Date() }
        }
      );
    }

    return NextResponse.json({ success: true, message: `Result: ItemID - ${currentItem._id} moved to new Parent - ${newParent} at  Index - ${newIndex}` });

  } catch (error: any) {
    return handleAndReturnErrorResponse(error);
  }
});

