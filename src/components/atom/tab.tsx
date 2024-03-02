import cx from "classnames";
import { motion } from "framer-motion";
import React from "react";
interface Props {
  tab: string;
  selected: Boolean;
  disabled?: Boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
}

function Tab({ tab, selected, onClick, className, disabled = false }: Props) {
  console.log("tab", { tab, selected });
  return (
    <div
      className={cx("flex flex-col gap-0.5", {
        "cursor-not-allowed": disabled,
      })}
    >
      <div
        key={tab}
        className={cx(
          "prose-base relative flex cursor-pointer select-none  rounded px-2 font-normal transition duration-500  ease-in-out  hover:bg-muted dark:hover:bg-transparent" +
            className,
          {
            "pointer-events-none": disabled,
          },
        )}
        onClick={onClick}
      >
        <span className="">{tab}</span>
      </div>
      {selected ? (
        <motion.div
          layoutId="indicator"
          transition={{
            duration: 0.25,
          }}
          className="w-full px-1.5"
        >
          <div className="h-0.5 bg-secondary-foreground" />
        </motion.div>
      ) : (
        <div className="h-0.5 " />
      )}
    </div>
  );
}
export default Tab;
