import { mongoUserResult } from "@/app/api/auth/signup/route";
import GitHub from "@auth/core/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import EmailProvider from "next-auth/providers/email";
import { z } from "zod";
import mongoDb, { databaseName } from "../mongodb";
import LoginLink from "../../../emails/login-link";
import { sendEmail, sendEmailV2 } from "../../../emails";
import { APP_DOMAIN } from "../constants";

const backendURL = process.env.NEXT_PUBLIC_URL;

export const NextAuthOptions = {
  adapter: MongoDBAdapter(mongoDb),
  pages: {
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    EmailProvider({
      sendVerificationRequest({ identifier, url }) {
        console.log("sendVerificationRequest", { identifier, url });
        if (process.env.NODE_ENV === "development") {
          console.log(`Login link: ${url}`);
          return;
        } else {
          sendEmailV2({
            identifier,
            provider: {
              server: process.env.EMAIL_SERVER ?? "",
              from: process.env.EMAIL_FROM ?? "",
            },
            subject: `Your ${process.env.NEXT_PUBLIC_APP_NAME} Login Link`,
            react: LoginLink({ url, email: identifier }),
          });
        }

      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
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
      allowDangerousEmailAccountLinking: true,
      // version: "2",
    }),
    Credentials({
      credentials: {
        email: { label: "email" },
        password: { label: "password", type: "password" },
      },
      name: "Credentials",
      async authorize(credentials, req) {
        const feUrl = APP_DOMAIN;
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const authResponse = await fetch(`${feUrl}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(parsedCredentials.data),
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-cache", //! To be removed after done testing
          });
          const res = await authResponse.json();
          if (authResponse.status != 200 || !authResponse.ok) {
            console.log("authResponse [failure]", res);
            return null;
          }
          console.log("authResponse [Success]", res);
          return res.user;
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile, user }: any) {
      // console.log("signIn begin", { account, profile, user });
      if (!user?.email) {
        return false;
      }

      if (["google", "github"].includes(account.provider)) {
        const client = await mongoDb;
        const users = client.db(databaseName).collection("users");
        const userExists = (await users.findOne({
          email: profile.email,
        })) as unknown as mongoUserResult | null;

        // If the user doesn't exist, create a new one
        if (!userExists) {
          const image =
            profile.avatar_url ??
            profile.picture ??
            profile.profile_image_url ??
            `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`;
          const newUser = {
            email: profile.email,
            name: profile.name,
            image: image,
            provider: account.provider,
            providerAccountId: account.id,
            type: "oauth",
            emailVerified: true,
          };
          const insertResult = await users.insertOne(newUser);
          const customUser = {
            id: insertResult.insertedId.toString(), //required field!!
            email: newUser.email,
            name: newUser.name,
            image: newUser.image,
          };
          return customUser;
        }
        // Update the user's image if it doesn't exist
        else if (userExists && !userExists.image && profile.picture) {
          const image =
            profile.avatar_url ?? profile.picture ?? profile.profile_image_url;
          await users.updateOne(
            { email: profile.email },
            { $set: { image: image } },
          );
        }
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    async jwt({ token, user, account, profile }) {
      // console.log("jwt begin", { token, user, account, profile })
      if (!token.email) {
        return {};
      }

      if (account && account.type === "credentials") {
        token.userId = account.providerAccountId;
      }
      if (user) {
        token.user = user;
      }
      return token;
    },

    authorized({ auth, request: { nextUrl } }: any) {
      // console.log("authorized begin", { auth, nextUrl })
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async session({ session, token, user }) {
      // console.log("session begin", { session, token, user })
      session.user = {
        id: token.sub,
        ...session.user,
      };
      return session;
    },
  },
  events: {
    async signIn(message) {
      /* on new user */
      if (message.isNewUser) {
        // To be used for sending welcome emails
      }
      /* on successful sign in */
      // console.log("signIn event", message)
    },
    async signOut(message) {
      /* on signout */
    },
    async createUser(message) {
      /* user created */
      console.log("createUser event", message);
    },
    async linkAccount(message) {
      /* account linked to a user */
    },
    async session(message) {
      /* session is active */
    },
    async error() {
      /* error in authentication flow */
    },
  },
  secret: process.env.AUTH_SECRET,
  logger: {
    error(code, ...message) {
      console.error(code, message);
    },
    warn(code, ...message) {
      console.warn(code, message);
    },
    debug(code, ...message) {
      console.debug(code, message)
    },
  },
} as AuthOptions;

export const { auth, signIn, signOut } = NextAuth({
  ...NextAuthOptions,
});
