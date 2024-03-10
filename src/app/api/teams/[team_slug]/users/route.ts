import { withAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { TeamMemberSchema } from "@/lib/schema/team.schema";
import { Team } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";

export const GET = withAuth(async ({ team, headers }) => {
  const client = await mongoDb;
  const teamUsersDb = client.db(databaseName).collection("teamUsers");
  const query = { teamId: new ObjectId(team._id) };
  const teamData = await teamUsersDb.findOne(query);
  if (!hasValue(teamData)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Team not found',
        error: 'Operation failed'
      },
      { status: 404 }
    );
  }
  const dbResults = await teamUsersDb.aggregate(
    [{
      '$match': {
        'teamId': new ObjectId(team._id)
      }
    },
    {
      '$lookup': {
        'from': 'users',
        'localField': 'user',
        'foreignField': '_id',
        'as': 'user'
      },
    },
    { "$unwind": "$user" },
    {
      '$project': {
        'role': 1,
        'name': '$user.name',
        'email': '$user.email',
        'image': '$user.image',
      }
    }
    ]).toArray() as unknown as any[];

  return NextResponse.json({ users: dbResults, query }, { status: 200 });
});
