import { Logo } from "@/components/atom/logo";
import Label from "../../atom/label";
import AddTeam from "./create-team-form";

export function CreateTeam() {
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <Logo className="h-10" />
      <Label size="h2" variant="t2">
        Create your Team
      </Label>
      <div className="flex w-full max-w-[400px] flex-col px-4 ">
        <AddTeam />
        <small className="px-6 pt-8 text-center">
          Looking to join an existing team? Ask someone of that team to invite
          you.
        </small>
      </div>
    </div>
  );
}
