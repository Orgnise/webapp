import Link from "next/link";
import Label from "../../atom/label";
import AddTeam from "./create-team-form";

export function CreateTeam() {
  return (
    <div className="flex flex-col gap-6 p-6 items-center bg-card shadow-md border  w-full  rounded-lg max-w-[500px]">
      <Label size="h2" variant="t2">
        Create your Team
      </Label>
      <div className="flex flex-col w-full px-4 max-w-[400px] ">
        <AddTeam />
        <span className="p-6">
          <span>
            Looking to join an existing team? Ask someone of that team to invite
            you and
          </span>
          <span className="pl-2 text-primary">
            <Link href={"./"} className="theme-text-primary">
              check your team
            </Link>
          </span>
        </span>
      </div>
    </div>
  );
}
