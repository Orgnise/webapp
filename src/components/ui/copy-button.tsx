"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon, LucideIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CopyButton({
  value,
  className,
  icon,
}: {
  value: string;
  className?: string;
  icon?: LucideIcon;
}) {
  const [copied, setCopied] = useState(false);
  const Comp = icon || CopyIcon;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setCopied(true);
        navigator.clipboard.writeText(value).then(() => {
          toast.success("Copied to clipboard!");
        });
        setTimeout(() => setCopied(false), 3000);
      }}
      className={cn(
        "group rounded-full bg-accent p-1.5 transition-all duration-75 hover:scale-105 hover:bg-blue-100 active:scale-95",
        className,
      )}
    >
      <span className="sr-only">Copy</span>
      {copied ? (
        <CheckIcon
          className="text-secondary-foreground transition-all group-hover:text-blue-800"
          size={18}
        />
      ) : (
        <Comp
          className="text-secondary-foreground transition-all group-hover:text-blue-800"
          size={18}
        />
      )}
    </button>
  );
}
