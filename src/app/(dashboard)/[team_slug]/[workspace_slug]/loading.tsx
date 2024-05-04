export default function Loading() {
  return (
    <main className=" h-full w-full animate-pulse items-center justify-center">
      <div className="WorkspacePage h-full w-full flex-grow bg-background">
        <div className="mx-auto flex h-full max-w-xl flex-1 flex-col place-content-center items-center gap-10 pt-56 text-center">
          <div className="h-16 w-16 rounded bg-accent" />
          <span className="bg-muted font-normal text-transparent">
            <strong className="bg-secondary-foreground/30">Collections</strong>{" "}
            are a way to organize and group pages together. They provide a
            convenient way to{" "}
            <strong className="bg-secondary-foreground/30">categorize</strong>{" "}
            and manage related items within your workspace. By creating
            collections, you can easily organize your work / docs and improve
            productivity.
          </span>
          <div className="mt-2 h-10 w-2/6 rounded  bg-secondary-foreground/30" />
        </div>
      </div>
    </main>
  );
}
