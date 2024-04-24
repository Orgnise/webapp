import mongodb, { databaseName } from "@/lib/mongodb";
import { WorkspaceSchema } from "@/lib/schema/workspace.schema";
import "dotenv-flow/config";


//  npm run script scripts/workspace/add-default-values.ts
// npx tsx ./scripts/workspace/add-default-values.ts
async function main() {
  const client = await mongodb;
  const workspaceCollection = client.db(databaseName).collection<WorkspaceSchema>("workspaces");

  console.log("\n-------------------- workspaces --------------------\n");

  // @ts-ignore
  const workspaces = await workspaceCollection.find({
    $or: [
      { "accessLevel": { $in: [null, undefined, ''] } },
      { "visibility": { $in: [null, undefined, ''] }, }
    ]
  }).toArray();

  if (workspaces.length > 0) {
    console.log(`❌ ${workspaces.length} workspaces don't have default values.\n`);

    const bulk = await workspaceCollection.bulkWrite([
      {
        updateMany: {
          // @ts-ignore
          filter: { "accessLevel": { $in: [null, undefined, ''] } },
          update: { $set: { "accessLevel": "full" } }
        }
      },
      {
        updateMany: {
          // @ts-ignore
          filter: { "visibility": { $in: [null, undefined, ''] } },
          update: { $set: { "visibility": "Public" } }
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
