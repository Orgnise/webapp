
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";


export const POST = async (request: NextRequest) => {


  const client = new MongoClient(process.env.MONGODB_URI!);

  try {

    const credentials: credentials = await request.json();
    const login = z.string()
      .regex(/^[A-Z0-9]+$/gmi, "Invalid username") //I only accept alphanumeric chars.
      .parse(credentials.login);

    const admins = client.db('myDatabase').collection('admins');

    const mongoResult: adminResult | null = await admins
      .findOne({ login: login }) as unknown as adminResult | null;

    if (mongoResult) {

      //Verify password
      const passwordIsCorrect = await bcrypt
        .compare(credentials.password, mongoResult.password);

      if (passwordIsCorrect) {

        const customUser: customUser = {
          id: mongoResult._id.toString(), //required field!!
          username: login,
        }

        return NextResponse.json(customUser);
      }

    }

    return NextResponse.json(null);

  }
  catch (err) {
    return NextResponse.json(null);
  }
  finally {
    client.close();
  }
}

type credentials = {
  login: string,
  password: string
}

type adminResult = {
  _id: ObjectId,
  login: string,
  password: string
}

export type customUser = {
  id: string,
  username: string,
}
