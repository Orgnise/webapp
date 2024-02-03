import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";

// GET /api/projects/[slug] – get a specific project
export const GET = withAuth(async ({ team, headers },) => {
  return NextResponse.json(team, { headers });
});