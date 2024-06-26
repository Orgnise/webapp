import { Logo } from "@/components/atom/logo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getSession } from "@/lib/auth";
import { TeamMemberDbSchema } from "@/lib/db-schema/team.schema";
import mongodb, {
  DbCollections,
  collections,
  databaseName,
} from "@/lib/mongodb";
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
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-6 bg-background/90 text-center ">
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
    redirect("/login");
  }

  const client = await mongodb;
  const teamsCollection = collections<TeamMemberDbSchema>(client, "teams");

  const teams = (await teamsCollection
    .aggregate([
      {
        $match: {
          inviteCode: code,
        },
      },
      {
        $lookup: {
          from: DbCollections.TEAM_USER,
          localField: "_id",
          foreignField: "team",
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
          message="The invite link you are trying to use is invalid. Please contact the team owner for a new invite."
        />
      </>
    );
  }

  const team = teams[0];

  // TODO: check if team is full
  // if (team.membersCount >= team.membersLimit) {
  //   return (
  //     <PageCopy
  //       title="User Limit Reached"
  //       message="The team you are trying to join is currently full. Please contact the team owner for more information."
  //     />
  //   );
  // }

  const teamUserCollection = client
    .db(databaseName)
    .collection<TeamMemberDbSchema>("team-users");

  const member = await teamUserCollection.findOne({
    team: new ObjectId(team._id),
    user: new ObjectId(session.user.id),
  });

  // check if user is already in the team
  if (member) {
    redirect(`/${team.meta.slug}`);
  }

  teamUserCollection.insertOne({
    team: new ObjectId(team._id),
    user: new ObjectId(session.user.id),
    role: "member",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  redirect(`/${team.meta.slug}`);
}
