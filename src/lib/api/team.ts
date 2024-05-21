import { DbCollections, databaseName, collections } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { TeamDbSchema, TeamMemberDbSchema } from "../db-schema/team.schema";
import { hasValue } from "../utils";
import { CollectionDbSchema } from "../db-schema";
import { TeamSchema, LimitSchema } from "../zod/schemas";
import { z } from "zod";

export async function fetchDecoratedTeam(client: MongoClient, teamId: string, userId: string) {

  const teamsMembers = collections<TeamMemberDbSchema>(client, "team-users");
  const teamList = (await teamsMembers
    .aggregate([
      {
        $match: {
          user: new ObjectId(userId),
          team: new ObjectId(teamId),
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "team",
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
          from: DbCollections.TEAM_USER,
          localField: "team._id",
          foreignField: "team",
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
          logo: "$team.logo",
          limit: "$team.limit",
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
    .toArray()) as any[];

  const pageCollection = collections<CollectionDbSchema>(client, "collections");

  const workspaceCollection = collections<CollectionDbSchema>(client, "workspaces");
  const pageCount = await pageCollection.countDocuments({ team: new ObjectId(teamId), object: 'item' });

  const workspaceCount = await workspaceCollection.countDocuments({ team: new ObjectId(teamId) });
  if (hasValue(teamList)) {
    const team = TeamSchema.parse({
      ...teamList[0],
      _id: teamList[0]._id.toString(),
      usage: {
        pages: pageCount,
        users: teamList[0].membersCount,
        workspaces: workspaceCount,
      } as z.infer<typeof LimitSchema>,
    });

    return team;
  }
  return undefined;
}

// Remove all team members
export async function removeAllTeamMembers(client: MongoClient, teamId: string) {
  const teamMembersCol = collections<TeamMemberDbSchema>(client, "team-users");
  return await teamMembersCol.deleteMany({ team: new ObjectId(teamId) });
}

// Fetch the all teams of a user
export async function fetchAllTeamOwnedByUser(client: MongoClient, userId: string) {

  const teamsMembers = collections<TeamMemberDbSchema>(client, "team-users");
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
          localField: "team",
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
          from: DbCollections.TEAM_USER,
          localField: "team._id",
          foreignField: "team",
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
          limit: "$team.limit",
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

  const teamUsersCollection = collections<TeamMemberDbSchema>(client, "team-users");
  const teamUsers = await teamUsersCollection.aggregate([
    {
      $match: {
        team: new ObjectId(teamId),
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

// Get all teams for a user in which user is a member
export async function fetchAllTeamsForUser(client: MongoClient, userId: string) {
  const teamsMembersCollection = collections<TeamMemberDbSchema>(client, 'team-users')
  const teamList = (await teamsMembersCollection
    .aggregate([
      {
        $match: {
          user: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "team",
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
          from: DbCollections.TEAM_USER,
          localField: "team._id",
          foreignField: "team",
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
          limit: "$team.limit",
          logo: "$team.logo",
          joinedAt: "$createdAt",
        },
      },
      {
        $sort:
        {
          joinedAt: -1,
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

  return teamList;
}