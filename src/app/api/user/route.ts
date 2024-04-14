import mongoDb, { databaseName } from "@/lib/mongodb";
import { withSession } from "@/lib/auth";
import { trim } from "@/lib/functions/trim";
import z from "@/lib/zod";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const updateUserSchema = z.object({
  name: z.preprocess(trim, z.string().min(1).max(64)).optional(),
  email: z.preprocess(trim, z.string().email()).optional(),
  image: z.string().url().optional(),
});

// PUT /api/user – edit a specific user
export const PUT = withSession(async ({ req, session }) => {
  let { name, email, image } = await updateUserSchema.parseAsync(
    await req.json(),
  );
  try {
    const obj = {} as any;
    if (name) obj.name = name;
    if (email) obj.email = email;
    if (image) obj.picture = image;
    const client = await mongoDb;
    const usersCollection = client.db(databaseName).collection("users");
    const result = await usersCollection.updateOne({
      _id: new ObjectId(session.user.id,)
    }, {
      $set: {
        ...obj
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
});

// DELETE /api/user – delete a specific user
export const DELETE = withSession(async ({ session }) => {
  const client = await mongoDb;
  const teamUsersDb = client.db(databaseName).collection("teamUsers");
  const userIsOwnerOfTeam = await teamUsersDb.find({
    user: new ObjectId(session.user.id),
    role: "owner",
  }).toArray();

  if (userIsOwnerOfTeam.length > 0) {
    return new Response(
      "You must transfer ownership of your Team or delete them before you can delete your account.",
      { status: 422 },
    );
  } else {
    const usersColl = client.db(databaseName).collection("users");
    usersColl.deleteOne({ _id: new ObjectId(session.user.id) });

    return NextResponse.json({
      success: true,
      message: "User deleted",
    });
  }
});
