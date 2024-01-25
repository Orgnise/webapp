import { NextAuthOptions } from "@/lib/auth/auth";
import NextAuth, { AuthOptions } from "next-auth";


const handler = NextAuth(NextAuthOptions);

export { handler as GET, handler as POST };

export default async function GET(req: any, res: any) {
  return NextAuth(req, res, NextAuthOptions)
}