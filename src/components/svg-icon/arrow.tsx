import React from "react";
import cx from "classnames";
import { Config, SvgIconProps, Variant } from "./svg-icon";

export default function Arrow({
  className,
  size,
  config,
}: SvgIconProps<Config<Variant<"up" | "down" | "left" | "right">>>) {
  const variant = config?.variant;
  return (
    <>
      {variant === "up" && (
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
          strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="16" y1="9" x2="12" y2="5" />
          <line x1="8" y1="9" x2="12" y2="5" />
        </svg>
      )}
      {variant === "down" && (
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
          strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="16" y1="15" x2="12" y2="19" />
          <line x1="8" y1="15" x2="12" y2="19" />
        </svg>
      )}
      {variant === "left" && (
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
          strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="5" y1="12" x2="19" y2="12" />
          <line x1="5" y1="12" x2="11" y2="18" />
          <line x1="5" y1="12" x2="11" y2="6" />
        </svg>
      )}
      {variant === "right" && (
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
          strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="5" y1="12" x2="19" y2="12" />
          <line x1="15" y1="16" x2="19" y2="12" />
          <line x1="15" y1="8" x2="19" y2="12" />
        </svg>
      )}
    </>
  );
}
