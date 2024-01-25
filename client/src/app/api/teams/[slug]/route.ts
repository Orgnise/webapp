import { withAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/projects/[slug] – get a specific project
export const GET = withAuth(async ({ team, headers }) => {
  return NextResponse.json(team, { headers });
});