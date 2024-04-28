import mongodb, { databaseName } from "@/lib/mongodb";
import { WorkspaceMemberDBSchema, WorkspaceSchema } from "@/lib/schema/workspace.schema";
import "dotenv-flow/config";
import { ObjectId } from "mongodb";


//  npm run script workspace/assign-editor-to-workspaces
// npx tsx ./scripts/workspace/assign-editor-to-workspaces.ts

// Script to assign default editor to workspaces
async function main() {
  const client = await mongodb;
  const workspaceCollection = client.db(databaseName).collection<WorkspaceSchema>("workspaces");
  const workspaceUserColl = client.db(databaseName).collection<WorkspaceMemberDBSchema>("workspace_users");

  console.log("\n-------------------- workspaces --------------------\n");

  // @ts-ignore
  const workspaces = await workspaceCollection.find().toArray() as WorkspaceSchema[];

  console.log(`Total ${workspaces.length} workspaces available\n`);

  if (workspaces.length > 0) {

    let insertResult = 0;
    for (let i = 0; i < workspaces.length; i++) {
      const workspace = workspaces[i];
      const workspaceMembers = await workspaceUserColl.find({ workspace: new ObjectId(workspace._id) }).toArray();
      console.log(`Workspace ${workspace.meta.slug} has ${workspaceMembers.length} members.`);
      if (workspaceMembers.length === 0) {
        const user = {
          role: 'editor',
          team: new ObjectId(workspace.team),
          workspace: new ObjectId(workspace._id),
          user: new ObjectId(workspace.createdBy),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as WorkspaceMemberDBSchema;

        await workspaceUserColl.insertOne(user);
        insertResult++;
      }
    }
    console.log(`✅ ${insertResult} Members assigned to workspace \n`);
  } else {
    console.log("✅ All workspaces have at least one member.");
  }
  console.log("------------------------------------------------\n");
  client.close();
  process.exit(0);
}


main();
