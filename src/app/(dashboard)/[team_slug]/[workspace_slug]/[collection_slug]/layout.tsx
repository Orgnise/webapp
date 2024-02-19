import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      id="CollectionContentPageClient"
      className="h-full w-full flex-grow bg-background"
    >
      <div className="mx-auto flex h-full max-w-screen-lg flex-col px-4 lg:px-6">
        {children}
      </div>
    </div>
  );
}
