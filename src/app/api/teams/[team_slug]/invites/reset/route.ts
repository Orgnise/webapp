import { withTeam } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { randomId } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// POST /api/teams/[team_slug]/invites/reset – reset invite code for a team
export const POST = withTeam(
  async ({ team }) => {
    const client = await mongoDb;
    const teamsDb = client.db(databaseName).collection("teams");
    const query = { _id: new ObjectId(team._id) };

    const inviteCode = randomId(24);
    await teamsDb.updateOne(query, {
      $set: {
        inviteCode,
      },
    });

    return NextResponse.json({ inviteCode }, { status: 200 });
  },
  {
    requiredRole: ["owner"],
  },
);
