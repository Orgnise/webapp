
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoDb from "@/lib/mongodb";
import { Role, Teams } from "@/lib/models/team.modal";
import { getServerSession } from "next-auth/next"
import { NextAuthOptions } from "@/lib/auth/auth";
import { z } from "zod";
import { slugify } from "@/lib/utils";


export async function POST(request: NextRequest) {
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

    const requestBody: RequestBody = await request.json();
    const parsedBody = z.object({ name: z.string().min(2).max(20), description: z.string().max(60).optional() }).safeParse(requestBody);
    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, message: 'Operation failed', error: parsedBody.error },
        { status: 400 }
      )
    }


    const teams = client.db('pulse-db').collection<Teams>('teams')
    // Check if team already exists
    const team = await teams.findOne({ name: parsedBody.data.name });
    if (team) {
      return NextResponse.json(
        { success: false, message: 'Operation failed', error: 'Team already exists' },
        { status: 400 }
      )
    }
    else {
      // Generate slug
      const slug = slugify(parsedBody.data.name, async (slug) => {
        const team = await teams.findOne({ slug });
        return team === null;
      });

      const newTeam = {
        name: parsedBody.data.name,
        description: parsedBody.data.description,
        createdBy: new ObjectId(session.user.id),
        members: [{ user: new ObjectId(session.user.id), role: Role.Admin }],
        meta: {
          title: parsedBody.data.name,
          description: "",
          slug: slug,
        },
      } as Teams;
      const insertResult = await teams.insertOne(newTeam);

      const customTeam = {
        ...newTeam,
        _id: insertResult.insertedId,
      } as Teams;
      return NextResponse.json({ team: customTeam });
    }

  }
  catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Operation failed', error: err.toString() },
      { status: 500 }
    );
  }
  finally {
    client.close();
  }
}

type RequestBody = {
  name: string
  description?: string
}