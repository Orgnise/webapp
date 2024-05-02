import mongodb, { databaseName } from "@/lib/mongodb";
import { TeamDbSchema } from "@/lib/schema/team.schema";
import "dotenv-flow/config";


//  npm run script scripts/team/add-default-values.ts
// npx tsx ./scripts/team/add-default-values.ts
async function main() {
  const client = await mongodb;
  const teamCollection = client.db(databaseName).collection<TeamDbSchema>("teams");

  console.log("\n-------------------- Teams --------------------\n");

  // @ts-ignore
  const teams = await teamCollection.find({
    $or: [
      { "membersLimit": { $in: [null, undefined, ''] } },
      { "workspaceLimit": { $in: [null, undefined, ''] }, },
      { "billingCycleStart": { $in: [null, undefined, ''] }, },
      { "plan": { $in: [null, undefined, ''] }, },
    ]
  }).toArray();

  if (teams.length > 0) {
    console.log(`❌ ${teams.length} teams don't have  default values set.\n`);

    const bulk = await teamCollection.bulkWrite([
      {
        updateMany: {
          // @ts-ignore
          filter: { "membersLimit": { $in: [null, undefined, ''] } },
          update: { $set: { "membersLimit": 1 } }
        },
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "workspaceLimit": { $in: [null, undefined, ''] } },
          update: { $set: { "workspaceLimit": 3 } }
        }
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "billingCycleStart": { $in: [null, undefined, ''] } },
          update: { $set: { "billingCycleStart": 1 } }
        }
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "plan": { $in: [null, undefined, ''] } },
          update: { $set: { "plan": "free" } }
        }
      }
    ]);
    console.log({ Result: bulk });
    console.log("✅ Default values set for teams.");

  } else {
    console.log("✅ All teams have default values.");
  }
  console.log("------------------------------------------------\n");
  client.close();
  process.exit(0);
}


main();
