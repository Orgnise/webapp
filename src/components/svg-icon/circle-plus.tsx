import React from "react";
import cx from "classnames";
import { type } from "@testing-library/user-event/dist/type";
import { SvgIconProps } from "./svg-icon";

export default function CirclePlus({ className = "", size }: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cx("", className)}
      height={size ? size * 4 : "100%"}
      width={size ? size * 4 : "100%"}
      stroke="currentColor"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="12" y1="9" x2="12" y2="15" />
    </svg>
  );
}
