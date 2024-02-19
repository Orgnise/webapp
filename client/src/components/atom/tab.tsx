import cx from "classnames";
import React from "react";
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
          "tab cursor-pointer select-none rounded-t  px-4 py-1 transition duration-500  ease-in-out hover:border-primary hover:bg-muted dark:hover:bg-transparent" +
            className,
          {
            "border-b-[3px] border-primary": selected,
          },
          {
            "pointer-events-none": disabled,
          },
        )}
        onClick={onClick}
      >
        {tab}
      </div>
    </div>
  );
}
export default Tab;
