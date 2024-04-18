import { storage } from "@/lib/storage";
import { randomId } from "@/lib/utils";
import z from "@/lib/zod";
import { NextResponse } from "next/server";

export const runtime = "edge";

const uploadImageSchema = z.object({
  image: z.string().url(),
  path: z.string().optional(),
  filename: z.string().optional(),
});


export async function POST(req: Request) {


  if (!process.env.STORAGE_ACCESS_KEY_ID) {
    return new Response(
      "Missing STORAGE_ACCESS_KEY_ID. Don't forget to add that to your .env file.",
      {
        status: 401,
      },
    );
  }

  const { image, path, filename } = uploadImageSchema.parse(await req.json());

  let uploadFilePath = path ? `/${path}` : "";

  if (filename) {
    uploadFilePath = `${uploadFilePath}/${filename}`;
  } else {
    uploadFilePath = `${uploadFilePath}/${randomId(6)}`;
  }

  const { url } = await storage.upload(uploadFilePath, image);

  return NextResponse.json({ url });
}