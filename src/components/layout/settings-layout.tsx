import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import NavLink from "@/components/layout/settings-nav-link";
import { ReactNode } from "react";

export default function SettingsLayout({
  tabs,
  children,
}: {
  tabs: {
    name: string;
    segment: string | null;
  }[];
  children: ReactNode;
}) {
  return (
    <div className=" ">
      <div className="flex h-36 items-center border-b border-border bg-background">
        <MaxWidthWrapper>
          <div className="flex h-28   lg:h-36">
            <div className="mx-auto flex w-full max-w-screen-xl items-center gap-4 px-2.5 ">
              <h1 className="prose-2xl">Settings</h1>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper className="grid items-start gap-5 py-10 lg:grid-cols-5">
        <div className="top-36 flex gap-1 lg:sticky lg:grid">
          {tabs.map(({ name, segment }, index) => (
            <NavLink key={index} segment={segment}>
              {name}
            </NavLink>
          ))}
        </div>
        <div className="grid gap-5 lg:col-span-4">{children}</div>
      </MaxWidthWrapper>
    </div>
  );
}
