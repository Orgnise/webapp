import { TeamRole } from "@/lib/constants/team-role";
import mongodb, { databaseName } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { OrgniseApiError, handleAndReturnErrorResponse } from "../api/errors";
import { TeamMemberDbSchema, TeamDbSchema } from "../db-schema/team.schema";
import { Invite, Plan, Team } from "../types/types";
import { getSearchParams } from "../url";
import { hasValue } from "../utils";
import { Session, generateSession } from "./";
import { fetchDecoratedTeam } from "../api";




interface WithTeamHandler {
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
    client: MongoClient;
  }): Promise<Response>;
}

export const withTeam =
  (
    handler: WithTeamHandler,
    {
      requiredPlan = ["free", "pro", "business", "enterprise"], // if the action needs a specific plan
      requiredRole = ["owner", "member", "guest", "moderator"], // if the action needs a specific role
    }: {
      requiredPlan?: Array<Plan>;
      requiredRole?: Array<TeamRole>;
    } = {},
  ) =>
    async (
      req: Request,
      { params }: { params: Record<string, string> | undefined },
    ) => {
      try {
        const searchParams = getSearchParams(req.url);
        const team_slug = params?.team_slug;

        // if there's no team defined
        if (!team_slug) {
          return new Response(
            "Team slug not found. Did you forget to include a `team_slug` query parameter?",
            {
              status: 400,
            },
          );
        }
        const client = await mongodb;
        const session = await generateSession(req);

        const teamsCollection = client
          .db(databaseName)
          .collection<TeamDbSchema>("teams");
        const teamsMembers = client
          .db(databaseName)
          .collection<TeamMemberDbSchema>("teamUsers");

        const teamInDb = (await teamsCollection
          .aggregate([
            {
              $match: {
                "meta.slug": team_slug,
              },
            },
          ])
          .toArray()) as TeamDbSchema[];

        if (!hasValue(teamInDb)) {
          throw new OrgniseApiError({
            code: "not_found",
            message: "Team not found",
          });
        }
        const team = await fetchDecoratedTeam(client, teamInDb[0]._id.toString(), session.user.id);

        // const team = teamList[0] as unknown as Team;
        if (!team) {
          const teamInviteCollection = client
            .db(databaseName)
            .collection("teamInvites");
          const invites = (await teamInviteCollection
            .aggregate([
              {
                $match: {
                  email: session.user.email,
                  teamId: new ObjectId(teamInDb[0]._id),
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
                $project: {
                  email: 1,
                  expires: 1,
                  role: 1,
                  createdAt: 1,
                  team: {
                    _id: 1,
                    name: 1,
                    plan: 1,
                    description: 1,
                    meta: 1,
                  },
                },
              },
            ])
            .toArray()) as Invite[];

          const invite = invites?.[0];
          if (!invite) {
            throw new OrgniseApiError({
              code: "not_found",
              message: "Team not found",
            });
          } else if (invite.expires < new Date()) {
            return NextResponse.json(
              {
                success: false,
                message: "Team invite expired",
                error: "Operation failed",
                invite: invite,
              },
              {
                status: 410,
              },
            );
          } else {
            return NextResponse.json(
              {
                success: false,
                message: "Team invite pending",
                error: "Operation failed",
                invite: invite,
              },
              {
                status: 409,
              },
            );
          }
        }
        // team role checks (enterprise only)
        if (
          (requiredRole && !requiredRole.includes(team.role)) ||
          (requiredPlan.includes(team.plan) && !requiredRole.includes(team.role))
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Unauthorized: Insufficient permissions",
              error: "Operation failed",
              requiredRole,
            },
            { status: 403 },
          );
        }

        // plan checks
        if (!requiredPlan.includes(team.plan ?? "free")) {
          return NextResponse.json(
            {
              success: false,
              message: "Unauthorized: Need higher plan.",
              error: "Operation failed",
            },
            { status: 403 },
          );
        }

        return handler({
          req,
          params: params || {},
          searchParams,
          session,
          team,
          client,
        });
      } catch (error) {
        return handleAndReturnErrorResponse(error);
      }
    };

