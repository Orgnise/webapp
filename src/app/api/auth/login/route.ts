import mongoDb, { databaseName } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";
import { User } from "../../../../../types/user.type";

export async function POST(request: Request) {
  const client = await mongoDb;
  try {
    const credentials: credentials = await request.json();
    const parsedCredentials = z
      .object({ email: z.string().email(), password: z.string().min(6) })
      .safeParse(credentials);
    if (!parsedCredentials.success) {
      if (!parsedCredentials.success) {
        return NextResponse.json(
          {
            success: false,
            message: "authentication failed",
            error: parsedCredentials.error,
          },
          { status: 401 },
        );
      }
    }
    const users = client.db(databaseName).collection("users");
    const existingUser: mongoUserResult | null = (await users.findOne({
      email: parsedCredentials.data.email,
    })) as unknown as mongoUserResult | null;

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "email or password is incorrect",
        error: "authentication failed",

      }, { status: 401 });
    }
    //Verify password
    const passwordIsCorrect = await bcrypt.compare(
      credentials.password,
      existingUser.password,
    );

    if (!passwordIsCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "email or password is incorrect",
          error: "authentication failed",
        },
        { status: 401 },
      );
    }
    const user: User = {
      id: existingUser._id.toString(), //required field!!
      email: existingUser.email,
      name: existingUser.name,
      image:
        existingUser.image ??
        `https://api.dicebear.com/7.x/initials/svg?seed=${existingUser.name}`,
    };

    return NextResponse.json({ user }, { status: 200 });



  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: err.toString(),
      },
      { status: 500 },
    );
  }
}

type credentials = {
  email: string;
  password: string;
  name: string;
};

type mongoUserResult = {
  _id: ObjectId;
  login: string;
  password: string;
  name?: string;
  email?: string;
  image?: string;
};
