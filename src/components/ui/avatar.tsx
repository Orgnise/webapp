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
          "h-10 w-10 animate-pulse rounded-full border border-border bg-gray-100",
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
        `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name ?? user?.email}&scale=70&size=40`
      }
      className={cn("h-10 w-10 rounded-full border border-border", className)}
      draggable={false}
    />
  );
}

export function TokenAvatar({ id }: { id: string }) {
  return (
    <Image
      src={`https://api.dicebear.com/8.x/shapes/svg?seed=${id}&scale=70&size=40`}
      alt="avatar"
      className="h-10 w-10 rounded-full"
      draggable={false}
      width={40}
      height={40}
      unoptimized
    />
  );
}
