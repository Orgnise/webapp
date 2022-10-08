import React from "react";
import cx from "classnames";
/**
 * custom Drop down component
 * @param {*} button - button component
 * @param {Function} children - children component to be displayed in drop down
 * @param {string} className - The class name of the drop down
 * @param {boolean} disabled - Boolean to determine if the drop down is disabled
 */
export default function CustomDropDown({
  button = <h3>Drop Down</h3>,
  className = "",
  children = <></>,
  disabled = false,
}) {
  return (
    <div className={`relative text-left customDropdown z-10 ${className}`}>
      <button
        className={cx(
          "inline-flex items-center space-x-1 justify-between w-full text-sm font-medium leading-5 transition duration-150 ease-in-out  rounded-md m-0",
          {
            "cursor-not-allowed bg-gray-400 text-gray-700": disabled,
            "theme-bg-surface hover:theme-text-heading-2 focus:outline-none focus:border-slate-400 focus:shadow-outline-blue": !disabled,
          }
        )}
        type="button"
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded="true"
      >
        {button}
      </button>

      <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
        <div
          className="absolute w-max mt-2 right-1 origin-top-right theme-bg-surface border theme-border-default divide-y theme-border-default rounded-md shadow-lg outline-none z-50"
          role="menu"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
