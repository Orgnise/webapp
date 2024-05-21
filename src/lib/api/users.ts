import { Session, hashToken } from "@/lib/auth";
import { collections, databaseName } from "@/lib/mongodb";
import { randomBytes } from "crypto";
import { MongoClient, ObjectId } from "mongodb";
import { sendEmailV2 } from "../../../emails";
import TeamInvite from "../../../emails/team-invite";
import { APP_DOMAIN, TWO_WEEKS_IN_SECONDS } from "../constants/constants";
import { TeamInviteDbSchema } from "../db-schema";
import { Team } from "../types/types";
import { SendInviteSchema } from "../zod/schemas";
import { OrgniseApiError } from "@/lib/api";

export async function inviteUser({
  client,
  invites,
  team,
  session,
}: {
  client: MongoClient;
  invites: typeof SendInviteSchema._type.invites;
  team: Team;
  session?: Session;
}) {
  // same method of generating a token as next-auth
  const expires = new Date(Date.now() + TWO_WEEKS_IN_SECONDS * 1000);

  const inviteCollection = collections<TeamInviteDbSchema>(client, "team-invites");

  // create a team invite record and a verification request token that lasts for a week
  // TODO: add a check to see if the user is already in the team
  try {
    let inviteList = [];
    let verificationList = [];
    for (let i = 0; i < invites.length; i++) {
      inviteList.push({
        email: invites[i].email,
        expires,
        team: new ObjectId(team._id),
        createdAt: new Date(),
        role: invites[i].role,
      } as TeamInviteDbSchema
      );
      verificationList.push({
        identifier: invites[i].email,
        token: hashToken(randomBytes(32).toString("hex")),
        expires,
      });
    }
    await inviteCollection.insertMany(inviteList);
    const verificationTokenCollection = client
      .db(databaseName)
      .collection("verification_tokens");
    await verificationTokenCollection.insertMany(verificationList);

    const result = await Promise.all(
      verificationList.map(async (e) => {
        // const params = new URLSearchParams({
        //   callbackUrl: `${APP_DOMAIN}/${team.meta.slug}`,
        //   email: e.identifier,
        //   token: e.token,
        // });

        // const url = `${APP_DOMAIN}/api/auth/callback/email?${params}`;
        const url = `${APP_DOMAIN}/${team.meta.slug}`;
        if (
          !process.env.EMAIL_SERVER_USER ||
          !process.env.EMAIL_SERVER_PASSWORD ||
          process.env.NODE_ENV === "development"
        ) {
          console.log(`Login link: ${url}`);
          return url;
        }

        return await sendEmailV2({
          subject: `You've been invited to join a team on ${process.env.NEXT_PUBLIC_APP_NAME}`,
          identifier: e.identifier,
          react: TeamInvite({
            email: e.identifier,
            appName: process.env.NEXT_PUBLIC_APP_NAME as string,
            url,
            teamName: team.name,
            teamUser: session?.user.name || null,
            teamUserEmail: session?.user.email || null,
          }),
        });
      }),
    );
  } catch (error: any) {
    console.error({ error });
    if (error?.errorResponse?.code) {
      throw new OrgniseApiError({
        code: 'bad_request',
        message: 'Invite are already sent to some of the emails. Please check the emails and try again.'
      })
    }
    throw new Error(error.toString());
  }
}


/**
 * Remove all team invites
 */
export async function removeAllTeamInvites(client: MongoClient, teamId: string) {
  const inviteCollection = collections<TeamInviteDbSchema>(client, "team-invites");;
  return await inviteCollection.deleteMany({ team: new ObjectId(teamId) });
}

/**
 * Remove all team users
 */
export async function removeAllTeamUsers(client: MongoClient, teamId: string) {
  const teamUsersCol = client
    .db(databaseName)
    .collection("team-users");
  return await teamUsersCol.deleteMany({ team: new ObjectId(teamId) });
}