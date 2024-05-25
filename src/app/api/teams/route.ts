import { fetchAllTeamOwnedByUser, fetchAllTeamsForUser } from "@/lib/api";
import { withSession } from "@/lib/auth";
import { APP_DOMAIN, DICEBEAR_AVATAR_URL } from "@/lib/constants/constants";
import { FREE_PLAN, FREE_TEAMS_LIMIT } from "@/lib/constants/pricing";
import { TeamDbSchema, TeamMemberDbSchema } from "@/lib/db-schema/team.schema";
import { log } from "@/lib/functions/log";
import mongoDb, { collections } from "@/lib/mongodb";
import { Team } from "@/lib/types/types";
import { generateSlug, randomId } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// GET /api/teams - get all teams for the current user
export const GET = withSession(async ({ session, client }) => {
  try {

    if (!session || session?.user === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "Session not found",
        },
        { status: 400 },
      );
    }
    const teamList = await fetchAllTeamsForUser(client, session.user.id);
    return NextResponse.json({ teams: teamList });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: err.toString() },
      { status: 500 },
    );
  }
});

export const POST = withSession(async ({ req, session }) => {
  const client = await mongoDb;
  await client.connect();

  try {

    if (!session || session?.user === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: "Session not found",
        },
        { status: 400 },
      );
    }

    const body = await req.json();
    const team = body.team as Team;
    if (!team || !team.name) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 },
      );
    }

    const teams = collections<TeamDbSchema>(client, "teams");
    const teamUsersDb = collections<TeamMemberDbSchema>(client, "team-users");

    const allTeams = await fetchAllTeamOwnedByUser(client, session.user.id);
    const freeTeams = allTeams.filter((t) => t.plan === "free");

    if (freeTeams.length >= FREE_TEAMS_LIMIT) {
      return NextResponse.json(
        {
          success: false,
          message: `You can only create up to ${FREE_TEAMS_LIMIT} free teams. Additional team require a paid plan.`,
          error: "Free projects limit reached",
        },
        { status: 403 },
      );
    }
    // Check if team already exists
    // Generate slug
    const slug = await generateSlug({
      title: team.name,
      didExist: async (val: string) => {
        const work = await teams.findOne({ "meta.slug": val });
        return !!work;
      },
      suffixLength: 4,
    });
    const freeTeam = {
      name: team.name,
      description: team.description,
      createdBy: new ObjectId(session.user.id),
      plan: "free",
      meta: {
        title: team.name,
        description: "",
        slug: slug,
      },
      billingCycleStart: new Date().getDate(),
      inviteCode: randomId(16),
      limit: {
        pages: FREE_PLAN.limits.pages!,
        users: FREE_PLAN.limits.users!,
        workspaces: FREE_PLAN.limits.workspaces!,
      },
      logo: DICEBEAR_AVATAR_URL + team.name,
      createdAt: new Date(),
      updatedAt: new Date(),

    } as TeamDbSchema;

    // Create team
    const teamResult = await teams.insertOne(freeTeam);

    // Add user to team
    const teamUser = await teamUsersDb.insertOne({
      team: teamResult.insertedId,
      role: "owner",
      user: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await log({
      message: `A New team <${APP_DOMAIN}/${freeTeam.meta.slug}|${freeTeam.name}> is created by ${session.user.email}`,
      type: "tada",
    });
    const customTeam = {
      ...freeTeam,
      _id: teamResult.insertedId,
    } as TeamDbSchema;
    return NextResponse.json({ team: customTeam }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: err.toString() },
      { status: 500 },
    );
  }
});
