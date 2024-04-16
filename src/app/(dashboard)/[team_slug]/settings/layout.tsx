"use client";

import SettingsLayout from "@/components/layout/settings-layout";
import { ReactNode } from "react";

export default function TeamLayout({ children }: { children: ReactNode }) {
  const tabs = [
    {
      name: "General",
      segment: null,
    },
    {
      name: "People",
      segment: "people",
    },
    {
      name: "Billing",
      segment: "billing",
    },
  ];
  return <SettingsLayout tabs={tabs}>{children}</SettingsLayout>;
}
