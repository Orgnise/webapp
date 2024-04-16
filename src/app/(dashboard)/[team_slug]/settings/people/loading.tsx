export default function TeamPeopleSettingsLoading() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-card">
      <div className="flex flex-col items-center justify-between space-y-3 p-5 sm:flex-row sm:space-y-0 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium">People</h2>
          <p className="rounded  text-sm text-muted-foreground">
            Teammates that have access to this team.
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="h-9  w-[68px] rounded-lg border border-border bg-card" />
        </div>
      </div>
      <div className="flex space-x-3 border-b border-border px-3 sm:px-7">
        <div className="mb-1  h-7 w-[92px] rounded border border-border bg-card" />
        <div className="mb-1  h-7 w-[92px] rounded border border-border bg-card" />
      </div>
      <div className="grid divide-y divide-border ">
        {Array.from({ length: 5 }).map((_, i) => (
          <UserPlaceholder key={i} />
        ))}
      </div>
    </div>
  );
}

export const UserPlaceholder = () => (
  <div className="flex items-center justify-between space-x-3 px-4 py-3 sm:px-8">
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-col">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
  </div>
);
