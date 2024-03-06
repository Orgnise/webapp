import { Logo } from "@/components/atom/logo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getSession } from "@/lib/auth";
import { TeamUsers, Teams } from "@/lib/models/team.modal";
import mongodb, { databaseName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const runtime = "nodejs";

const PageCopy = ({ title, message }: { title: string; message: string }) => {
  return (
    <>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="max-w-lg text-gray-600 [text-wrap:balance] sm:text-lg">
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
    redirect("/login");
  }

  // const project = await prisma.project.findUnique({
  //   where: {
  //     inviteCode: code,
  //   },
  //   select: {
  //     id: true,
  //     slug: true,
  //     usersLimit: true,
  //     users: {
  //       where: {
  //         userId: session.user.id,
  //       },
  //       select: {
  //         role: true,
  //       },
  //     },
  //     _count: {
  //       select: {
  //         users: true,
  //       },
  //     },
  //   },
  // });
  const client = await mongodb;
  const teamsDb = client.db(databaseName).collection("teams");
  const teamUsersDb = client
    .db(databaseName)
    .collection<TeamUsers>("teamUsers");
  const team = (await teamsDb.findOne({
    inviteCode: code,
  })) as unknown as Teams;
  const user = await teamUsersDb.findOne({
    teamId: new ObjectId(team._id),
    users: {
      $elemMatch: { user: new ObjectId(session.user.id) },
    },
  });

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

  // check if user is already in the project
  if (user) {
    redirect(`/${team.meta.slug}`);
  }

  // if (project._count.users >= project.usersLimit) {
  //   return (
  //     <PageCopy
  //       title="User Limit Reached"
  //       message="The project you are trying to join is currently full. Please contact the project owner for more information."
  //     />
  //   );
  // }

  // await prisma.projectUsers.create({
  //   data: {
  //     userId: session.user.id,
  //     projectId: project.id,
  //   },
  // });
  const akg = await teamUsersDb.findOneAndUpdate(
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
  console.log("akg", akg);
  redirect(`/${team.meta.slug}`);
}
