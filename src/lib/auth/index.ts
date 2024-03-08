import { Plan, Team } from "../types/types";

import mongodb, { databaseName } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { TeamSchema } from "../schema/team.schema";
import { getSearchParams } from "../url";
import { NextAuthOptions } from "./auth";

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
      requiredRole = ["admin", "member"],
    }: {
      requiredPlan?: Array<Plan>;
      requiredRole?: Array<"admin" | "member">;
    } = {},
  ) =>
    async (
      req: Request,
      { params }: { params: Record<string, string> | undefined },
    ) => {
      const searchParams = getSearchParams(req.url);
      const team_slug = params?.team_slug || searchParams.projectSlug;

      const domain = params?.domain || searchParams.domain;
      const key = searchParams.key;

      let session: Session | undefined;
      let headers = {};

      // if there's no projectSlug defined
      if (!team_slug) {
        return new Response(
          "Team slug not found. Did you forget to include a `projectSlug` query parameter?",
          {
            status: 400,
          },
        );
      }

      session = await getSession();
      if (!session?.user?.id) {
        return new Response("Unauthorized: Login required.", {
          status: 401,
          headers,
        });
      }
      const client = await mongodb;
      const teamsCollection = client.db(databaseName).collection<TeamSchema>("teams");
      // const team = (await teamsCollection.findOne({
      //   "meta.slug": team_slug,
      // })) as unknown as Team;
      const teamList = await teamsCollection.aggregate([
        {
          $match: {
            "meta.slug": team_slug,
          },
        },
        {
          $lookup: {
            from: "teamUsers",
            localField: "_id",
            foreignField: "teamId",
            as: "members",
          },
        },
        {
          $unwind: {
            path: "$members",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members.user",
            foreignField: "_id",
            as: "members.user",
          },
        },
        {
          $unwind: {
            path: "$members.user",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $project: {
        //     name: 1,
        //     plan: 1,
        //     members: {
        //       $cond: {
        //         if: { $eq: ["$members", null] },
        //         then: [],
        //         else: {
        //           user: "$members.user._id",
        //           // role: "$members.role",
        //         },
        //       },
        //     },
        //   },
        // },
      ]).toArray();

      const team = teamList[0] as Team;

      if (!team || !team.members) {
        // project doesn't exist
        return new Response("Team not found.", {
          status: 404,
          headers,
        });
      }

      // team exists but user is not part of it
      if (team.members.length === 0) {
        // Todo: check if the user is part of the team
        const pendingInvites = {
          expires: new Date(),
        };
        if (!pendingInvites) {
          return new Response("Team not found.", {
            status: 404,
            headers,
          });
        } else if (pendingInvites.expires < new Date()) {
          return new Response("Team invite expired.", {
            status: 410,
            headers,
          });
        } else {
          return new Response("Team invite pending.", {
            status: 409,
            headers,
          });
        }
      }

      // project role checks (enterprise only)
      if (
        requiredRole &&
        team.plan === "enterprise" &&
        !requiredRole.includes(team.members[0].role) &&
        !(searchParams.userId === session.user.id)
      ) {
        return new Response("Unauthorized: Insufficient permissions.", {
          status: 403,
          headers,
        });
      }

      // plan checks
      if (team.plan && !requiredPlan.includes(team.plan)) {
        return new Response("Unauthorized: Need higher plan.", {
          status: 403,
          headers,
        });
      }

      return handler({
        req,
        params: params || {},
        searchParams,
        headers,
        session,
        team,
      });
    };
