import { TeamRole } from "@/lib/constants/team-role";
import { databaseName } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { OrgniseApiError, handleAndReturnErrorResponse } from "../api/errors";
import { WorkspaceRole } from "../constants/workspace-role";
import { WorkspaceMemberDBSchema, WorkspaceSchema } from "../schema/workspace.schema";
import { Plan, Team } from "../types/types";
import { Session, withTeam } from "./";




interface WithWorkspaceHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    session,
    team,
    client,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers?: Record<string, string>;
    session: Session;
    team: Team;
    client: MongoClient;
    workspace: WorkspaceSchema;
  }): Promise<Response>;
}

export const withWorkspace = (
  handler: WithWorkspaceHandler,
  {
    requiredPlan = ["free", "pro", "business", "enterprise"], // if the action needs a specific plan
    requiredTeamRole = ["owner", "member", "guest", "moderator"], // if the action needs a specific role
    requiredWorkspaceRole = ["editor", "reader"], // if the action needs a specific role
  }: {
    requiredPlan?: Array<Plan>;
    requiredTeamRole?: Array<TeamRole>;
    requiredWorkspaceRole?: Array<WorkspaceRole>;
  } = {},
) => withTeam(async ({ req, params, searchParams, headers, session, team, client, }) => {
  try {
    const workspaceUserColl = client
      .db(databaseName)
      .collection<WorkspaceMemberDBSchema>("workspace_users");

    const workspaceMember = await workspaceUserColl.findOne({
      team: new ObjectId(team._id),
      user: new ObjectId(session.user.id),
    });

    // if the user is not a member of the workspace
    if (!workspaceMember) {
      console.log("not a member of the workspace", {
        team: new ObjectId(team._id),
        user: new ObjectId(session.user.id),
      });
      return handleAndReturnErrorResponse(
        new OrgniseApiError({
          code: "forbidden",
          message: "You are not a member of this workspace.",
        }),
      );
    }

    // if the user does not have the required role to perform the action
    if (requiredWorkspaceRole.length && !requiredWorkspaceRole.includes(workspaceMember.role)) {
      return handleAndReturnErrorResponse(
        new OrgniseApiError({
          code: "forbidden",
          message: `You need to be a ${requiredWorkspaceRole.join(" or ")} to perform this action.`,
        }),
      );
    }

    const workspaceColl = client
      .db(databaseName)
      .collection<WorkspaceSchema>("workspaces");

    const workspace = await workspaceColl.findOne({
      team: new ObjectId(team._id),
      "meta.slug": params.workspace_slug,
    });

    if (!workspace) {
      return handleAndReturnErrorResponse(
        new OrgniseApiError({
          code: "not_found",
          message: "Workspace not found.",
        }),
      );
    }

    return handler({
      req,
      params: params || {},
      searchParams,
      session,
      team,
      client,
      workspace,
    });
  } catch (error) {
    return handleAndReturnErrorResponse(error);
  }
}, {
  requiredPlan,
  requiredRole: requiredTeamRole,
});


