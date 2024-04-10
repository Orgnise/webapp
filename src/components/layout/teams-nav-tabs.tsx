import useTeam from "@/lib/swr/use-team";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Tab from "../atom/tab";

export default function NavTabs() {
  const pathname = usePathname();
  const { team_slug, workspace_slug } = useParams() as {
    team_slug?: string;
    workspace_slug?: string;
  };
  const { loading, error, team } = useTeam();

  const tabs = [
    { name: "Workspaces", href: `/${team_slug}` },
    { name: "Settings", href: `/${team_slug}/settings` },
  ];

  if (
    !team_slug ||
    error ||
    (workspace_slug && pathname !== `/${team_slug}/settings`)
  )
    return null;

  return (
    <div className="flex h-12 items-end justify-start space-x-2 overflow-x-auto">
      {loading && !team ? (
        <div className="h-12 w-full border"></div>
      ) : (
        tabs.map(({ name, href }) => (
          <Link key={href} href={href} className="relative">
            <Tab tab={name} selected={pathname === href} onClick={(e) => {}} />
          </Link>
        ))
      )}
    </div>
  );
}
