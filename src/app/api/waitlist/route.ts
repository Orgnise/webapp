import { HOME_DOMAIN } from "@/lib/constants";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

const allowCors = (fn: any) => async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', HOME_DOMAIN)
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}


// API to save waitlist email
async function POST(request: Request) {
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
        { status: 401 },
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


      }, { status: 200 });
    }

    const user = await waitListCollection.insertOne({
      email: parsedCredentials.data.email,
      createdAt: new Date(),
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

export default allowCors(POST);