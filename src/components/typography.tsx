import React from "react";
import cx from "classnames";

type Size = "h1" | "h2" | "h3" | "body1" | "body" | "caption" | "small";

type Variant = "t1" | "t2" | "t3" | "s1" | "s2" | "cap";

type TextProps = {
  className?: string;
  size?: Size;
  variant?: Variant;
  children: any;
  primary?: boolean;
};

/**
 * Display a label
 * @param {string} className - Additional class name
 * @param {string} size - Size of the label (h1, h2, h3, body, caption, button)
 * @param {string} variant - Variant of the label (t1, t2, s1, s2, cap)
 * @param {string} children - Label text
 * @example
 * <Label size="h1" variant="t1">Label</Label>
 * <Label size="h2" variant="t2">Label</Label>
 * @returns {JSX.Element}
 */
const Label: React.FC<TextProps> = ({
  className,
  size,
  variant,
  children,
  primary,
}): React.ReactElement<TextProps> => {
  return (
    <span
      className={cx(
        "",
        className,
        {
          "text-3xl": size === "h1",
          "text-2xl": size === "h2",
          "text-lg": size === "h3",
          "text-base": size === "body1",
          "text-sm": size === "body",
          "text-xs": size === "caption",
          "text-[11px]": size === "small",
        },
        {
          "font-bold theme-text-h1": variant === "t1",
          "font-semibold theme-text-h2": variant === "t2",
          "font-sans theme-text-h3": variant === "t3",
          "theme-text-sub1": variant === "s1",
          "theme-text-sub2": variant === "s2",
          "font-light": variant === "cap",
        },
        {
          "theme-text-primary": primary,
        }
      )}
    >
      {children}
    </span>
  );
};

/**
 * Component to display all possible labels created using the Label component generated from iteration
 * @example
 * <Typography />
 * @returns {JSX.Element}
 */
export const Typography: React.FC<void> = () => {
  const sizes: Size[] = ["h1", "h2", "h3", "body", "caption", "small"];
  const variants: Variant[] = ["t1", "t2", "t3", "s1", "s2", "cap"];

  return (
    <div>
      {/* <div className="grid grid-cols-6  items-center">
        {sizes.map((size, index) => {
          return variants.map((variant) => {
            return (
              <Label
                key={index}
                size={size}
                variant={variant}
                className="uppercase"
              >{`${size} ${variant}`}</Label>
            );
          });
        })}
      </div> */}
      <div className="grid grid-cols-6 items-center">
        {variants.map((variant) => {
          return sizes.map((size, index) => {
            return (
              <Label
                key={index}
                size={size}
                variant={variant}
                className="uppercase"
              >{`${size} ${variant}`}</Label>
            );
          });
        })}
      </div>
    </div>
  );
};

export default Label;
