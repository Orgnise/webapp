import mongodb, { databaseName } from "@/lib/mongodb";
import { TeamDbSchema } from "@/lib/db-schema/team.schema";
import { randomId } from "@/lib/utils";
import "dotenv-flow/config";


//  npm run script scripts/team/update-missing-invite-code.ts
// npx tsx ./scripts/team/update-missing-invite-code.ts
async function main() {
  const client = await mongodb;
  const teamCollection = client.db(databaseName).collection<TeamDbSchema>("teams");

  console.log("\n-------------------- Teams --------------------\n");

  // @ts-ignore
  const teams = await teamCollection.find({ inviteCode: { $in: [null, undefined, ''] }, }).toArray();

  if (teams.length > 0) {
    console.log(`❌ ${teams.length} teams don't have  invite code \n`);

    if (teams.length > 0) {
      for (let index = 0; index < teams.length; index++) {
        const team = teams[index];
        await teamCollection.updateOne({ _id: team._id }, { $set: { inviteCode: randomId() } });
      }
    }
    console.log(`✅ Invite codes added for ${teams} teams.`);
  } else {
    console.log("✅ All teams have invite code");
  }
  console.log("------------------------------------------------\n");
  client.close();
  process.exit(0);
}


main();
