import { Plan, Team } from "../types/types";

import mongodb, { databaseName } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { Role, TeamMemberSchema, TeamSchema } from "../schema/team.schema";
import { getSearchParams } from "../url";
import { NextAuthOptions } from "./auth";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export interface Session {
  user: {
    email: string;
    id: string;
    name: string;
    image?: string;
  };
}

export const getSession = async () => {
  return getServerSession(NextAuthOptions) as Promise<Session>;
};

interface WithAuthHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    session,
    team,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers?: Record<string, string>;
    session: Session;
    team: Team;
  }): Promise<Response>;
}

export const withAuth =
  (
    handler: WithAuthHandler,
    {
      requiredPlan = ["free", "pro", "business", "enterprise"], // if the action needs a specific plan
      requiredRole = ["owner", "member"],
    }: {
      requiredPlan?: Array<Plan>;
      requiredRole?: Array<Role>;
    } = {},
  ) =>
    async (
      req: Request,
      { params }: { params: Record<string, string> | undefined },
    ) => {
      const searchParams = getSearchParams(req.url);
      const team_slug = params?.team_slug;

      const domain = params?.domain || searchParams.domain;
      const key = searchParams.key;

      let session: Session | undefined;

      // if there's no team defined
      if (!team_slug) {
        return new Response(
          "Team slug not found. Did you forget to include a `team_slug` query parameter?",
          {
            status: 400,
          },
        );
      }

      session = await getSession();
      if (!session?.user?.id) {
        return NextResponse.json(
          {
            success: false,
            message: 'Unauthorized: Login required.',
            error: 'Operation failed'
          },
          { status: 401 }
        );
      }
      const client = await mongodb;
      const teamsCollection = client.db(databaseName).collection<TeamSchema>("teams");
      const teamsMembers = client.db(databaseName).collection<TeamMemberSchema>("teamUsers");
      const teamInDb = await teamsCollection.aggregate([
        {
          $match: {
            "meta.slug": team_slug,
          },
        },
      ]).toArray() as TeamSchema[];

      const teamList = await teamsMembers.aggregate([
        {
          '$match': {
            'user': new ObjectId(session.user.id),
            'teamId': new ObjectId(teamInDb[0]._id)
          }
        },
        {
          '$lookup': {
            'from': 'teams',
            'localField': 'teamId',
            'foreignField': '_id',
            'as': 'team'
          },
        },

        {
          '$unwind': {
            'path': '$team',
            'preserveNullAndEmptyArrays': true
          }
        },
        // Append team object in root object and make team_id and root id.
        {
          '$addFields': {
            '_id': '$team._id',
            'name': '$team.name',
            'description': '$team.description',
            'createdBy': '$team.createdBy',
            'plan': '$team.plan',
            'members': '$team.members',
            'meta': '$team.meta',
            'createdAt': '$team.createdAt',
            'membersCount': '$team.membersCount',
            'billingCycleStart': '$team.billingCycleStart',
            'inviteCode': '$team.inviteCode',
            'membersLimit': '$team.membersLimit',
            'workspaceLimit': '$team.workspaceLimit'
          }
        },
        // Remove team object from root object
        {
          '$project': {
            'team': 0,
            'teamId:': 0,
          }
        }
      ]).toArray() as TeamSchema[];

      const team = teamList[0] as unknown as Team;
      if (!team) {
        // Team doesn't exist

        return NextResponse.json(
          {
            success: false,
            message: 'Team not found',
            error: 'Operation failed'
          },
          { status: 404 }
        );
      }

      // team exists but user is not part of it
      if (!team.role) {
        // Todo: check if the user is part of the team
        const pendingInvites = {
          expires: new Date(),
        };
        if (!pendingInvites) {
          return new Response("Team not found.", {
            status: 404,
          });
        } else if (pendingInvites.expires < new Date()) {
          return new Response("Team invite expired.", {
            status: 410,
          });
        } else {
          return new Response("Team invite pending.", {
            status: 409,
          });
        }
      }

      // team role checks (enterprise only)
      if (
        requiredRole &&
        !requiredRole.includes(team.role) ||
        requiredPlan.includes(team.plan) &&
        !requiredRole.includes(team.role)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: 'Unauthorized: Insufficient permissions',
            error: 'Operation failed'
          },
          { status: 403 }
        );
      }

      // plan checks
      if (!requiredPlan.includes(team.plan ?? "free")) {
        return NextResponse.json(
          {
            success: false,
            message: 'Unauthorized: Need higher plan.',
            error: 'Operation failed'
          },
          { status: 403 }
        );
      }

      return handler({
        req,
        params: params || {},
        searchParams,
        session,
        team,
      });
    };
