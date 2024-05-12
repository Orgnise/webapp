import mongodb, { databaseName } from "@/lib/mongodb";
import { TeamDbSchema } from "@/lib/db-schema";
import { WorkspaceMemberDBSchema, WorkspaceDbSchema } from "@/lib/db-schema/workspace.schema";
import "dotenv-flow/config";
import { ObjectId } from "mongodb";


//  npm run script workspace/add-team-owner-to-all-workspaces
// npx tsx ./scripts/workspace/add-team-owner-to-all-workspaces.ts

// Script to assign default editor to workspaces
async function main() {
  const client = await mongodb;
  const teamCollection = client.db(databaseName).collection<TeamDbSchema>("teams");
  const workspaceCollection = client.db(databaseName).collection<WorkspaceDbSchema>("workspaces");
  const workspaceUserColl = client.db(databaseName).collection<WorkspaceMemberDBSchema>("workspace_users");

  console.log("\n-------------------- teams --------------------\n");
  const teams = await teamCollection.find().toArray();

  console.log(`\n Total ${teams.length} teams available\n`);

  console.log("\n-------------------- workspaces --------------------\n");

  // @ts-ignore
  const workspaces = await workspaceCollection.aggregate([
    {
      $lookup: {
        from: "teams",
        localField: "team",
        foreignField: "_id",
        as: "team",
      },
    },
    {
      $unwind: {
        path: "$team",
        includeArrayIndex: "string",
      },
    },
  ]).toArray();

  console.log(`Total ${workspaces.length} workspaces available\n`);

  if (workspaces.length > 0) {

    let insertResult = 0;
    for (let i = 0; i < workspaces.length; i++) {
      const workspace = workspaces[i];

      if (!workspace.team || !workspace.team._id) {
        console.error(`❌ Team not found for workspace ${workspace.name}`,);
        continue;
      }
      // Delete all workspace user who's record are created today
      // const res = await workspaceUserColl.deleteMany({ workspace: workspace._id, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
      // console.log(`Deleted ${res.deletedCount} workspace user records for workspace ${workspace.name}`)
      // continue;
      const searchQuery = { workspace: workspace._id, team: new ObjectId(workspace.team._id), user: new ObjectId(workspace.team.createdBy) };
      const workspaceMembers = await workspaceUserColl.find(searchQuery).toArray();
      if (workspaceMembers.length === 0) {
        console.log(`Adding team owner ${workspace.team.createdBy} to workspace ${workspace.name}`, searchQuery);
        const user = {
          role: 'editor',
          team: workspace.team._id,
          workspace: workspace._id,
          user: new ObjectId(workspace.team.createdBy),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as WorkspaceMemberDBSchema;
        await workspaceUserColl.insertOne(user);
        insertResult++;
      }
    }
    if (insertResult > 0) {
      console.log(`✅ ${insertResult} Team owners are assigned to workspaces successfully.`);
    }
    else {
      console.log("All team owners are already assigned to workspaces.");
    }
  } else {
    console.log("No workspaces found.");
  }
  console.log("------------------------------------------------\n");
  client.close();
  process.exit(0);
}


main();
