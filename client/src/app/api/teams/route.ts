import { NextRequest, NextResponse } from "next/server";

import { NextAuthOptions } from "@/lib/auth/auth";
import { ObjectId } from "mongodb";
import { Teams } from "@/lib/models/team.modal";
import { getServerSession } from "next-auth/next"
import mongoDb from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const client = await mongoDb;
  await client.connect();
  try {
    const session = await getServerSession(NextAuthOptions);

    if (!session || session?.user === null) {
      return NextResponse.json(
        { success: false, message: 'Operation failed', error: 'Session not found' },
        { status: 400 }
      )
    }
    const teams = client.db('pulse-db').collection<Teams>('teams')
    const query = { createdBy: new ObjectId(session?.user?.id) };
    const dbResult = await teams.aggregate([{ "$match": query }]).toArray();
    return NextResponse.json({ teams: dbResult });

  }
  catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Operation failed', error: err.toString() },
      { status: 500 }
    );
  }
  finally {
    // client.close();
  }
}