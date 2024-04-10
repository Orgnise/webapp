export default function TeamBillingSettingsLoading() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-card">
      <div className="flex flex-col items-center justify-between space-y-3 p-5 sm:flex-row sm:space-y-0 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium">Plan & Usage</h2>
          <p className="rounded  bg-secondary text-sm text-transparent ">
            You are currently on the free plan. Current billing cycle: Apr 10 -
            May 9.
          </p>
        </div>
      </div>
    </div>
  );
}
