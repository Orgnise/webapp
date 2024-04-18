import mongoDb, { databaseName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { hashToken, withSession } from "@/lib/auth";
// import { qstash } from "@/lib/cron";
import { NextResponse } from "next/server";
import { randomId } from "@/lib/utils";

// GET /api/user/tokens – get all tokens for a specific user
export const GET = withSession(async ({ session }) => {
  const client = await mongoDb;
  const tokenCollection = client.db(databaseName).collection("token");
  const tokens = await tokenCollection.find({ user: new ObjectId(session.user.id) }, {
    projection: {
      name: 1,
      partialKey: 1,
      createdAt: 1,
      lastUsed: 1,
    },
    sort: {
      lastUsed: -1,
      createdAt: -1,
    },

  }).toArray();
  return NextResponse.json(tokens);
});

// POST /api/user/tokens – create a new token for a specific user
export const POST = withSession(async ({ req, session }) => {
  const { name } = await req.json();
  const client = await mongoDb;
  const tokenCollection = client.db(databaseName).collection("token");
  const token = randomId(24);
  const hashedKey = hashToken(token, {
    noSecret: true,
  });
  // take first 3 and last 4 characters of the key
  const partialKey = `${token.slice(0, 3)}...${token.slice(-4)}`;
  await tokenCollection.insertOne({
    name,
    hashedKey,
    partialKey,
    user: new ObjectId(session.user.id),
    createdAt: new Date(),
    lastUsed: new Date(),
  });
  // TODO: Send a notification mail using cron
  return NextResponse.json({ token });
});

// DELETE /api/user/tokens – delete a token for a specific user
export const DELETE = withSession(async ({ searchParams, session }) => {
  const { id } = searchParams;
  const client = await mongoDb;
  const tokenCollection = client.db(databaseName).collection("token");
  const response = await tokenCollection.deleteOne({ _id: new ObjectId(id), user: new ObjectId(session.user.id) });
  return NextResponse.json({
    success: response.deletedCount === 1,
    message: response.deletedCount === 1 ? "Token deleted successfully" : "Token not found",
  });
});
