import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";
import { parse } from "./lib/utils";
import { API_HOSTNAMES } from "./lib/constants/constants";
import ApiMiddleware from "./lib/middleware/api";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export const middleware = async (req: NextRequest) => {
  const { domain, path, fullPath } = parse(req);

  // for API
  if (API_HOSTNAMES.has(domain)) {
    return ApiMiddleware(req);
  }


  const session = await getToken({
    req: req,
    secret: process.env.AUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });

  const loggedIn = session?.user ? true : false;


  if (["/terms", "/policy"].includes(path)) {
    return NextResponse.next();
  }
  // Redirect to login if not logged in
  else if (
    !["/login", "/signup", "terms", "policy", "/credential"].includes(path) &&
    !loggedIn
  ) {
    return NextResponse.redirect(
      new URL(
        `/login${path === "/" ? "" : `?next=${encodeURIComponent(fullPath)}`}`,
        req.url,
      ),
    );
  }

  // Redirect to home if logged in and trying to access login or signup
  else if (
    loggedIn &&
    (path === "/login" || path === "/signup" || path === "/credential")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  } else {
    return NextResponse.next();
  }
};
