import mongodb, { databaseName } from "@/lib/mongodb";
import { WorkspaceDbSchema } from "@/lib/db-schema/workspace.schema";
import "dotenv-flow/config";


//  npm run script /workspace/add-default-values
// npx tsx ./scripts/workspace/add-default-values.ts
async function main() {
  const client = await mongodb;
  const workspaceCollection = client.db(databaseName).collection<WorkspaceDbSchema>("workspaces");

  console.log("\n-------------------- workspaces --------------------\n");

  // @ts-ignore
  const workspaces = await workspaceCollection.find({
    $or: [
      { "defaultAccess": { $in: [null, undefined, ''] } },
      { "visibility": { $in: [null, undefined, '', 'Public', 'Private'] }, }
    ]
  }).toArray();

  if (workspaces.length > 0) {
    console.log(`❌ ${workspaces.length} workspaces don't have default values.\n`);

    const bulk = await workspaceCollection.bulkWrite([
      {
        updateMany: {
          // @ts-ignore
          filter: { "defaultAccess": { $in: [null, undefined, ''] } },
          update: { $set: { "defaultAccess": "full" } }
        },
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "visibility": { $in: [null, undefined, ''] } },
          update: { $set: { "visibility": "public" } }
        }
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "visibility": { $in: ['Public'] } },
          update: { $set: { "visibility": "public" } }
        }
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "visibility": { $in: ['Private'] } },
          update: { $set: { "visibility": "private" } }
        }
      }
    ]);
    console.log({ Result: bulk });
    console.log("✅ Default values set for workspaces.");


  } else {
    console.log("✅ All workspaces have default values.");

  }
  console.log("------------------------------------------------\n");
  client.close();
  process.exit(0);
}


main();
