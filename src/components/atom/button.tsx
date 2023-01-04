import React from "react";
import cx from "classnames";
import SvgIcon from "../svg-icon/svg-icon";

const Variant = Object.freeze({
  primary: "primary",
  secondary: "secondary",
  "primary-rounded": "primary-rounded",
  "secondary-rounded": "secondary-rounded",
  outline: "outline",
  link: "link",
});
interface Props {
  type?:
    | "primary"
    | "secondary"
    | "primary-rounded"
    | "secondary-rounded"
    | "outline"
    | "link";
  size?: "small" | "base" | "large";
  label: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
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

  function getDisabledStateColor() {
    switch (type) {
      case "primary-rounded":
      case "primary":
        return "disabled:bg-gray-300 disabled:text-gray-400";
      case "secondary":
      case "secondary-rounded":
        return " disabled:border-primary-300 disabled:bg-primary-100 disabled:text-primary-400 disabled:shadow-none";
      case "outline":
        return "disabled:border-primary-300 disabled:text-primary-300";
      case "link":
        return "disabled:text-primary-300";
      default:
        return "";
    }
  }
  return (
    <button
      className={cx(
        `inline-flex items-center justify-center gap-2 justify-self-center rounded transition duration-300` +
          "focus-visible:outline-none disabled:cursor-not-allowed " +
          "whitespace-nowrap rounded text-sm font-medium z-0",
        "cursor-pointer",

        {
          "theme-text-on-primary theme-bg-primary dark:hover:bg-primary-200 hover:bg-primary-900":
            type == "primary-rounded" || type == "primary",
          "rounded-full":
            type == "primary-rounded" || type == "secondary-rounded",

          "bg-primary-50 hover:bg-primary-100 focus:bg-primary-200":
            type === "secondary-rounded" || type === "secondary",

          // TEXT COLOR
          "theme-text-on-primary hover:text-on-primary-600 focus:text-on-primary-700":
            type === "primary",
          "theme-text-primary hover:text-primary-600 focus:text-primary-700":
            type === "secondary-rounded" || type === "secondary",

          "theme-text-primary hover:text-primary-600 focus:text-primary-700 disabled:text-primary-300":
            type === "secondary-rounded" || type === "outline",

          "border border-primary-500 hover:bg-primary-50 dark:hover:bg-transparent":
            type === "outline",

          "hover:bg-primary-50 dark:hover:bg-transparent ": type === "link",

          "theme-bg-primary hover:bg-primary-900": !type,

          "hover:text-primary-600  theme-text-primary focus:text-primary-700 disabled:text-primary-300":
            type === "link",
        },

        getDisabledStateColor(),
        {
          "": type === "secondary",
          "outline outline-1 border-primary-500 hover:border-primary-600  focus:border-primary-700  disabled:border-primary-300":
            type === "outline",
        },
        {
          "text-xs px-2 py-1": size === "small",
          "text-lg  py-2 px-4": size === "large",
          "text-base  py-1 px-2": size === "base",
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
        <p className="relative inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium leading-4 bg-red-100 theme-text-primary">
          {notificationBadge}
        </p>
      )}
    </button>
  );
};

export default Button;

// Component to display all possible variants of the button
export function AllButtonsComponent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Primary</h1>
        <div className="grid grid-cols-3 items-center self-start gap-4">
          <Button type="primary" label="Primary" size="large" />
          <Button type="primary" label="Primary" />
          <Button type="primary" label="Small" size="small" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Secondary</h1>
        <div className="grid grid-cols-3 items-center self-start gap-4">
          <Button type="secondary" label="Secondary" size="large" />
          <Button type="secondary" label="Secondary" />
          <Button type="secondary" label="Secondary" size="small" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Primary Rounded</h1>
        <div className="grid grid-cols-3 items-center self-start gap-4">
          <Button type="primary-rounded" label="Primary Rounded" size="large" />
          <Button type="primary-rounded" label="Primary Rounded" />
          <Button type="primary-rounded" label="Primary Rounded" size="small" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Secondary Rounded</h1>
        <div className="grid grid-cols-3 items-center self-start gap-4">
          <Button
            type="secondary-rounded"
            label="Secondary Rounded"
            size="large"
          />
          <Button type="secondary-rounded" label="Secondary Rounded" />
          <Button
            type="secondary-rounded"
            label="Secondary Rounded"
            size="small"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Outline</h1>
        <div className="grid grid-cols-3 items-center self-start gap-4">
          <Button type="outline" label="Outline" size="large" />
          <Button type="outline" label="Outline" />
          <Button type="outline" label="Outline" size="small" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">Link</h1>
        <div className="grid grid-cols-3 items-center self-start gap-4">
          <Button type="link" label="Link" size="large" />
          <Button type="link" label="Link" />
          <Button type="link" label="Link" size="small" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Disabled</h1>
        <div className="grid grid-cols-3 items-center self-start gap-4">
          <Button disabled={true} label="Disabled" size="large" />
          <Button disabled={true} label="Disabled" />
          <Button disabled={true} label="Disabled" size="small" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">With Icons</h1>
        <div className="grid grid-cols-3 items-center self-start gap-4">
          <Button
            type="primary"
            label="Primary"
            leadingIcon={<SvgIcon icon="CirclePlus" size={5} />}
          />
          <Button
            type="primary"
            label="Primary"
            leadingIcon={<SvgIcon icon="CirclePlus" size={5} />}
            trailingIcon={<SvgIcon icon="CirclePlus" size={5} />}
          />
          <Button
            type="primary"
            label="Primary"
            trailingIcon={<SvgIcon icon="CirclePlus" size={5} />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">With Notification Badge</h1>
        <div className="grid grid-cols-3 items-center self-start gap-4">
          <Button
            type="primary"
            label="Primary"
            notificationBadge={1}
            size="large"
          />
          <Button
            type="primary"
            label="Primary"
            notificationBadge={10}
            size="base"
          />
          <Button
            type="primary"
            label="Primary"
            notificationBadge={100}
            size="small"
          />
        </div>
      </div>
    </div>
  );
}
