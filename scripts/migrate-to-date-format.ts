import { TeamDbSchema } from "@/lib/db-schema/team.schema";
import mongodb, { collections } from "@/lib/mongodb";
import "dotenv-flow/config";
import { MongoClient } from "mongodb";


// npm run script migrate-to-date-format
// npx tsx ./scripts/migrate-to-date-format.ts
async function main() {
  const client = await mongodb;

  console.log("\n🏁 ------------------------- MIGRATION START -----------------------\n");

  await teamsMigration(client);

  await workspaceMigration(client);

  await workspaceUsersMigration(client);

  await teamUsersMigration(client);

  await collectionMigration(client);

  console.log("🏁 -----------------------------------------------------------------------\n");
  client.close();
  process.exit(0);
}

async function teamsMigration(client: MongoClient) {
  const teamCollection = collections<TeamDbSchema>(client, "teams");
  console.log("\n-------------------- Teams --------------------\n");

  // @ts-ignore
  const teams = await teamCollection.find().toArray();

  console.log(`${teams.length} Teams available\n`);

  if (teams.length > 0) {
    for (const team of teams) {
      const update: any = {};

      if (team.createdAt && typeof team.createdAt === "string") {
        update.createdAt = new Date(team.createdAt);
      } else {
        update.createdAt = new Date(team.createdAt.toISOString())
      }

      if (team.updatedAt && typeof team.updatedAt === "string") {
        update.updatedAt = new Date(team.updatedAt);
      } else {
        update.updatedAt = new Date(team.createdAt.toISOString())
      }

      await teamCollection.updateOne({ _id: team._id }, { $set: update });
    }
    console.log("✅ All teams have been updated.");
  } else {
    console.log("🏁 No Team available.");
  }
}

async function workspaceMigration(client: MongoClient) {
  const workspaceCollection = collections<TeamDbSchema>(client, "workspaces");
  console.log("\n-------------------- Workspace --------------------\n");

  // @ts-ignore
  const list = await workspaceCollection.find().toArray();

  console.log(`${list.length} workspace available\n`);

  if (list.length > 0) {
    for (const workspace of list) {
      const update: any = {};
      if (workspace.createdAt && typeof workspace.createdAt === "string") {
        update.createdAt = new Date(workspace.createdAt);
      } else {
        update.createdAt = new Date(workspace.createdAt.toISOString())
      }
      if (workspace.updatedAt && typeof workspace.updatedAt === "string") {
        update.updatedAt = new Date(workspace.updatedAt);
      } else {
        update.updatedAt = new Date(workspace.createdAt.toISOString())
      }

      await workspaceCollection.updateOne({ _id: workspace._id }, { $set: update });
    }
    console.log("✅ All workspaces have been updated.");
  } else {
    console.log("🏁 No workspaces available.");
  }
}

async function workspaceUsersMigration(client: MongoClient) {
  const workspaceUsersCollection = collections<TeamDbSchema>(client, "workspace_users");
  console.log("\n-------------------- Workspace users --------------------\n");

  // @ts-ignore
  const teams = await workspaceUsersCollection.find().toArray();

  console.log(`${teams.length} workspace users available\n`);

  if (teams.length > 0) {
    for (const team of teams) {
      const update: any = {};
      if (team.createdAt && typeof team.createdAt === "string") {
        update.createdAt = new Date(team.createdAt);
      } else {
        update.createdAt = new Date(team.createdAt.toISOString())
      }
      if (team.updatedAt && typeof team.updatedAt === "string") {
        update.updatedAt = new Date(team.updatedAt);
      } else {
        update.updatedAt = new Date(team.createdAt.toISOString())
      }

      await workspaceUsersCollection.updateOne({ _id: team._id }, { $set: update });
    }
    console.log("✅ All workspace users have been updated.");
  } else {
    console.log("🏁 No workspace user available.");
  }
}

async function teamUsersMigration(client: MongoClient) {
  const teamUserCollection = collections<TeamDbSchema>(client, "team-users");
  console.log("\n-------------------- Team users --------------------\n");

  // @ts-ignore
  const list = await teamUserCollection.find().toArray();

  console.log(`${list.length} Team users available\n`);

  if (list.length > 0) {
    for (const team of list) {
      const update: any = {};

      if (team.createdAt && typeof team.createdAt === "string") {
        update.createdAt = new Date(team.createdAt);
      } else {
        update.createdAt = new Date(team.createdAt.toISOString())
      }
      if (team.updatedAt && typeof team.updatedAt === "string") {
        update.updatedAt = new Date(team.updatedAt);
      } else {
        update.updatedAt = new Date(team.createdAt.toISOString())
      }

      await teamUserCollection.updateOne({ _id: team._id }, { $set: update });
    }
    console.log("✅ All team users have been updated.");
  } else {
    console.log("🏁 No team users available.");
  }
}

async function collectionMigration(client: MongoClient) {
  const collCollections = collections<TeamDbSchema>(client, "collections");
  console.log("\n-------------------- Collection --------------------\n");

  // @ts-ignore
  const list = await collCollections.find().toArray();

  console.log(`${list.length} collections available\n`);

  if (list.length > 0) {
    for (const collection of list) {
      const update: any = {};

      if (collection.createdAt && typeof collection.createdAt === "string") {
        console.log(collection.createdAt);
        update.createdAt = new Date(collection.createdAt);
      } else {
        update.createdAt = new Date(collection.createdAt.toISOString())
      }

      if (collection.updatedAt && typeof collection.updatedAt === "string") {
        update.updatedAt = new Date(collection.updatedAt);
      } else {
        update.updatedAt = new Date(collection.createdAt.toISOString())
      }

      await collCollections.updateOne({ _id: collection._id }, { $set: update });
    }
    console.log("✅ All Collection have been updated.");
  } else {
    console.log("🏁 No Collection available.");
  }
}

main();
