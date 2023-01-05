import React from "react";
import cx from "classnames";

function Pattern({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cx(
        "absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 fill-white/1 stroke-white/2.5"
      )}>
      <defs>
        <pattern
          id=":R56hd6:"
          width="72"
          height="56"
          patternUnits="userSpaceOnUse"
          x="50%"
          y="16">
          <path d="M.5 56V.5H72" fill="none"></path>
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth="0"
        fill="url(#:R56hd6:)"></rect>
      <svg x="50%" y="16" className="overflow-visible">
        <rect strokeWidth="0" width="73" height="57" x="0" y="56"></rect>
        <rect strokeWidth="0" width="73" height="57" x="72" y="168"></rect>
      </svg>
    </svg>
  );
}
