import React from "react";
import cx from "classnames";
import { SvgIconProps } from "./svg-icon";

export default function VerticalEllipse({ className }: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cx("", className)}
      viewBox="0 0 24 24"
      stroke-width="1.5"
      height={"100%"}
      width={"100%"}
      stroke="currentColor"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
      <circle cx="12" cy="5" r="1" />
    </svg>
  );
}
