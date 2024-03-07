import { withAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { TeamSchema } from "@/lib/models/team.modal";
import { Team } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";

// GET /api/team/[slug] – get a specific team
export const GET = withAuth(async ({ team, headers }) => {
  return NextResponse.json(team, { headers });
});


// Update team
export const PATCH = withAuth(async ({ team, req, session }) => {
  try {
    const client = await mongoDb;
    const { team: reqTeam } = (await req.json()) as { team?: Team };
    if (!reqTeam) {
      return NextResponse.json(
        { success: false, message: "Operation failed", error: "Invalid team" },
        { status: 400 },
      );
    }

    const teamsDb = client.db(databaseName).collection("teams");
    const query = { _id: new ObjectId(reqTeam._id) };
    let data = {
      name: reqTeam.name,
      description: reqTeam.description,
      meta: {
        slug: reqTeam.meta.slug,
        title: reqTeam.name,
        description: reqTeam.description,
      }
    };

    let slug = reqTeam?.meta?.slug;
    if (hasValue(slug) && team?.meta?.slug !== slug) {
      const data = await teamsDb.findOne({
        "meta.slug": reqTeam?.meta?.slug,
      });
      if (data) {
        return NextResponse.json(
          {
            success: false,
            message: "Team with this slug already exists",
            error: "Operation failed",
          },
          { status: 409 },
        );
      }
    }

    const update = await teamsDb.updateOne(query, {
      $set: {
        ...data,
        meta: {
          ...team.meta,
          slug: slug,
        },
        updatedAt: new Date().toISOString(),
        updatedBy: new ObjectId(session.user.id),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Team updated",
        team: {
          ...data,
          meta: {
            ...team.meta,
            slug: slug,
          },
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: error.toString() },
      { status: 500 },
    );

  }
});

// Delete a team
export const DELETE = withAuth(async ({ params, team }) => {
  try {
    const client = await mongoDb;

    const teamsDb = client.db(databaseName).collection<TeamSchema>("teams");
    const collectionsDb = client.db(databaseName).collection("collections");
    const workspaceDb = client.db(databaseName).collection("workspaces");
    const deleteQuery = {
      team: new ObjectId(team._id),
    };
    const deleteTeam = await teamsDb.deleteOne({ '_id': new ObjectId(team._id) });
    const deleteCollection = await collectionsDb.deleteMany(deleteQuery);
    const deleteWorkspace = await workspaceDb.deleteMany(deleteQuery);

    return NextResponse.json(
      {
        success: true,
        message: "Team is deleted successfully",
        deleteTeam,
        deleteCollection,
        deleteWorkspace,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Operation failed", error: error.toString() },
      { status: 500 },
    );
  }
}, { requiredRole: ["admin"] });
