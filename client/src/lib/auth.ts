import NextAuth from 'next-auth';
import GitHub from "@auth/core/providers/github"
import Google from "next-auth/providers/google"
import Credentials from 'next-auth/providers/credentials';
import Twitter from "next-auth/providers/twitter"
import { AuthOptions, } from "next-auth";
import { z } from 'zod';


export const NextAuthOptions = {
  pages: {
    signIn: "/login",
    // signOut: "/signout",
    // error: "/auth/error",
    // verifyRequest: "/auth/verify-request",
    // newUser: "/auth/new-user"
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        login: { label: "username" },
        password: { label: "password", type: "password" }
      },
      name: "Credentials",
      async authorize(credentials, req) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);


        if (parsedCredentials.success) {
          const authResponse = await fetch(`${process.env.SERVER_URL}/auth/login`,
            {
              method: "POST",
              body: JSON.stringify(parsedCredentials.data),
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-cache" //! To be removed after done testing

            })
          if (!authResponse.ok) {
            return null
          }
          const res = await authResponse.json()
          return res.user

        }
        return null;
      },
    }),

    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID ?? "",
      clientSecret: process.env.AUTH_TWITTER_SECRET ?? "",
      // version: "2",
    })
  ],
  callbacks: {
    async signIn({ account, profile }: any) {
      console.log("signIn begin", { account, profile })
      // if (account.provider === "google") {
      //   return profile.email_verified && profile.email.endsWith("@example.com");
      // }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    async jwt({ token, user, account, profile }) {
      console.log("jwt begin", { token, user, account, profile })
      if (account && account.type === "credentials") {
        token.userId = account.providerAccountId;
      }
      if (user) {
        token.id = user.id
      }
      return token
    },

    authorized({ auth, request: { nextUrl } }: any) {
      console.log("authorized begin", { auth, nextUrl })
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },

  },
  secret: process.env.AUTH_SECRET,
  logger: {
    error(code, ...message) {
      console.error(code, message)
    },
    warn(code, ...message) {
      console.warn(code, message)
    },
    debug(code, ...message) {
      console.debug(code, message)
    }
  }
} as AuthOptions;

export const { auth, signIn, signOut } = NextAuth({
  ...NextAuthOptions,
});

