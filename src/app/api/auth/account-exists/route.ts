import mongoDb, { databaseName } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const client = await mongoDb;
  const { email } = (await req.json()) as { email: string };
  if (!process.env.MONGODB_URI) {
    return new Response("Database connection not established", {
      status: 500,
    });
  }

  const userCollection = client.db(databaseName).collection("users");
  const user = await userCollection.findOne({
    email: email,
  });

  if (user) {
    return NextResponse.json({ exists: true });
  }

  return NextResponse.json({ exists: false });
}
