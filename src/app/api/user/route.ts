import mongoDb, { collections, databaseName } from "@/lib/mongodb";
import { withSession } from "@/lib/auth";
import { trim } from "@/lib/functions/trim";
import z from "@/lib/zod";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { storage } from "@/lib/storage";

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
    if (image) {
      const { url } = await storage.upload(`avatars/${session.user.id}`, image);
      image = url;
      console.log({ image });
    }
    const obj = {} as any;
    if (name) obj.name = name;
    if (email) obj.email = email;
    if (image) obj.image = image;
    const client = await mongoDb;
    const usersCollection = collections(client, "users");
    const result = await usersCollection.updateOne({
      _id: new ObjectId(session.user.id,)
    }, {
      $set: {
        ...obj,
        updatedAt: new Date(),
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
  const teamUsersDb = client.db(databaseName).collection("team-users");
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
    await Promise.allSettled([
      // if the user has a custom avatar, delete it
      session.user.image?.startsWith(process.env.STORAGE_BASE_URL as string) &&
      storage.delete(`avatars/${session.user.id}`),

      // Delete the user
      usersColl.deleteOne({ _id: new ObjectId(session.user.id) }),
    ]);


    return NextResponse.json({
      success: true,
      message: "User deleted",
    });
  }
});
