import { handleAndReturnErrorResponse } from "@/lib/api/errors";
import { withAuth } from "@/lib/auth";
import { roles } from "@/lib/constants/team-role";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { hasValue } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import z from "zod";

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(roles, {
    errorMap: () => ({
      message: `Role must be one of "owner", "member", "guest" or "member".`,
    }),
  }),
});
const removeUserSchema = z.object({
  userId: z.string().min(1),
});

export const GET = withAuth(async ({ team, headers }) => {
  const client = await mongoDb;
  const teamUsersDb = client.db(databaseName).collection("teamUsers");
  const query = { teamId: new ObjectId(team._id) };

  const dbResults = (await teamUsersDb
    .aggregate([
      {
        $match: {
          teamId: new ObjectId(team._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          role: 1,
          name: "$user.name",
          email: "$user.email",
          image: "$user.image",
        },
      },
    ])
    .toArray()) as unknown as any[];

  return NextResponse.json({ users: dbResults, query }, { status: 200 });
});

// PUT /api/teams/[slug]/users – update a user's role for a specific team
export const PUT = withAuth(
  async ({ req, team }) => {
    try {
      const { userId: documentId, role } = updateRoleSchema.parse(
        await req.json(),
      );
      const client = await mongoDb;
      const teamUserCollection = client
        .db(databaseName)
        .collection("teamUsers");
      const query = {
        _id: new ObjectId(documentId),
        teamId: new ObjectId(team._id),
      };
      const response = await teamUserCollection.updateOne(query, {
        $set: { role: role, updatedAt: new Date().toISOString(), },
      });

      return NextResponse.json(
        {
          success: true,
          message: "User role updated",
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      return handleAndReturnErrorResponse(error);
    }
  },
  {
    requiredRole: ["owner", "moderator"],
  },
);

// DELETE /api/team/[slug]/users – remove a team member
export const DELETE = withAuth(
  async ({ req, team, searchParams }) => {
    const { userId: documentId } = removeUserSchema.parse(searchParams);
    if (!hasValue(documentId)) {
      return new Response("Email is required", { status: 400 });
    }
    const client = await mongoDb;
    const teamUserCollection = client.db(databaseName).collection("teamUsers");
    const query = {
      _id: new ObjectId(documentId),
      teamId: new ObjectId(team._id),
    };
    const result = await teamUserCollection.deleteOne(query);
    return NextResponse.json({ message: "User removed from team", result });
  },
  {
    requiredRole: ["owner"],
  },
);
