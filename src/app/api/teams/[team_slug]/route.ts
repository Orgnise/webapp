import { removeAllTeamInvites, removeAllTeamUsers } from "@/lib/api";
import { removeAllTeamCollections } from "@/lib/api/collection";
import { OrgniseApiError, handleAndReturnErrorResponse } from "@/lib/api/errors";
import { fetchDecoratedTeam } from "@/lib/api/team";
import { removeAllTeamWorkspaceMembers, removeAllWorkspaces } from "@/lib/api/workspace";
import { withTeam } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { hasValue } from "@/lib/utils";
import { updateTeamSchema } from "@/lib/zod/schemas/teams";
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
  async ({ params, team, client }) => {
    try {
      // Delete all collections,workspace members, workspaces, team users and  team users invites associated with the team
      const [deleteCollection, deleteWorkspaceMembers, deleteWorkspace, deleteTeamUsers, teamInvites] = await Promise.all([
        await removeAllTeamCollections(client, team._id),
        await removeAllTeamWorkspaceMembers(client, team._id),
        await removeAllWorkspaces(client, team._id),
        await removeAllTeamUsers(client, team._id),
        await removeAllTeamInvites(client, team._id)
      ]);


      return NextResponse.json(
        {
          success: true,
          message: "Team is deleted successfully",
          deletedContent: {
            collection: deleteCollection.deletedCount,
            workspace: deleteWorkspace.deletedCount,
            workspaceMembers: deleteWorkspaceMembers.deletedCount,
            users: deleteTeamUsers.deletedCount,
            invites: teamInvites.deletedCount
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
