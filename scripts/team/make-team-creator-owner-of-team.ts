import { TeamDbSchema, TeamMemberDbSchema } from "@/lib/db-schema";
import mongodb, { databaseName } from "@/lib/mongodb";
import "dotenv-flow/config";
import { ObjectId } from "mongodb";


//  npm run script team/make-team-creator-owner-of-team
// npx tsx ./scripts/team/make-team-creator-owner-of-team.ts

// Script to assign default editor to workspaces
async function main() {
  const client = await mongodb;
  const teamCollection = client.db(databaseName).collection<TeamDbSchema>("teams");
  const usersCollection = client.db(databaseName).collection<TeamMemberDbSchema>("team-users");


  console.log("\n-------------------- teams --------------------\n");



  // @ts-ignore
  const teams = await teamCollection.find().toArray();


  console.log(`\n Total ${teams.length} teams available without any owner`);
  if (teams.length > 0) {

    let insertResult = 0;
    for (let i = 0; i < teams.length; i++) {
      console.log(`\n 👉 Assigning team owner to workspace ${i + 1}`);
      const team = teams[i];
      const teamUser = await usersCollection.insertOne({
        team: team._id,
        role: "owner",
        user: new ObjectId(team.createdBy),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      insertResult++;
    }
    if (insertResult > 0) {
      console.log(`✅ ${insertResult} Team owners are assigned to workspaces successfully.`);
    }
    else {
      console.log(`All team owners are already assigned to workspaces. ${insertResult}`);
    }
  } else {
    console.log("No workspaces found.");
  }
  console.log("------------------------------------------------\n");
  client.close();
  process.exit(0);
}


main();
