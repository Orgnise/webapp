
export default function Loading() {
  return (
    <main className=" w-full items-center justify-center animate-pulse">
      <div className="CollectionContentPage h-full w-full pt-12" id="CollectionContentPage">
        <div className="flex flex-col">
         
          <div className="flex flex-col gap-2 p-8">
            <div className="h-8 w-1/5  bg-secondary-foreground/20 rounded" />
            <div className="h-px bg-secondary" />
          </div>

          <div className="flex flex-col gap-4 p-8">
            <div className="h-5 w-1/5 mb-6 bg-secondary-foreground/10" />
            <div className="h-10 w-5/12 mb-10 bg-secondary-foreground/10" />
            <div className="h-3 w-3/12 mb-4 bg-muted" />

            <div className="flex flex-col gap-1 mb-6">
              <div className="h-3 w-11/12 bg-muted" />
              <div className="h-3 w-12/12 bg-muted" />
              <div className="h-4"/>
              <div className="h-3 w-12/12 bg-muted" />
              <div className="h-3 w-12/12 bg-muted" />
              <div className="h-3 w-8/12 bg-muted" />
            </div>

            <div className="h-6 w-5/12 mb-10 bg-secondary-foreground/10" />
            <div className="h-5 w-3/12 mb-4 bg-secondary-foreground/10" />

            <div className="flex flex-col gap-1 mb-6">
              <div className="h-3 w-11/12 bg-muted" />
              <div className="h-3 w-12/12 bg-muted" />
              <div className="h-3 w-8/12 bg-muted" />
              <div className="h-4"/>
              <div className="h-3 w-12/12 bg-muted" />
              <div className="h-3 w-12/12 bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
