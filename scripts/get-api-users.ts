import "dotenv-flow/config";
import mongodb, { databaseName } from "@/lib/mongodb";


//  npm run script get-api-users
// tsx ./scripts/get-api-users.ts
async function main() {
  const client = await mongodb;
  const usersCollection = client.db(databaseName).collection("users");

  console.log("\n-------------------- Users --------------------\n");

  const users = await usersCollection.find().toArray();
  console.log(users.map((user) => user.email).join(",\n"));
  console.log("\n------------------------------------------------\n");

  client.close();
  process.exit(0);
}


main();
