import cx from "classnames";
import { CircleHelpIcon } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { ToolTipWrapper } from "../ui/tooltip";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  label?: string;
  error?: string;
  hint?: React.ReactNode;
}

/**
 * Text field component
 * @param {*} prop
 * @constructor
 * @example
 * <TextField name="name" label="Name" value={name} onChange={e => setName(e.target.value)} />
 */
const TextField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, hint, label, error, ...props }, ref) => {
    return (
      <div className={cx("flex flex-col gap-2", wrapperClassName)}>
        <label
          htmlFor={label}
          className="flex items-center gap-1 text-base font-medium"
        >
          {label}
          {hint && (
            <ToolTipWrapper content={hint}>
              <CircleHelpIcon
                className="ml-1 cursor-pointer text-muted-foreground/80"
                size={16}
              />
            </ToolTipWrapper>
          )}
        </label>
        <div className={cx("mb-5 flex flex-col gap-1")}>
          <Input
            ref={ref}
            id={label}
            placeholder={props.placeholder || `Enter ${label}`}
            className={cx("theme-input   ", {
              "border-destructive ": error,
            })}
            // type={props.type}
            {...props}
          />
          <label
            className={cx("text-xs text-destructive", {
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
