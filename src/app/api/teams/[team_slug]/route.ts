import { OrgniseApiError, handleAndReturnErrorResponse } from "@/lib/api/errors";
import { fetchDecoratedTeam } from "@/lib/api/team";
import { withTeam } from "@/lib/auth";
import { DEFAULT_REDIRECTS } from "@/lib/constants/constants";
import { trim } from "@/lib/functions/trim";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { TeamSchema } from "@/lib/schema/team.schema";
import { hasValue, validSlugRegex } from "@/lib/utils";
import z from "@/lib/zod";
import { updateTeamSchema } from "@/lib/zod/schemas/teams";
import slugify from "@sindresorhus/slugify";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";




// GET /api/team/[slug] – get a specific team
export const GET = withTeam(async ({ team }) => {
  return NextResponse.json(team);
});

// PUT /api/team/[slug] – edit a specific team
export const PUT = withTeam(
  async ({ team, req, session }) => {
    try {
      const client = await mongoDb;
      const { name, description, slug, } = await updateTeamSchema.parseAsync(await req.json());

      const teamsDb = client.db(databaseName).collection("teams");
      const query = { _id: new ObjectId(team._id) };

      // let slug = team?.meta?.slug;

      // Update slug if it is changed
      if (hasValue(slug) && team?.meta?.slug !== slug) {
        const data = await teamsDb.findOne({
          "meta.slug": slug,
        });
        if (data) {
          throw new OrgniseApiError(
            {
              code: 'conflict',
              message: "Team with this slug already exists"
            }
          );
        }
      }

      let updatedTeam = {
        name: name ?? team.name,
        description: description ?? team.description,
        updatedBy: new ObjectId(session.user.id),
        meta: {
          ...team.meta,
          slug: slug ?? team.meta.slug,
        },
      } as any;


      const update = await teamsDb.updateOne(query, {
        $set: {
          ...updatedTeam,
          updatedAt: new Date().toISOString(),
          updatedBy: new ObjectId(session.user.id),
        },
      });

      updatedTeam = await fetchDecoratedTeam(team._id, session.user.id);

      return NextResponse.json(
        {
          success: true,
          message: "Team updated",
          team: updatedTeam,
        },
        { status: 200 },
      );
    } catch (error: any) {
      return handleAndReturnErrorResponse(error);
    }
  },
  {
    requiredRole: ["owner", "moderator"],
  },
);

// Delete a team
export const DELETE = withTeam(
  async ({ params, team }) => {
    try {
      const client = await mongoDb;

      const teamsDb = client.db(databaseName).collection<TeamSchema>("teams");
      const collectionsDb = client.db(databaseName).collection("collections");
      const workspaceDb = client.db(databaseName).collection("workspaces");
      const teamUsersDb = client.db(databaseName).collection("teamUsers");
      const teamInviteCollection = client
        .db(databaseName)
        .collection("teamInvites");


      const deleteQuery = {
        team: new ObjectId(team._id),
      };
      // TODO: Update teamId to team 
      const deleteQuery2 = {
        teamId: new ObjectId(team._id),
      };
      const deleteTeam = await teamsDb.deleteOne({
        _id: new ObjectId(team._id),
      });

      // Delete all collections, workspaces and team users associated with the team
      const [deleteCollection, deleteWorkspace, deleteTeamUsers] = await Promise.all([
        await collectionsDb.deleteMany(deleteQuery),
        await workspaceDb.deleteMany(deleteQuery),
        await teamUsersDb.deleteMany(deleteQuery2),
        await teamInviteCollection.deleteMany(deleteQuery2),
      ]);


      return NextResponse.json(
        {
          success: true,
          message: "Team is deleted successfully",
          deletedContent: {
            collection: deleteCollection.deletedCount,
            workspace: deleteWorkspace.deletedCount,
            users: deleteTeamUsers.deletedCount,
          }
        },
        { status: 200 },
      );
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: "Operation failed",
          error: error.toString(),
        },
        { status: 500 },
      );
    }
  },
  {
    requiredRole: ["owner"],
  },
);
