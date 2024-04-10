"use client";
import { Badge } from "@/components/ui/badge";
import useTeam from "@/lib/swr/use-team";
import { getFirstAndLastDay } from "@/lib/utility/datetime";
import { useMemo } from "react";

export default function TeamBillingPage() {
  const { team: activeTeam, loading } = useTeam();
  const plan = activeTeam?.plan ?? "free";
  const billingCycleStart = activeTeam?.billingCycleStart;

  const [billingStart, billingEnd] = useMemo(() => {
    if (billingCycleStart) {
      const { firstDay, lastDay } = getFirstAndLastDay(billingCycleStart);
      const start = firstDay.toLocaleDateString("en-us", {
        month: "short",
        day: "numeric",
      });
      const end = lastDay.toLocaleDateString("en-us", {
        month: "short",
        day: "numeric",
      });
      return [start, end];
    }
    return [];
  }, [billingCycleStart]);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-col items-start space-y-4 p-10 xl:flex-row xl:space-y-0">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium">Plan &amp; Usage</h2>
          <p className="text-sm text-muted-foreground/90">
            You are currently on the &nbsp;<Badge>{plan ?? "free"}</Badge>&nbsp;
            plan.
            {billingStart && billingEnd && (
              <>
                {" "}
                Current billing cycle:{" "}
                <span className="font-medium text-secondary-foreground">
                  {billingStart} - {billingEnd}
                </span>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
