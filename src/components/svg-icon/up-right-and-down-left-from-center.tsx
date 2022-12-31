import React from "react";
import cx from "classnames";
import { SvgIconProps } from "./svg-icon";

export default function UpRightAndDownLeft({
  className,
  size,
}: SvgIconProps<void>) {
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
      <path d="M10 7h5v5" />
      <path d="M5 11v5h5" />
    </svg>
  );
}
