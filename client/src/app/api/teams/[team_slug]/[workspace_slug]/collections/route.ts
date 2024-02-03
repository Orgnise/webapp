import { Collection, ObjectId } from "mongodb";

import { NextResponse } from "next/server";
import { Workspace } from "@/lib/models/workspace.model";
import mongoDb from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async ({ team, headers, session, searchParams,params},) => {
  const client = await mongoDb;
  try {
    const {workspace_slug,team_slug} = params ?? {};

    if(team_slug === undefined || workspace_slug === undefined){
      return NextResponse.json(
        { success: false, message: 'Operation failed', error: 'No team or workspace provided',params:params },
        { status: 400 }
      );
    }
    
    const collections = client.db('pulse-db').collection<Collection>('collections')
    
    const workspaces = client.db('pulse-db').collection<Workspace>('workspaces');
    const workspaceDate = await workspaces.findOne({ "meta.slug": workspace_slug, "team": new ObjectId(team._id) }) as unknown as Workspace;

    if (!workspaceDate) {
      return NextResponse.json(
        { success: false, message: 'Operation failed', error: 'Workspace not found',workspace_slug:workspace_slug,team_slug:team_slug },
        { status: 404 }
      );
    }

    const query = { "workspace": new ObjectId(workspaceDate?._id), "$and": [{ "parent": { "$exists": false } }] };
    const dbResult = await collections.aggregate([{ "$match": query }, {
      "$lookup": {
        "from": "collections",
        "localField": "children",
        "foreignField": "_id",
        "as": "children"
      }
    }, { "$sort": { "createdAt": -1 } }
    ]).toArray();    
    
    return NextResponse.json({ collections: dbResult });
  }
  catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Operation failed', error: err.toString() },
      { status: 500 }
    );
  }
});