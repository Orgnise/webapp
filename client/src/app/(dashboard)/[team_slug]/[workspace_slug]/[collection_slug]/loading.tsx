export default function Loading() {
  return (
    <main className=" w-full animate-pulse items-center justify-center">
      <div
        className="CollectionContentPageLoading h-full w-full pt-20"
        id="CollectionContentPageLoading"
      >
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 pb-4">
            <div className="h-8 w-1/5  rounded bg-secondary-foreground/30" />
            <div className="h-px bg-secondary" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-6 w-1/4 bg-muted" />
            <div className="h-6 w-1/5 bg-muted" />
            <div className="h-6 w-1/3 bg-muted" />
            <div className="h-6 w-2/5 bg-muted" />
            <div className="h-6 w-2/6 bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
