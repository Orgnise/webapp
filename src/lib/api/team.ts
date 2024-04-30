import mongoDb, { databaseName } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { TeamMemberSchema, TeamSchema } from "../schema/team.schema";
import { hasValue } from "../utils";
import { Team } from "../types/types";

export async function fetchDecoratedTeam(teamId: string, userId: string) {
  const client = await mongoDb;
  const teamsMembers = client
    .db(databaseName)
    .collection<TeamMemberSchema>("teamUsers");
  const teamList = (await teamsMembers
    .aggregate([
      {
        $match: {
          user: new ObjectId(userId),
          teamId: new ObjectId(teamId),
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "teamId",
          foreignField: "_id",
          as: "team",
        },
      },
      {
        $unwind: {
          path: "$team",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "teamUsers",
          localField: "team._id",
          foreignField: "teamId",
          as: "members",
        },
      },
      {
        $addFields: { membersCount: { $size: "$members" } },
      },
      // Append team object in root object and make team_id and root id.
      {
        $addFields: {
          _id: "$team._id",
          name: "$team.name",
          description: "$team.description",
          createdBy: "$team.createdBy",
          plan: "$team.plan",
          meta: "$team.meta",
          createdAt: "$team.createdAt",
          billingCycleStart: "$team.billingCycleStart",
          inviteCode: "$team.inviteCode",
          membersLimit: "$team.membersLimit",
          workspaceLimit: "$team.workspaceLimit",
          logo: "$team.logo",
        },
      },
      // Remove team object from root object
      {
        $project: {
          team: 0,
          "teamId:": 0,
          members: 0,
        },
      },
    ])
    .toArray()) as TeamSchema[];

  if (hasValue(teamList)) {
    return teamList[0] as unknown as Team;
  }
  return null;
}

// Remove all team members
export async function removeAllTeamMembers(client: MongoClient, teamId: string) {
  const teamMembersCol = client
    .db(databaseName)
    .collection<TeamMemberSchema>("teamUsers");
  return await teamMembersCol.deleteMany({ teamId: new ObjectId(teamId) });
}