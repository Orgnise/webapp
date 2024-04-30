import { databaseName } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { WorkspaceMemberDBSchema } from "../schema/workspace.schema";

/**
 * Remove all workspace members. Operation to be performed when a team is deleted
 */
export async function removeAllTeamWorkspaceMembers(client: MongoClient, teamId: string) {
  const workspaceMembersCol = client
    .db(databaseName)
    .collection("workspace_users");
  return await workspaceMembersCol.deleteMany({ team: new ObjectId(teamId) });
}

/**
 * Remove all workspace members. Operation to be performed when a workspace is deleted
 */
export async function removeAllWorkspaceMembers(client: MongoClient, teamId: string, workspaceId: string) {
  const workspaceMembersCol = client
    .db(databaseName)
    .collection("workspace_users");
  return await workspaceMembersCol.deleteMany({ team: new ObjectId(teamId), workspace: new ObjectId(workspaceId) });
}

/**
 * Remove all workspaces for a team
 */
export async function removeAllWorkspaces(client: MongoClient, teamId: string) {
  const workspaceCol = client
    .db(databaseName)
    .collection("workspaces");
  return await workspaceCol.deleteMany({ team: new ObjectId(teamId) });
}

/**
 * Remove a workspace. Operation to be performed when a workspace is deleted
 */
export async function removeWorkspace(client: MongoClient, teamId: string, workspaceId: string) {
  const workspaceCol = client
    .db(databaseName)
    .collection("workspaces");
  return await workspaceCol.deleteOne({ team: new ObjectId(teamId), _id: new ObjectId(workspaceId) });
}