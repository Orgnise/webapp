"use client";
import useTeam from "@/lib/swr/use-team";

export default async function TeamsPageClient() {
  return (
    <div className="h-screen flex flex-col bg-default">
      <Team />
    </div>
  );
}

const Team = () => {
  const { team } = useTeam();
  return <div className="flex my-2 mx-auto">{team?.name}</div>;
};
