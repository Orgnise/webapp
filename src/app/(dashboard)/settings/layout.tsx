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
      name: "API Keys",
      segment: "tokens",
    },
  ];

  return <SettingsLayout tabs={tabs}>{children}</SettingsLayout>;
}
