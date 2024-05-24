import { CustomTooltipContent, ToolTipWrapper } from "@/components/ui/";
import { getNextPlan } from "@/lib/constants";
import { Fold } from "@/lib/utils";

interface Props {
  exceedingLimit: boolean;
  upgradeMessage: string;
  plan: any;
  children: React.ReactNode;
  team_slug: string;
  placeholder: React.ReactNode;
}
export function UsageLimitView({
  children,
  exceedingLimit,
  upgradeMessage,
  plan,
  team_slug,
  placeholder,
}: Props) {
  return (
    <Fold
      value={!exceedingLimit}
      ifPresent={(value: unknown) => children}
      ifAbsent={() => (
        <ToolTipWrapper
          content={
            <CustomTooltipContent
              title={upgradeMessage}
              cta={`Upgrade to ${getNextPlan(plan)?.name}`}
              href={`/${team_slug}/settings/billing?upgrade=pro`}
            />
          }
        >
          {placeholder}
        </ToolTipWrapper>
      )}
    />
  );
}
