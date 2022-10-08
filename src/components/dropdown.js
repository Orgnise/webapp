import React from "react";
import cx from "classnames";
const SAMPLE_VALUE_FORMAT = {
  label: "Options",
  disabled: false,
  value: "option1",
};
/**
 * @description Drop down component
 * @param {Array<Object>} options - List of options. Each option should be an object with label. for ex: {label: "Option 1" }
 * @param {string} value - The default value of the drop down. Should be a object with label. for ex: {value: "option1"}
 * @param {Function} onChange - Callback function to handle change event
 * @param {boolean} disabled - Boolean to determine if the drop down is disabled
 * @param {string} className - The class name of the drop down
 */
function DropDown({
  options = [],
  value = SAMPLE_VALUE_FORMAT,
  className = "",
  disabled = false,
  onChange = () => {},
}) {
  return (
    <div
      className={`relative inline-block text-left customDropdown z-10 ${className}`}
    >
      <button
        className={cx(
          "inline-flex items-center space-x-1 justify-between w-full px-4 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out border theme-border-default rounded-md ",
          {
            "cursor-not-allowed theme-bg-disable theme-text-subtitle-1": disabled,
            "theme-bg-surface hover:theme-text-heading-2 focus:outline-none focus:theme-border-primary focus:shadow-outline-blue theme-text-heading-1": !disabled,
          }
        )}
        type="button"
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded="true"
      >
        <span className="text-left">{value.label}</span>
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>

      <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95 ">
        <div
          className="absolute right-0  mt-2 origin-top-right theme-bg-surface border theme-border-default divide-y theme-border-default rounded-md shadow-lg outline-none z-50"
          role="menu"
        >
          {options.map((option, index) => {
            return (
              <div
                key={index}
                className={cx("flex theme-border-default", {
                  "cursor-not-allowed": option.disabled,
                })}
                role={"menuitem"}
              >
                <button
                  //   key={index}
                  disabled={option.disabled}
                  onClick={(e) => {
                    onChange(option);
                    e.currentTarget.blur();
                  }}
                  className={cx(
                    "flex-grow flex items-center px-4 py-2  text-left",
                    {
                      "cursor-not-allowed theme-bg-disabled theme-text-subtitle-2":
                        option.disabled,
                      "hover:bg-theme-primary-lightest hover:theme-bg-default cursor-pointer": !option.disabled,
                    }
                  )}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default DropDown;
