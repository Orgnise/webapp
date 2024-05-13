import "dotenv-flow/config";
import mongodb, { databaseName } from "@/lib/mongodb";
import { generateSlug } from "@/lib/utils";
import { ObjectId } from "mongodb";


//  npm run script /workspace/generate-missing-slug
// npx tsx ./scripts/workspace/generate-missing-slug.ts
async function main() {
  const client = await mongodb;
  const workspaceCollection = client.db(databaseName).collection("workspaces");

  console.log("\n-------------------- workspaces --------------------\n");

  const workspaces = await workspaceCollection.find({
    "meta.slug": { $in: [null, undefined, ''] },
  }).toArray();

  if (workspaces.length > 0) {
    for (const workspace of workspaces) {
      const slug = await generateSlug({
        title: workspace?.name ?? "collection ",
        didExist: async (val: string) => {
          const work = await workspaceCollection.findOne({
            "meta.slug": val,
            team: new ObjectId(workspace.team),
          });
          return !!work;
        },
        suffixLength: 6,
      });

      await workspaceCollection.updateOne(
        { _id: workspace._id },
        { $set: { "meta.slug": slug, updatedAt: new Date() } },
      );
      console.log(workspace.name, "=>", slug);
    }
  } else {
    console.log("No workspace found without slug");

  }
  console.log("\n------------------------------------------------\n");
  client.close();
  process.exit(0);
}


main();
