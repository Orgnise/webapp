import React from "react";
import cx from "classnames";
import { SvgIconProps } from "./svg-icon";

export default function DownLeftAndUpRight({ className, size }: SvgIconProps) {
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
    >
      <path d="M13 4v5h5" />
      <path d="M4 13h5v5" />
    </svg>
  );
}
