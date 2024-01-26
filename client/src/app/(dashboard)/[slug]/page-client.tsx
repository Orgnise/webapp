"use client";

import { Button } from "@/components/ui/button";
import Label from "@/components/atom/label";
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
  return <div className="flex-1 flex my-2 mx-auto">
    <div className="flex items-center place-content-center">
      <div className="flex flex-col gap-4 w-full items-center place-content-center max-w-xl mx-auto text-center">
        <Label size="h1" variant="t3">
          Create a workspace
        </Label>
        <span className="text-sm">
          Workspaces are where you
          <Label variant="t2" className="mx-1 ">
            organize your work
          </Label>
          You can create workspaces for different teams, clients, or even for
          yourself. For example, an{" "}
          <Label variant="t2" className="mx-1 ">
            engineering
          </Label>
          workspace could contains all engineering-related tasks.
        </span>
        <Button variant={"outline"}>
          Create Workspace
        </Button>
      </div>
    </div>
  </div>;
};
