import React from "react";
import cx from "classnames";
interface Props {
  tab: string;
  selected: Boolean;
  disabled?: Boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
}

function Tab({ tab, selected, onClick, className, disabled = false }: Props) {
  return (
    <div className={cx({ "cursor-not-allowed": disabled })}>
      <div
        key={tab}
        className={cx(
          "tab rounded-t px-4 py-1  hover:bg-muted dark:hover:bg-transparent cursor-pointer hover:border-primary  select-none transition duration-500 ease-in-out" +
            className,
          {
            "border-b-[3px] border-primary": selected,
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
