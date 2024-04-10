import { P } from "@/components/atom/typography";
import { Shapes } from "lucide-react";

export default function EmptyWorkspaceView() {
  return (
    <div className="w-full">
      <div className="EmptyWorkspaceView mx-auto my-2 flex-1">
        <div className="flex h-full w-full flex-col place-content-center items-center py-20 text-center">
          <Shapes
            className="text-accent dark:text-accent-foreground"
            size={60}
          />
          <P className="mt-6">No workspace available</P>
          <div className="mx-auto max-w-xl py-8 text-center">
            <span className="text-sm">
              Workspaces are where you
              <strong className="mx-1 ">organize your work</strong>
              You can create workspaces for different teams, clients, or even
              for yourself. For example, an
              <strong className="mx-1 ">engineering</strong>
              workspace could contains all engineering-related tasks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
