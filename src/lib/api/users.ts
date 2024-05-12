import { EmailInvite } from "@/app/api/teams/[team_slug]/invites/route";
import { Session, hashToken } from "@/lib/auth";
import mongoDb, { databaseName } from "@/lib/mongodb";
import { randomBytes } from "crypto";
import { sendEmailV2 } from "../../../emails";
import TeamInvite from "../../../emails/team-invite";
import { APP_DOMAIN, TWO_WEEKS_IN_SECONDS } from "../constants/constants";
import { Team } from "../types/types";
import { MongoClient, ObjectId } from "mongodb";

export async function inviteUser({
  emails,
  team,
  session,
}: {
  emails: Array<EmailInvite>;
  team: Team;
  session?: Session;
}) {
  // same method of generating a token as next-auth
  const expires = new Date(Date.now() + TWO_WEEKS_IN_SECONDS * 1000);
  const client = await mongoDb;
  const teamInviteCollection = client
    .db(databaseName)
    .collection("teamInvites");

  // create a team invite record and a verification request token that lasts for a week
  // TODO: add a check to see if the user is already in the team
  try {
    let inviteList = [];
    let verificationList = [];
    for (let i = 0; i < emails.length; i++) {
      inviteList.push({
        email: emails[i].email,
        expires,
        teamId: team._id,
        createdAt: new Date(),
        role: emails[i].role,
      });
      verificationList.push({
        identifier: emails[i].email,
        token: hashToken(randomBytes(32).toString("hex")),
        expires,
      });
    }
    await teamInviteCollection.insertMany(inviteList);
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
    throw new Error(error.toString());
  }
}


/**
 * Remove all team invites
 */
export async function removeAllTeamInvites(client: MongoClient, teamId: string) {
  const teamInvitesCol = client
    .db(databaseName)
    .collection("teamInvites");
  return await teamInvitesCol.deleteMany({ teamId: new ObjectId(teamId) });
}

/**
 * Remove all team users
 */
export async function removeAllTeamUsers(client: MongoClient, teamId: string) {
  const teamUsersCol = client
    .db(databaseName)
    .collection("teamUsers");
  return await teamUsersCol.deleteMany({ teamId: new ObjectId(teamId) });
}