import React from "react";
import cx from "classnames";
import { Config, SvgIconProps, Variant } from "./svg-icon";

export default function LightDark({
  className,
  size,
  config,
}: SvgIconProps<Config<Variant<"light" | "dark">>>) {
  const variant = config?.variant;
  return (
    <>
      {variant === "light" && (
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
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
          <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
          <line x1="9.7" y1="17" x2="14.3" y2="17" />
        </svg>
      )}
      {variant === "dark" && (
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
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
          <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
          <path d="M19 11h2m-1 -1v2" />
        </svg>
      )}
    </>
  );
}
