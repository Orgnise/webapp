import { Logo } from "@/components/atom/logo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getSession } from "@/lib/auth";
import mongodb, { databaseName } from "@/lib/mongodb";
import { TeamSchema, TeamUserSchema } from "@/lib/schema/team.schema";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const runtime = "nodejs";

const PageCopy = ({ title, message }: { title: string; message: string }) => {
  return (
    <>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="max-w-lg text-muted-foreground [text-wrap:balance] sm:text-lg">
        {message}
      </p>
    </>
  );
};

export default function InvitesPage({
  params,
}: {
  params: {
    code: string;
  };
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6 text-center">
      <Logo className="h-12 w-12" />
      <Suspense
        fallback={
          <>
            <PageCopy
              title="Verifying Invite"
              message={`Pulse is verifying your invite link...`}
            />
            <LoadingSpinner className="h-7 w-7" />
          </>
        }
      >
        <VerifyInvite code={params.code} />
      </Suspense>
    </div>
  );
}

async function VerifyInvite({ code }: { code: string }) {
  const session = await getSession();

  if (!session) {
    console.log("no session");
    redirect("/login");
  }

  const client = await mongodb;
  const teamsDb = client.db(databaseName).collection("teams");
  const teamUsersDb = client
    .db(databaseName)
    .collection<TeamUserSchema>("teamUsers");

  const team = (await teamsDb.findOne({
    inviteCode: code,
  })) as unknown as TeamSchema;

  if (!team) {
    return (
      <>
        <PageCopy
          title="Invalid Invite"
          message="The invite link you are trying to use is invalid. Please contact the project owner for a new invite."
        />
      </>
    );
  }

  const teamUsers = (await teamUsersDb.findOne({
    teamId: new ObjectId(team._id),
    // users: {
    //   $elemMatch: { user: new ObjectId(session.user.id) },
    // },
  })) as unknown as TeamUserSchema;

  // check if user is already in the project
  const user = teamUsers.users.find((u) =>
    u.user.equals(new ObjectId(session.user.id)),
  );
  if (user) {
    redirect(`/${team.meta.slug}`);
  }

  // check if team is full
  if (teamUsers.users.length >= team.membersLimit) {
    return (
      <PageCopy
        title="User Limit Reached"
        message="The team you are trying to join is currently full. Please contact the project owner for more information."
      />
    );
  }

  // add user to team
  await teamUsersDb.findOneAndUpdate(
    {
      teamId: new ObjectId(team._id),
    },
    {
      $push: {
        users: {
          user: new ObjectId(session.user.id),
          role: "member",
          teamId: new ObjectId(team._id),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  );
  redirect(`/${team.meta.slug}`);
}
