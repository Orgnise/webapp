import { Logo } from "@/components/atom/logo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getSession } from "@/lib/auth";
import mongodb, { databaseName } from "@/lib/mongodb";
import { TeamMemberSchema } from "@/lib/schema/team.schema";
import { Team } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";
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
              message={`Orgnise is verifying your invite link...`}
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
  const teamsCollection = client.db(databaseName).collection("teams");

  const teams = (await teamsCollection
    .aggregate([
      {
        $match: {
          inviteCode: code,
        },
      },
      {
        $lookup: {
          from: "teamUsers",
          localField: "_id",
          foreignField: "teamId",
          as: "members",
        },
      },
      {
        $addFields: { membersCount: { $size: "$members" } },
      },
    ])
    .toArray()) as unknown as Team[];

  if (!hasValue(teams)) {
    return (
      <>
        <PageCopy
          title="Invalid Invite"
          message="The invite link you are trying to use is invalid. Please contact the project owner for a new invite."
        />
      </>
    );
  }

  const team = teams[0];

  // TODO: check if team is full
  if (team.membersCount >= team.membersLimit) {
    return (
      <PageCopy
        title="User Limit Reached"
        message="The team you are trying to join is currently full. Please contact the project owner for more information."
      />
    );
  }

  const teamUserCollection = client
    .db(databaseName)
    .collection<TeamMemberSchema>("teamUsers");

  const member = (await teamUserCollection.findOne({
    teamId: new ObjectId(team._id),
    user: new ObjectId(session.user.id),
  })) as unknown as TeamMemberSchema;

  // check if user is already in the project
  if (member) {
    redirect(`/${team.meta.slug}`);
  }

  teamUserCollection.insertOne({
    teamId: new ObjectId(team._id),
    user: new ObjectId(session.user.id),
    role: "member",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  redirect(`/${team.meta.slug}`);
}
