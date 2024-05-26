import { MongoClient } from "mongodb";

export const DbCollections = {
  USER: "users",
  TEAM: "teams",
  TEAM_USER: "team-users",
  TEAM_INVITE: "team-invites",
  WORKSPACE: "workspaces",
  WORKSPACE_USER: "workspace_users",
  COLLECTION: "collections",
} as const;

type CollectionType = typeof DbCollections[keyof typeof DbCollections];
export function collections<T extends object>(client: MongoClient, c: CollectionType) {
  return client.db(databaseName).collection<T>(c);
}

export const databaseName = process.env.DATABASE_NAME ?? "pulse-db";
const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/pulse-db" as string; // your mongodb connection string
const options = {};

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

class Singleton {
  private static _instance: Singleton;
  private client: MongoClient;
  private clientPromise: Promise<MongoClient>;
  private constructor() {
    this.client = new MongoClient(uri, options);
    this.clientPromise = this.client.connect();
    if (process.env.NODE_ENV === "development") {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      global._mongoClientPromise = this.clientPromise;
    }
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Singleton();
    }
    return this._instance.clientPromise;
  }
}
const clientPromise = Singleton.instance;

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
