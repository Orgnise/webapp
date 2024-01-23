
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { User } from "../../../../types/user.type";
import mongoDb from "@/lib/mongodb";

export async function POST(request: Request) {
  const client = await mongoDb
  try {
    const credentials: credentials = await request.json();
    const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);
    if (!parsedCredentials.success) {
      if (!parsedCredentials.success) {
        return NextResponse.json(
          { success: false, message: 'authentication failed', error: parsedCredentials.error },
          { status: 401 }
        )
      }
    }
    const users = client.db('pulse-db').collection('users');
    const mongoResult: mongoUserResult | null = await users
      .findOne({ email: parsedCredentials.data.email }) as unknown as mongoUserResult | null;

    if (mongoResult) {
      //Verify password
      const passwordIsCorrect = await bcrypt
        .compare(credentials.password, mongoResult.password);

      if (passwordIsCorrect) {

        const customUser: User = {
          id: mongoResult._id.toString(), //required field!!
          email: mongoResult.email,
          name: mongoResult.name,
          image: mongoResult.image ?? `https://api.dicebear.com/7.x/initials/svg?seed=${mongoResult.name}`
        }

        return NextResponse.json({ user: customUser });
      } else {
        return NextResponse.json(
          { success: false, message: 'authentication failed', error: 'email or password is incorrect' },
          { status: 401 }
        )
      }

    }
    return NextResponse.json(null);
  }
  catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', error: err.toString() },
      { status: 500 }
    )
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

type mongoUserResult = {
  _id: ObjectId,
  login: string,
  password: string
  name?: string,
  email?: string,
  image?: string
}

