import { User } from "next-auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {

  const session: session = await fetch(`${process.env.SERVER_URL}/api/auth/session`, {
    // headers: headers(),
    cache: "no-store"
  })
    .then(async (res) => await res.json());

  const loggedIn = Object.keys(session).length > 0 ? true : false;
  const pathname = request.nextUrl.pathname;

  if (pathname != "/login" && !loggedIn) {
    return NextResponse.redirect(new URL('/login', process.env.SERVER_URL));
  } else {
    return NextResponse.next();
  }

}

export const config = {
  // matcher: ["/admin/:path*"]
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

type session = {} | User;