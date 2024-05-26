import mongoDb, { databaseName } from "@/lib/mongodb";
import { withTeam } from "@/lib/auth";
import { storage } from "@/lib/storage";
import z from "@/lib/zod";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const uploadLogoSchema = z.object({
  image: z.string().url(),
});

// POST /api/teams/[team_slug]/logo – upload a new team logo
export const POST = withTeam(
  async ({ req, team }) => {
    const { image } = uploadLogoSchema.parse(await req.json());

    const { url } = await storage.upload(`logos/${team._id}`, image);
    const client = await mongoDb;
    const teamsDb = client.db(databaseName).collection("teams");
    const query = { _id: new ObjectId(team._id) };
    await teamsDb.updateOne(query, { $set: { logo: url, updatedAt: new Date() } });
    return NextResponse.json({
      message: "Logo uploaded successfully!",
    }, {
      status: 200,
    });
  },
  {
    requiredRole: ["owner"],
  },
);
