import Label from "@/components/atom/label";
import { Button } from "@/components/ui/button";
import { ListView } from "@/components/ui/listview";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";

export default async function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  // const { teamService } = useAppService();

  // const { user } = useAuth();
  // const navigate = useNavigate();

  // useSocket([SocketEvent.team.create], (event, data) => {
  //   if (event === SocketEvent.team.create) {
  //     setTeams((prev) => [...prev, data]);
  //     toast.success("Team created successfully", {
  //       position: "top-right",
  //     });
  //   }
  // });

  // Fetch team list in which authenticated user is member | owner | admin
  useEffect(() => {
    async function fetchTeams() {
      const res = await fetch("api/teams");
      const data = await res.json();
      setTeams(data["teams"]);
    }
    fetchTeams();
  }, []);

  return (
    <div className="OrganizationList h-screen flex flex-col bg-default">
      <section className="flex flex-col py-4 md:py-7 md:px-8 xl:px-10 h-full overflow-y-auto items-center">
        <div className="divide-y max-w-xl w-full px-2 sm:px-0 pt-28">
          <div className="flex flex-col  gap-5 ">
            <div className="flex">
              <Label size="h2" variant="t3" className="flex-1">
                Team
              </Label>
              <Button
                onClick={() => {
                  // navigate(AppRoutes.team.create);
                }}>
                Create Team
              </Button>
            </div>
            <ListView
              items={teams}
              loading={!teams}
              noItemsElement={
                <div className="p-4 rounded bg-surface text-xs">
                  You are not a member of any team yet. Create a new team or ask
                  someone to invite you to their team
                </div>
              }
              placeholder={
                <div className="animate-pulse p-4 rounded bg-surface flex flex-col gap-2">
                  <div className="h-8 bg-onSurface rounded w-11/12"></div>
                  <div className="h-8 bg-onSurface rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-8 bg-onSurface rounded w-11/12"></div>
                  <div className="h-8 bg-onSurface rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-8 bg-onSurface rounded w-11/12"></div>
                  <div className="h-8 bg-onSurface rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-8 bg-onSurface rounded w-11/12"></div>
                  <div className="h-8 bg-onSurface rounded w-2/12"></div>
                </div>
              }
              renderItem={(org, index) => (
                <OrganizationRow key={index} org={org} index={index} />
              )}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function OrganizationRow({ org, index }: any) {
  return (
    <div className="flex items-center py-2 first:border-t theme-border hover:bg-surface cursor-pointer px-4">
      <div className=" mr-2 hover:cursor-pointer w-full">
        <div className="flex">
          <Link href={`/team/${org.meta.slug}`} className="flex-1">
            <Label className="block" variant="s1">
              {org.name}
            </Label>
            <Label size="caption" variant="cap">
              {org.members.length} team members
            </Label>
          </Link>
          {/* <CustomDropDown
            button={<SvgIcon icon="VerticalEllipse" className="h-4" />}>
            <Label className="text-left px-4 py-2 bg-surface w-56 rounded-md">
              Team Settings
            </Label>
          </CustomDropDown> */}
        </div>
      </div>
    </div>
  );
}
