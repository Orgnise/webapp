import React from "react";
import cx from "classnames";
import Label from "../atom/label";
import { Input, InputProps } from "../ui/input";

interface Props {
  name?: string;
  label?: string;
  value?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  autoComplete?: string;
  wrapperClassName?: string;
  minLength?: number;
  maxLength?: number;
  props?: InputProps;
}

/**
 * Text field component
 * @param {*} prop
 * @constructor
 * @example
 * <TextField name="name" label="Name" value={name} onChange={e => setName(e.target.value)} />
 */
export function TextField({
  label,
  type = "text",
  name,
  required,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  wrapperClassName,
  props,
}: Props) {
  return (
    <div className={cx("flex flex-col gap-2", wrapperClassName)}>
      <Label variant="t2"> {label}</Label>
      <div className={cx("flex flex-col mb-5 gap-1")}>
        <Input
          type={type}
          name={name}
          placeholder={placeholder || `Enter ${label}`}
          className={cx("theme-input   ", {
            "border-red-500 ": error,
          })}
          required={required}
          onChange={onChange}
          value={value}
          autoComplete={autoComplete}
          {...props}
        />
        <label
          className={cx("text-red-500 text-xs", {
            "inline-block  scale-100": error !== "" && error !== undefined,
            "h-0": !error,
          })}>
          {error}
        </label>
      </div>
    </div>
  );
}
