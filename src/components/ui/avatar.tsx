import { cn } from "@/lib/utils";
import Image from "next/image";

export function Avatar({
  user = {},
  className,
}: {
  user?: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
  className?: string;
}) {
  if (!user) {
    return (
      <div
        className={cn(
          "h-10 w-10 animate-pulse rounded-full border border-gray-300 bg-gray-100",
          className,
        )}
      />
    );
  }

  return (
    <Image
      width={40}
      height={40}
      unoptimized
      alt={`Avatar for ${user?.name || user?.email}`}
      referrerPolicy="no-referrer"
      src={
        user?.image ||
        `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}&scale=70&size=40`
      }
      className={cn("h-10 w-10 rounded-full border border-gray-300", className)}
      draggable={false}
    />
  );
}
