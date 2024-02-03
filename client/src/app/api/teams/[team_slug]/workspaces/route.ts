import { NextRequest, NextResponse } from "next/server";

import { NextAuthOptions } from "@/lib/auth/auth";
import { ObjectId } from "mongodb";
import { Workspace } from "@/lib/models/workspace.model";
import { getServerSession } from "next-auth/next"
import mongoDb from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async ({ team, headers, session, params },) => {
  const client = await mongoDb;
  try {
    const userId = session?.user?.id;
    const workspaces = client.db('pulse-db').collection<Workspace>('workspaces')
    const query = { team: new ObjectId(team._id), members: { $elemMatch: { user: new ObjectId(userId) } } }
    const dbResult = await workspaces.aggregate([{ "$match": query }]).toArray();
    return NextResponse.json({ workspaces: dbResult });
  }
  catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Operation failed', error: err.toString() },
      { status: 500 }
    );
  }
});