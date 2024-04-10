import mongoDb, { databaseName } from "@/lib/mongodb";
import { Session, } from "@/lib/auth";
import { randomBytes } from "crypto";
import { sendEmail, sendEmailV2 } from "../../../emails";
import TeamInvite from "../../../emails/team-invite";
import { hashToken } from "../auth/auth";
import { Team } from "../types/types";
import { APP_DOMAIN, TWO_WEEKS_IN_SECONDS } from "../constants";
import { EmailInvite } from "@/app/api/teams/[team_slug]/invites/route";
import SMTPPool from "nodemailer/lib/smtp-pool";

export async function inviteUser({
  emails,
  team,
  session,
}: {
  emails: Array<EmailInvite>
  team: Team;
  session?: Session;
}) {
  // same method of generating a token as next-auth
  const expires = new Date(Date.now() + TWO_WEEKS_IN_SECONDS * 1000);
  const client = await mongoDb;
  const teamInviteUsersCollection = client.db(databaseName).collection("teamInviteUsers");

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
        expires
      });
    }
    await teamInviteUsersCollection.insertMany(
      inviteList
    );
    const verificationTokenCollection = client.db(databaseName).collection("verification_tokens");
    await verificationTokenCollection.insertMany(verificationList);



    const result = await Promise.all(
      verificationList.map(async (e) => {
        // const params = new URLSearchParams({
        //   callbackUrl: `${APP_DOMAIN}/${team.meta.slug}`,
        //   email: e.identifier,
        //   token: e.token,
        // });

        // const url = `${APP_DOMAIN}/api/auth/callback/email?${params}`;
        const url = `${APP_DOMAIN}/${team.meta.slug}`
        if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD || process.env.NODE_ENV !== "development") {
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

      })
    )

  } catch (error: any) {
    throw new Error(error.toString());
  }
}
