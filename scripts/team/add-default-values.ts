import { BUSINESS_PLAN, FREE_PLAN, PRO_PLAN } from "@/lib/constants";
import { TeamDbSchema } from "@/lib/db-schema/team.schema";
import mongodb, { databaseName } from "@/lib/mongodb";
import "dotenv-flow/config";


// npm run script /team/add-default-values
// npx tsx ./scripts/team/add-default-values.ts
async function main() {
  const client = await mongodb;
  const teamCollection = client.db(databaseName).collection<TeamDbSchema>("teams");

  console.log("\n-------------------- Teams --------------------\n");

  // @ts-ignore
  const teams = await teamCollection.find({
    $or: [
      { "billingCycleStart": { $in: [null, undefined, ''] }, },
      { "plan": { $in: [null, undefined, ''] }, },
      { "createdAt": { $in: [null, undefined, ''] } },
      { "plan": 'free' },
      { "plan": 'business' },
      { "plan": 'pro' }
    ]
  }).toArray();

  if (teams.length > 0) {
    console.log(`❌ ${teams.length} teams don't have  default values set.\n`);

    const bulk = await teamCollection.bulkWrite([
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
          filter: { "createdAt": { $in: [null, undefined, ''] } },
          update: { $set: { "createdAt": new Date() } }
        }
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "plan": 'free' },
          update: {
            $set: {
              limit: {
                pages: FREE_PLAN.limits.pages!,
                users: FREE_PLAN.limits.users!,
                workspaces: FREE_PLAN.limits.workspaces!,
              }
            }
          }
        },
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "plan": 'pro' },
          update: {
            $set: {
              limit: {
                pages: PRO_PLAN.limits.pages!,
                users: PRO_PLAN.limits.users!,
                workspaces: PRO_PLAN.limits.workspaces!,
              }
            }
          }
        },
      },
      {
        updateMany: {
          filter: { "plan": 'business' },
          update: {
            $set: {
              limit: {
                pages: BUSINESS_PLAN.limits.pages!,
                users: BUSINESS_PLAN.limits.users!,
                workspaces: BUSINESS_PLAN.limits.workspaces!,
              }
            }
          }
        },
      }
    ]);
    console.log({ Result: bulk });
    console.log("✅ Default values set for teams.");

  } else {
    console.log("✅ All teams have default values.");
  }

  // Removed unused keys
  const removeKeyResult = await teamCollection.bulkWrite([
    {
      updateMany: {
        filter: {},
        update: {
          $unset: {
            "pagesLimit": "",
            'workspaceLimit': "",
            'membersLimit': "",
            'membersCount': "",
            'teamUsers': "",
            "members": "",
          }
        }
      }
    }
  ]);
  console.log({ 'Unused keys': removeKeyResult });
  console.log("------------------------------------------------\n");
  client.close();
  process.exit(0);
}


main();
