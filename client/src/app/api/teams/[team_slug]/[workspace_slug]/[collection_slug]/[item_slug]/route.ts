import { Collection } from "@/lib/types/types";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import mongoDb from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";

export const POST = withAuth(async ({ team, params, req },) => {
  const client = await mongoDb;
  const {  item_slug } = params ?? {};
  try {
    const body: any = await req.json();

    if (item_slug === undefined) {
      return NextResponse.json(
        { success: false, message: 'Operation failed', error: 'No team or workspace provided', params: params },
        { status: 400 }
      );
    }
    const collections = client.db('pulse-db').collection('collections');
    const query = { "team": new ObjectId(team._id), "meta.slug": item_slug, };
    const collection = await collections.findOne(query) as unknown as Collection;

    if (!collection) {
      return NextResponse.json(
        {
          success: false,
          message: 'Operation failed',
          error: 'Collection not found',
        },
        { status: 404 }
      );
    }

    const update = await collections.updateOne(
      query,
      {
        "$set": {
          "content": body.content,
          "updatedAt": new Date().toISOString()
        }
      }
    );

    return NextResponse.json(
      {
        success: true, message: 'Item updated', item: {
          ...collection,
          content: body.content
        }
      },
      { status: 200 }
    );
  }
  catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Operation failed', error: err.toString() },
      { status: 500 }
    );
  }
});