import { HOME_DOMAIN } from "@/lib/constants";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const corsHeaders = {
  "Access-Control-Allow-Origin": `${HOME_DOMAIN}`,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

// API to save waitlist email
export async function POST(request: Request) {
  const client = await mongoDb;
  try {
    const credentials: { email: string } = await request.json();
    const parsedCredentials = z.object({ email: z.string().email() })
      .safeParse(credentials);
    if (!parsedCredentials.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
          error: parsedCredentials.error,
        },
        { status: 401, headers: corsHeaders },

      );
    }
    const waitListCollection = client.db(databaseName).collection("waitlist");
    const existingMail = (await waitListCollection.findOne({
      email: parsedCredentials.data.email,
    }));

    if (existingMail) {
      return NextResponse.json({
        success: false,
        message: "email already exists in waitlist",


      }, { status: 200, headers: corsHeaders });
    }

    const user = await waitListCollection.insertOne({
      email: parsedCredentials.data.email,
      createdAt: new Date(),
    });
    return NextResponse.json({ user }, { status: 200, headers: corsHeaders });



  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: err.toString(),
      },
      { status: 500, headers: corsHeaders },
    );
  }
}