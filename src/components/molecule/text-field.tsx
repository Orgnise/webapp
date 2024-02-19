import cx from "classnames";
import React from "react";
import Label from "../atom/label";
import { Input } from "../ui/input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  label?: string;
  error?: string;
}

/**
 * Text field component
 * @param {*} prop
 * @constructor
 * @example
 * <TextField name="name" label="Name" value={name} onChange={e => setName(e.target.value)} />
 */
const TextField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, label, error, ...props }, ref) => {
    return (
      <div className={cx("flex flex-col gap-2", wrapperClassName)}>
        <Label variant="t2"> {label}</Label>
        <div className={cx("mb-5 flex flex-col gap-1")}>
          <Input
            placeholder={props.placeholder || `Enter ${label}`}
            className={cx("theme-input   ", {
              "border-red-500 ": error,
            })}
            // type={props.type}
            {...props}
          />
          <label
            className={cx("text-xs text-red-500", {
              "inline-block  scale-100": error !== "" && error !== undefined,
              "h-0": !error,
            })}
          >
            {error}
          </label>
        </div>
      </div>
    );
  },
);

TextField.displayName = "TextField";

export { TextField };
