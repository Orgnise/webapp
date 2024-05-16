import mongoDb, { databaseName } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { TeamMemberDbSchema, TeamDbSchema } from "../db-schema/team.schema";
import { hasValue } from "../utils";
import { Team } from "../types/types";

export async function fetchDecoratedTeam(teamId: string, userId: string) {
  const client = await mongoDb;
  const teamsMembers = client
    .db(databaseName)
    .collection<TeamMemberDbSchema>("teamUsers");
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
    .toArray()) as TeamDbSchema[];

  if (hasValue(teamList)) {
    return teamList[0] as unknown as Team;
  }
  return null;
}

// Remove all team members
export async function removeAllTeamMembers(client: MongoClient, teamId: string) {
  const teamMembersCol = client
    .db(databaseName)
    .collection<TeamMemberDbSchema>("teamUsers");
  return await teamMembersCol.deleteMany({ teamId: new ObjectId(teamId) });
}

// Fetch the all teams of a user
export async function fetchAllTeamOwnedByUser(client: MongoClient, userId: string) {

  const teamsMembers = client
    .db(databaseName)
    .collection<TeamMemberDbSchema>("teamUsers");
  const teamList = (await teamsMembers
    .aggregate([
      {
        $match: {
          user: new ObjectId(userId),
          role: 'owner'
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
          stripeId: "$team.stripeId",
        },
      },
      // Remove team object from root object
      {
        $project: {
          team: 0,
          teamId: 0,
          members: 0,
        },
      },
    ])
    .toArray()) as TeamDbSchema[];

  return teamList;
}

// Get the team owner
export async function getTeamOwner(client: MongoClient, teamId: string) {

  const teamUsersCollection = client.db(databaseName).collection<TeamMemberDbSchema>("teamUsers");
  const teamUsers = await teamUsersCollection.aggregate([
    {
      $match: {
        teamId: new ObjectId(teamId),
        role: "owner",
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        email: "$user.email",
        name: "$user.name",
        id: "$user._id"
      },
    },
  ]).toArray();
  const teamOwner = teamUsers?.[0];
  if (!teamOwner) {
    return null;
  }
  return {
    email: teamOwner.email,
    name: teamOwner.name,
    id: teamOwner.id
  }
}