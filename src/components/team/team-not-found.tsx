import { FileX2 } from "lucide-react";
import Link from "next/link";

interface NotFoundViewProps {
  item: string;
}

export default function NotFoundView({ item }: NotFoundViewProps) {
  return (
    <div className="my-10 flex flex-col rounded-md bg-card">
      <div className=" flex flex-col items-center justify-center rounded-md border border-border/80 bg-background py-12">
        <div className="rounded-full bg-accent p-3">
          <FileX2 className="h-6 w-6 text-gray-600" />
        </div>
        <h1 className="my-3 text-xl font-semibold text-secondary-foreground/85">
          {item} Not Found
        </h1>
        <p className="z-10 max-w-sm text-center text-sm text-gray-600">
          Bummer! The {item} you are looking for does not exist. You either
          typed in the wrong URL or don&apos;t have access to this {item}.
        </p>
        <Link
          href="./"
          className="z-10 mt-10 rounded-md border border-secondary-foreground bg-secondary-foreground  px-10 py-2 text-sm font-medium text-secondary  transition-all duration-75 hover:bg-transparent hover:text-secondary-foreground"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
