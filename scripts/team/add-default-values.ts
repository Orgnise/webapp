import mongodb, { databaseName } from "@/lib/mongodb";
import { TeamDbSchema } from "@/lib/db-schema/team.schema";
import "dotenv-flow/config";
import { FREE_PLAN } from "@/lib/constants";


// npm run script /team/add-default-values
// npx tsx ./scripts/team/add-default-values.ts
async function main() {
  const client = await mongodb;
  const teamCollection = client.db(databaseName).collection<TeamDbSchema>("teams");

  console.log("\n-------------------- Teams --------------------\n");

  // @ts-ignore
  const teams = await teamCollection.find({
    $or: [
      { "pagesLimit": { $in: [null, undefined, ''] } },
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
          filter: { "pagesLimit": { $in: [null, undefined, ''] } },
          update: { $set: { "pagesLimit": FREE_PLAN.limits.pages } }
        },
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "membersLimit": { $in: [null, undefined, ''] } },
          update: { $set: { "membersLimit": FREE_PLAN.limits.users } }
        },
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "workspaceLimit": { $in: [null, undefined, ''] } },
          update: { $set: { "workspaceLimit": FREE_PLAN.limits.workspace } }
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
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "pageLimit": 30 },
          update: { $unset: { "pageLimit": "" } }
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
