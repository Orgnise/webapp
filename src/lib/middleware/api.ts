import { NextRequest, NextResponse } from "next/server";
import { parse } from "../utils";

export default function ApiMiddleware(req: NextRequest) {
  const { path, fullPath } = parse(req);

  // Note: we don't have to account for paths starting with `/api`
  // since they're automatically excluded via our middleware matcher
  return NextResponse.rewrite(new URL(`/api${fullPath}`, req.url));
}
