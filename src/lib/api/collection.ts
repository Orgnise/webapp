import { databaseName } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";

/**
 * Remove all workspace's collections
 */
export async function removeAllWorkspaceCollection(client: MongoClient, teamId: string, workspaceId: string) {
  const workspaceMembersCol = client
    .db(databaseName)
    .collection("collections");
  return await workspaceMembersCol.deleteMany({ team: new ObjectId(teamId), workspace: new ObjectId(workspaceId) });
}

/**
 * Remove all collections for  team. Operation to be performed when a team is deleted
 */
export async function removeAllTeamCollections(client: MongoClient, teamId: string) {
  const collectionsCol = client
    .db(databaseName)
    .collection("collections");
  return await collectionsCol.deleteMany({ team: new ObjectId(teamId) });
}