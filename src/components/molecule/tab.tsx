import React from "react";
import cx from "classnames";
interface Props {
  tab: string;
  selected: Boolean;
  disabled: Boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  className: string;
}

function Tab({ tab, selected, onClick, className, disabled = false }: Props) {
  return (
    <div className={cx({ "cursor-not-allowed": disabled })}>
      <div
        key={tab}
        className={cx(
          "tab hover:border-b-2 rounded-t px-4 py-1  hover:bg-teal-50 dark:hover:bg-transparent cursor-pointer hover:border-teal-500  select-none transition duration-500 ease-in-out" +
            className,
          {
            "border-b-2 border-teal-500": selected,
          },
          {
            "pointer-events-none": disabled,
          }
        )}
        onClick={onClick}>
        {tab}
      </div>
    </div>
  );
}
export default Tab;
