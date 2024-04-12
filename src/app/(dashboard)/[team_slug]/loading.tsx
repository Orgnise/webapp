import { WorkspacePlaceholder } from "./page-client";

export default function TeamPageLoading() {
  return (
    <div>
      <div className="flex h-36 animate-pulse items-center border-b border-border bg-background">
        <div className="mx-auto w-full max-w-screen-xl px-2.5">
          <div className="flex items-center justify-between">
            <h1 className="prose-xl rounded bg-secondary text-transparent">
              My Workspaces
            </h1>
          </div>
        </div>
      </div>
      <WorkspacePlaceholder />
    </div>
  );
}
