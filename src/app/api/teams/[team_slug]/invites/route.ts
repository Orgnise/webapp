import { inviteUser } from "@/lib/api/users";
import { withAuth } from "@/lib/auth";
import { TeamRole } from "@/lib/constants/team-role";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { hasValue } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import z from "zod";

const emailInviteSchema = z.object({
  email: z.string().email(),
});

export const GET = withAuth(
  async ({ team, headers }) => {
    const client = await mongoDb;
    const teamUserCollection = client
      .db(databaseName)
      .collection("teamInvites");
    const query = { teamId: new ObjectId(team._id) };
    const teamData = await teamUserCollection.findOne(query);
    if (!hasValue(teamData)) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }
    const dbResults = (await teamUserCollection
      .aggregate([
        {
          $match: {
            teamId: new ObjectId(team._id),
          },
        },
        // {
        //   '$lookup': {
        //     'from': 'users',
        //     'localField': 'email',
        //     'foreignField': 'email',
        //     'as': 'user'
        //   },
        // },
        // { "$unwind": "$user" },
        // {
        //   '$addFields': {
        //     'existingUser': {
        //       '$cond': {
        //         'if': { '$eq': ['$user.email', '$email'] },
        //         'then': true,
        //         'else': false
        //       },
        //     }
        //   }
        // },
        // {
        //   '$project': {
        //     'role': 1,
        //     // 'name': '$user.name',
        //     // 'email': '$user.email',
        //     // 'image': '$user.image',
        //     // 'user': 1,
        //     'createdAt': 1,
        //     'email': 1
        //   }
        // }
      ])
      .toArray()) as unknown as any[];

    return NextResponse.json({ users: dbResults }, { status: 200 });
  },
  {
    requiredRole: ["owner", "moderator"],
  },
);

// POST /api/team/[slug]/invites – invite a team member
export const POST = withAuth(
  async ({ req, team, session }) => {
    const { emails } = (await req.json()) as {
      emails: Array<EmailInvite> | undefined;
    };
    if (!hasValue(emails)) {
      return new Response("Emails are required", { status: 400 });
    }
    // const email = emails![0].email;
    // const client = await mongoDb;
    // const teamUserCollection = client.db(databaseName).collection("teamUsers");
    // const teamInviteCollection = client.db(databaseName).collection("teamInvites");
    // const [alreadyInTeam, teamUserCount, teamInviteCount] =
    //   await Promise.all([
    //     await teamUserCollection.findOne({
    //       teamId: new ObjectId(team._id),
    //       email,
    //     }) as unknown as TeamMemberSchema,
    //     await teamUserCollection.countDocuments({
    //       teamId: new ObjectId(team._id),
    //     }),
    //     await teamInviteCollection.countDocuments({
    //       teamId: new ObjectId(team._id),
    //     }),
    //   ]);

    // if (alreadyInTeam) {
    //   return new Response("User already exists in this team.", {
    //     status: 400,
    //   });
    // }

    // if (teamUserCount + teamInviteCount >= team.membersLimit) {
    //   return new NextResponse(
    //     JSON.stringify(
    //       {
    //         message: `You have reached team member limit of ${team.membersLimit}`,
    //         error: 'Members limit reached.'
    //       }),
    //     {
    //       status: 403,
    //     },
    //   );
    // }

    try {
      await inviteUser({
        emails: emails!,
        team,
        session,
      });
      return NextResponse.json({ message: "Invitation sent" });
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to send invite", error },
        { status: 500 },
      );
    }
  },
  {
    requiredRole: ["owner", "moderator"],
  },
);

// DELETE /api/team/[slug]/invites – remove a team member invite
export const DELETE = withAuth(
  async ({ req, team, searchParams }) => {
    const { email } = emailInviteSchema.parse(searchParams);

    if (!hasValue(email)) {
      return new Response("Email is required", { status: 400 });
    }
    const client = await mongoDb;
    const teamInviteCollection = client
      .db(databaseName)
      .collection("teamInvites");
    const result = await teamInviteCollection.deleteOne({
      email,
      teamId: new ObjectId(team._id),
    });
    return NextResponse.json({ message: "Invite removed", result });
  },
  {
    requiredRole: ["owner"],
  },
);

export interface EmailInvite {
  email: string;
  role: TeamRole;
}
