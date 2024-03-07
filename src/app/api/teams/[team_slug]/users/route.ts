import { withAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { TeamUserSchema, TeamSchema } from "@/lib/models/team.modal";
import { Team } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";

export const GET = withAuth(async ({ team, headers }) => {
  const client = await mongoDb;
  // const teamsDb = client.db(databaseName).collection("teams");
  const teamUsersDb = client.db(databaseName).collection<TeamUserSchema>("teamUsers");
  const query = { teamId: new ObjectId(team._id) };
  const teamData = await teamUsersDb.findOne(query);
  if (!hasValue(teamData)) {
    return NextResponse.json(
      {
        success: false,
        message: "Operation failed",
        error: "Team not found",
      },
      { status: 404 }
    );
  }

  const dbResults = await teamUsersDb.aggregate([{ $match: query },

  { $unwind: "$users" },
  {
    $lookup: {
      from: "users",
      localField: "users.user",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      role: "$users.role",
      name: "$user.name",
      email: "$user.email",
      createdAt: "$user.createdAt",
      updatedAt: "$user.updatedAt",
      picture: "$user.picture",
      image: "$user.image",
    }
  },
  ]
  ).toArray();

  return NextResponse.json({ users: dbResults }, { status: 200 });
});
