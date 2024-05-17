import { TeamDbSchema } from "@/lib/db-schema/team.schema";
import mongodb, { databaseName } from "@/lib/mongodb";
import "dotenv-flow/config";


// npm run script /team/remove-non-attached-team-members
// npx tsx ./scripts/team/remove-non-attached-team-members.ts

// Script to remove members from team users collection and are not linked to any team
async function main() {
  const client = await mongodb;
  const teamUsersColl = client.db(databaseName).collection<TeamDbSchema>("teamUsers");

  console.log("\n-------------------- Teams --------------------\n");

  const teamsUsers = await teamUsersColl.aggregate(
    [
      {
        $lookup: {
          from: "teams",
          localField: "teamId",
          foreignField: "_id",
          as: "team",
        },
      },
      {
        $match: {
          team: { $size: 0 },
          // team: { $exists: [] },
        },
      },
      {
        $project: {
          team: 1,
          teamId: 1,
        },
      },

    ]).toArray();

  if (teamsUsers.length > 0) {
    console.log(`❌ ${teamsUsers.length} Members aren't linked to teams\n`);

    for (let index = 0; index < teamsUsers.length; index++) {
      const team = teamsUsers[index];
      await teamUsersColl.deleteOne({ teamId: team.teamId });
      console.log(`Member removed from team ${team.teamId}`);
    }
  } else {
    console.log("✅ All members are linked to at-least one team");
  }
  console.log("------------------------------------------------\n");
  client.close();
  process.exit(0);
}


main();
