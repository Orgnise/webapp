import React from "react";
import cx from "classnames";
import { SvgIconProps } from "./svg-icon";

export default function AngleLeft({ className, size }: SvgIconProps<void>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cx("", className)}
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      height={size ? size * 4 : "100%"}
      width={size ? size * 4 : "100%"}
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="11 7 6 12 11 17" />
      <polyline points="17 7 12 12 17 17" />
    </svg>
  );
}
