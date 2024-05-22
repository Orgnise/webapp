"use client";
import TeamPermissionView from "@/components/molecule/team-permisson-view";
import { InfoTooltip, NumberTooltip } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button2 } from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import { useUpgradePlanModal } from "@/components/ui/models/upgrade-plan-modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useRouterStuff } from "@/lib/hooks";
import useTeam from "@/lib/swr/use-team";
import { getFirstAndLastDay } from "@/lib/utility/datetime";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { mutate } from "swr";
import TeamBillingSettingsLoading from "./loading";

export default function TeamBillingPageClient() {
  const [isManageSubscriptionClicked, setManageSubscriptionClicked] =
    useState(false);
  const { activeTeam, loading, nextPlan, stripeId, usage, limit } = useTeam();
  const plan = activeTeam?.plan ?? "free";
  const billingCycleStart = activeTeam?.billingCycleStart;
  const { queryParams, router } = useRouterStuff();
  const searchParams = useSearchParams();

  const { UpgradePlanModal, setShowUpgradePlanModal } = useUpgradePlanModal();

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

  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (searchParams?.get("success")) {
      toast.success("Upgrade success!");
      setConfetti(true);
      setTimeout(() => {
        mutate(`/api/teams/${activeTeam?.meta.slug}`);
      }, 1000);
    }
  }, [searchParams, activeTeam?.meta?.slug]);

  if (loading) {
    return <TeamBillingSettingsLoading />;
  }

  return (
    <>
      <Confetti active={confetti} config={{ elementCount: 200, spread: 90 }} />

      <div className="rounded-lg border border-border bg-card">
        <div className="flex flex-col items-start space-y-4  px-10 py-6 ">
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
          {stripeId && (
            <div>
              <Button2
                text="Manage Subscription"
                variant="secondary"
                className="h-9"
                onClick={() => {
                  setManageSubscriptionClicked(true);
                  fetch(`/api/teams/${activeTeam?.meta?.slug}/billing/manage`, {
                    method: "POST",
                  })
                    .then(async (res) => {
                      const url = await res.json();
                      router.push(url);
                    })
                    .catch((err) => {
                      alert(err);
                      setManageSubscriptionClicked(false);
                    });
                }}
                loading={isManageSubscriptionClicked}
              />
            </div>
          )}
        </div>
        <div className="grid divide-y divide-border border-y border-border">
          <UsageCategory
            title="Created pages"
            unit="pages"
            tooltip="Number of pages created in the all workspaces in your team"
            usage={usage?.pages}
            usageLimit={limit?.pages}
          />
          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <UsageCategory
              title="Created workspace"
              unit="workspace"
              tooltip="Number of workspaces created in the team"
              usage={usage?.workspaces}
              usageLimit={limit?.workspaces}
              numberOnly
            />
            <UsageCategory
              title="Team members"
              unit="members"
              tooltip="Number of members in your team"
              usage={usage?.users}
              usageLimit={limit?.users}
              numberOnly
            />
          </div>
        </div>
        <div className="b flex flex-col items-center justify-between space-y-3  border-t border-border px-10 py-4 text-center md:flex-row md:space-y-0 md:text-left">
          {plan ? (
            <p className="text-sm text-secondary-foreground/65">
              {plan === "pro"
                ? "You're on the Pro plan."
                : plan === "business"
                  ? "Need more workspaces or pages? Contact us for an Enterprise quote."
                  : `For higher limits, upgrade to the ${nextPlan.name} plan.`}
            </p>
          ) : (
            <div className="h-3 w-28 animate-pulse rounded-full bg-secondary-foreground/20" />
          )}
          <TeamPermissionView permission="UPGRADE_TEAM_PLAN">
            <div>
              {plan ? (
                plan === "enterprise" || plan === "business" ? (
                  <a
                    href="https://orgnise.in/enterprise"
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-md border border-violet-600 bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white hover:text-violet-600 focus:outline-none"
                  >
                    Contact Sales
                  </a>
                ) : (
                  <Button2
                    text={`Upgrade to ${nextPlan.name}`}
                    onClick={() =>
                      queryParams({
                        set: {
                          upgrade: nextPlan.name.toLowerCase(),
                        },
                      })
                    }
                    variant="default"
                  />
                )
              ) : (
                <div className="h-10 w-24 animate-pulse rounded-md bg-accent/20" />
              )}
            </div>
          </TeamPermissionView>
        </div>
        <UpgradePlanModal />
      </div>
    </>
  );
}

function UsageCategory({
  title,
  unit,
  tooltip,
  usage,
  usageLimit,
  numberOnly,
}: {
  title: string;
  unit: string;
  tooltip: string;
  usage?: number;
  usageLimit?: number;
  numberOnly?: boolean;
}) {
  return (
    <div className="p-10">
      <div className="flex items-center space-x-2">
        <h3 className="font-medium">{title}</h3>
        <InfoTooltip content={tooltip} />
      </div>
      {numberOnly ? (
        <div className="mt-4 flex items-center">
          {usage || usage === 0 ? (
            <p className="text-2xl font-semibold text-secondary-foreground">
              {usage}
            </p>
          ) : (
            <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
          )}
          <Divider className="h-8 w-8 text-gray-500" />
          <p className="text-2xl font-semibold text-gray-400">{usageLimit}</p>
        </div>
      ) : (
        <div className="mt-2 flex flex-col space-y-2">
          {usage !== undefined && usageLimit ? (
            <p className="text-sm text-gray-600">
              <NumberTooltip value={usage} unit={unit}>
                <span>{usage} </span>
              </NumberTooltip>
              / {usageLimit} {unit} ({((usage / usageLimit) * 100).toFixed(1)}%)
            </p>
          ) : (
            <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200" />
          )}
          <ProgressBar value={usage} max={usageLimit} />
        </div>
      )}
    </div>
  );
}
