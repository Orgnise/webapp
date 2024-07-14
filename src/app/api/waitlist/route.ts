import { HOME_DOMAIN } from "@/lib/constants/constants";
import { log } from "@/lib/functions";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmailV2 } from "../../../../emails";
import WaitingList from "../../../../emails/waitlist";

// Add and setting up the OPTIONS method
export async function OPTIONS(request: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": `${HOME_DOMAIN}`,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// API to save waitlist email
export async function POST(request: Request) {
  const client = await mongoDb;
  try {
    const credentials: { email: string } = await request.json();
    const parsedCredentials = z
      .object({ email: z.string().email() })
      .safeParse(credentials);
    if (!parsedCredentials.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
          error: parsedCredentials.error,
        },
        { status: 401 },
      );
    }
    const waitListCollection = client.db(databaseName).collection("waitlist");
    const existingMail = await waitListCollection.findOne({
      email: parsedCredentials.data.email,
    });

    if (existingMail) {
      return NextResponse.json(
        {
          success: false,
          message: "email already exists in waitlist",
        },
        { status: 200 },
      );
    }

    log({ message: `New email added to waitlist: ${parsedCredentials.data.email}`, type: "waitlist" });

    const user = await waitListCollection.insertOne({
      email: parsedCredentials.data.email,
      createdAt: new Date(),
    });
    await sendEmailV2({
      subject: `Thanks for joining waiting list on ${process.env.NEXT_PUBLIC_APP_NAME}`,
      identifier: parsedCredentials.data.email,
      react: WaitingList(),
    });
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
