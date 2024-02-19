export default function Loading() {
  return (
    <main className=" w-full animate-pulse items-center justify-center">
      <div className="ItemPageClient h-full w-full pt-12" id="ItemPageClient">
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 p-8">
            <div className="h-8 w-1/5  rounded bg-secondary-foreground/20" />
            <div className="h-px bg-secondary" />
          </div>

          <div className="flex flex-col gap-4 p-8">
            <div className="mb-6 h-5 w-1/5 bg-secondary-foreground/10" />
            <div className="mb-10 h-10 w-5/12 bg-secondary-foreground/10" />
            <div className="mb-4 h-3 w-3/12 bg-muted" />

            <div className="mb-6 flex flex-col gap-1">
              <div className="h-3 w-11/12 bg-muted" />
              <div className="w-12/12 h-3 bg-muted" />
              <div className="h-4" />
              <div className="w-12/12 h-3 bg-muted" />
              <div className="w-12/12 h-3 bg-muted" />
              <div className="h-3 w-8/12 bg-muted" />
            </div>

            <div className="mb-10 h-6 w-5/12 bg-secondary-foreground/10" />
            <div className="mb-4 h-5 w-3/12 bg-secondary-foreground/10" />

            <div className="mb-6 flex flex-col gap-1">
              <div className="h-3 w-11/12 bg-muted" />
              <div className="w-12/12 h-3 bg-muted" />
              <div className="h-3 w-8/12 bg-muted" />
              <div className="h-4" />
              <div className="w-12/12 h-3 bg-muted" />
              <div className="w-12/12 h-3 bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
