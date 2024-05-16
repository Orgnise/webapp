import { Suspense } from "react";
import TeamBillingPageClient from "./billing-page-client";

export default function TeamBillingPage() {
  return (
    <Suspense>
      <TeamBillingPageClient />
    </Suspense>
  );
}
