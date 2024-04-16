import { CreateTeam } from "@/components/team/create/create-team";

/**
 * Terms and conditions page
 */
export default function TermsAndConditionPage() {
  return (
    <div className="h-full py-24">
      <div className="flex flex-col place-content-center items-center space-y-3 text-sm">
        <CreateTeam />
      </div>
    </div>
  );
}
