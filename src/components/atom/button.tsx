import React from "react";
import cx from "classnames";

interface Props {
  type:
    | "primary"
    | "secondary"
    | "primary-rounded"
    | "secondary-rounded"
    | "outline"
    | "link";
  size: "small" | "base" | "large";
  label: string;
  leadingIcon?: string;
  trailingIcon?: string;
  notificationBadge?: number;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const Button = (props: Props) => {
  const {
    type = "primary",
    size = "base",
    label,
    disabled,
    className,
    leadingIcon,
    trailingIcon,
    notificationBadge,
    onClick,
  } = props;

  const TextColor = {
    primary: "text-white",
    secondary: "text-emerald-500 hover:text-emerald-600 focus:text-emerald-700",
    "primary-rounded": "text-white",
    "secondary-rounded":
      "text-emerald-500 hover:text-emerald-600 focus:text-emerald-700 disabled:text-emerald-300",
    outline:
      "text-emerald-500 hover:text-emerald-600 focus:text-emerald-700 disabled:text-emerald-300",
    link: " focus:text-emerald-700 hover:text-emerald-600  text-emerald-500 focus:text-emerald-700 disabled:text-emerald-300",
  };

  function getBackgroundColor() {
    switch (type) {
      case "primary-rounded":
      case "primary":
        return "bg-emerald-500 hover:bg-emerald-700";
      case "secondary-rounded":
      case "secondary":
        return "bg-emerald-50 hover:bg-emerald-100 focus:bg-emerald-200 focus:text-emerald-700";

      case "outline":
        return " border border-emerald-500 hover:bg-emerald-50";
      case "link":
        return " hover:bg-emerald-50 ";
      default:
        return "bg-emerald-500 hover:bg-emerald-700";
    }
  }

  function getDisabledStateColor() {
    switch (type) {
      case "primary-rounded":
      case "primary":
        return "disabled:bg-emerald-300";
      case "secondary":
      case "secondary-rounded":
        return " disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none";
      case "outline":
        return "disabled:border-emerald-300 disabled:text-emerald-300";
      case "link":
        return "disabled:text-emerald-300";
      default:
        return "";
    }
  }
  return (
    <button
      className={cx(
        `inline-flex items-center justify-center gap-2 justify-self-center tracking-wide font-bold py-2 px-4 rounded transition duration-300` +
          " focus-visible:outline-none disabled:cursor-not-allowed " +
          " whitespace-nowrap rounded px-6 text-sm font-medium ",
        "cursor-pointer",
        TextColor[type],
        getBackgroundColor(),
        getDisabledStateColor(),
        {
          "": type === "secondary",
          "border-emerald-500  hover:border-emerald-600  focus:border-emerald-700  disabled:border-emerald-300":
            type === "outline",
        },
        {
          "text-xs": size === "small",
          "text-lg": size === "large",
          "text-base": size === "base",
        },
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {leadingIcon && leadingIcon}
      <p>{label}</p>
      {trailingIcon && trailingIcon}
      {notificationBadge && (
        <p className="relative inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium leading-4 bg-red-100 text-red-800">
          {notificationBadge}
        </p>
      )}
    </button>
  );
};

export default Button;
