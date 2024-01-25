
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { User } from "../../../../types/user.type";
import mongoDb from "@/lib/mongodb";


export async function POST(request: NextRequest) {
  const client = await mongoDb;
  try {

    const credentials: credentials = await request.json();
    const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string() }).safeParse(credentials);
    if (!parsedCredentials.success) {
      return NextResponse.json(
        { success: false, message: 'Operation failed', error: parsedCredentials.error },
        { status: 400 }
      )
    }
    const users = client.db('pulse-db').collection('users');
    const mongoResult: mongoUserResult | null = await users
      .findOne({ email: parsedCredentials.data.email }) as unknown as mongoUserResult | null;

    if (mongoResult) {
      return NextResponse.json(
        { success: false, message: 'Operation failed', error: 'User already exists' },
        { status: 400 }
      )
    }
    else {
      const hashedPassword = await bcrypt.hash(parsedCredentials.data.password, 10);
      const newUser = {
        email: parsedCredentials.data.email,
        password: hashedPassword,
        name: parsedCredentials.data.name,
        provider: 'credentials',
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${parsedCredentials.data.name}`
      }
      const insertResult = await users.insertOne(newUser);
      const customUser: User = {
        id: insertResult.insertedId.toString(), //required field!!
        email: newUser.email,
        name: newUser.name,
        image: newUser.image
      }
      return NextResponse.json({ user: customUser });
    }
  }
  catch (err) {
    return NextResponse.json(null);
  }
  finally {
    client.close();
  }
}

type credentials = {
  email: string,
  password: string
  name: string
}

export type mongoUserResult = {
  _id: ObjectId,
  login: string,
  password: string
  name?: string,
  email?: string,
  image?: string,
  emailVerified?: boolean,
  provider?: string,
  type?: string,
}

