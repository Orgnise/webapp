import SettingsLayout from "@/components/layout/settings-layout";
import { ReactNode } from "react";

export default function PersonalSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tabs = [
    {
      name: "General",
      segment: null,
    },
    {
      name: "People",
      segment: `people`,
    },
  ];

  return <SettingsLayout tabs={tabs}>{children}</SettingsLayout>;
}
