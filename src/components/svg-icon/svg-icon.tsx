import React from "react";
import cx from "classnames";
import * as SVGs from "./index";
import { type } from "@testing-library/user-event/dist/type";
import { config } from "@fortawesome/fontawesome-svg-core";

type Icons =
  | "CirclePlus"
  | "VerticalEllipse"
  | "UpRightAndDownLeft"
  | "DownLeftAndUpRight"
  | "AngleLeft"
  | "AngleRight"
  | "Plus"
  | "Copy"
  | "chevronDown"
  | "chevronUp"
  | "chevronLeft"
  | "chevronRight"
  | "Arrow";

export type SvgIconSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export class Config<T> {
  public variant: Variant<T>;
  constructor(public value: T) {
    this.variant = value as Variant<T>;
  }
}
export type Variant<T> = T;

export type SvgIconProps<Config> = {
  className?: string;
  size?: SvgIconSize;
  config?: Config;
};

type SvgIconButtonProps = {
  icon: Icons;
  className?: string;
  onClick?: (e: any) => void;
  size?: SvgIconSize;
  variant?: any;
};

const SvgIcon = ({
  icon,
  className,
  size,
  variant,
  onClick,
}: SvgIconButtonProps) => {
  return (
    <span onClick={onClick} style={{ display: "inline-block" }}>
      {getSVGIcon(icon, size, className, variant)}
    </span>
  );
};

export default SvgIcon;

function getSVGIcon(
  icon: Icons,
  size?: SvgIconSize,
  className: string = "",
  variant?: any
) {
  switch (icon) {
    case "CirclePlus":
      return <SVGs.CirclePlus size={size} className={className} />;
    case "VerticalEllipse":
      return <SVGs.VerticalEllipse size={size} className={className} />;
    case "UpRightAndDownLeft":
      return <SVGs.UpRightAndDownLeft size={size} className={className} />;
    case "DownLeftAndUpRight":
      return <SVGs.DownLeftAndUpRight size={size} className={className} />;
    case "AngleLeft":
      return <SVGs.AngleLeft size={size} className={className} />;
    case "AngleRight":
      return <SVGs.AngleRight size={size} className={className} />;
    case "Plus":
      return <SVGs.Plus size={size} className={className} />;
    case "Copy":
      return <SVGs.Copy size={size} className={className} />;
    case "chevronDown":
      return <SVGs.ChevronDown size={size} className={className} />;
    case "chevronUp":
      return <SVGs.ChevronUp size={size} className={className} />;
    case "chevronLeft":
      return <SVGs.ChevronLeft size={size} className={className} />;
    case "chevronRight":
      return <SVGs.ChevronRight size={size} className={className} />;
    case "Arrow":
      return (
        <SVGs.Arrow
          size={size}
          className={className}
          config={
            new Config<Variant<"up" | "down" | "left" | "right">>(variant)
          }
        />
      );

    default:
      return <></>;
  }
}
