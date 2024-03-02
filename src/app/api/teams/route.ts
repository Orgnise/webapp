import { NextRequest, NextResponse } from "next/server";

import { NextAuthOptions } from "@/lib/auth/auth";
import { Role, Teams } from "@/lib/models/team.modal";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { generateSlug, randomId } from "@/lib/utils";
import { Team } from "@/lib/types/types";
import { FREE_TEAMS_LIMIT } from "@/lib/constants/pricing";



export async function GET(request: NextRequest) {
  const client = await mongoDb;
  await client.connect();
  try {
    const session = await getServerSession(NextAuthOptions);

    if (!session || session?.user === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "Session not found",
        },
        { status: 400 },
      );
    }
    const teams = client.db(databaseName).collection<Teams>("teams");
    const query = { createdBy: new ObjectId(session?.user?.id) };
    const dbResult = await teams.aggregate([{ $match: query }]).toArray();
    return NextResponse.json({ teams: dbResult });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: err.toString() },
      { status: 500 },
    );
  } finally {
    // client.close();
  }
}

export async function POST(req: NextRequest) {
  const client = await mongoDb;
  await client.connect();

  try {
    const session = await getServerSession(NextAuthOptions);

    if (!session || session?.user === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "Session not found",
        },
        { status: 400 },
      );
    }

    const body = await req.json();
    const team = body.team as Team;
    if (!team || !team.name) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 },
      );
    }

    const teams = client.db(databaseName).collection<Teams>("teams");

    const freeTeams = await teams.find({
      $and: [
        { plan: "free" },
        {
          members: {
            $elemMatch: { user: new ObjectId(session.user.id), role: Role.Admin },
          },
        }
      ]
    }).toArray();
    if (freeTeams.length >= FREE_TEAMS_LIMIT) {
      return NextResponse.json(
        {
          success: false,
          message: `You can only create up to ${FREE_TEAMS_LIMIT} free teams. Additional team require a paid plan.`,
          error: "Free projects limit reached",
        },
        { status: 403 },
      );
    }
    // Check if team already exists
    // Generate slug
    const slug = await generateSlug({
      title: team.name,
      didExist: async (val: string) => {
        const work = await teams.findOne({ "meta.slug": val });
        return !!work;
      },
      suffixLength: 4,
    });
    const freeTeam = {
      name: team.name,
      description: team.description,
      createdBy: new ObjectId(session.user.id),
      members: [{ user: new ObjectId(session.user.id), role: Role.Admin }],
      plan: 'free',
      meta: {
        title: team.name,
        description: "",
        slug: slug,
      },

      billingCycleStart: new Date().getDate(),
      inviteCode: randomId(16),
    } as Teams;
    const insertResult = await teams.insertOne(freeTeam);

    const customTeam = {
      ...freeTeam,
      _id: insertResult.insertedId,
    } as Teams;
    return NextResponse.json({ team: customTeam });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: err.toString() },
      { status: 500 },
    );
  }
}

