import React from "react";
import cx from "classnames";
import { SvgIconProps } from "./svg-icon";

export default function ChevronLeft({ className, size }: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cx("", className)}
      viewBox="0 0 24 24"
      stroke-width="1.7"
      height={size ? size * 4 : "100%"}
      width={size ? size * 4 : "100%"}
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={{ display: "inline-block" }}
    >
      <polyline points="15 6 9 12 15 18" />
    </svg>
  );
}
