import { CreateTeam } from "@/components/team/create/create-team";

/**
 * Terms and conditions page
 */
export default function TermsAndConditionPage() {
  return (
    <div className="py-24 bg-card">
      <div className="flex flex-col space-y-3 items-center place-content-center text-sm">
        <CreateTeam />
      </div>
    </div>
  );
}
