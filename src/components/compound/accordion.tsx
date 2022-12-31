import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import cx from "classnames";
import React, { useState, useRef } from "react";
import Validator from "../../helper/validator";

type AccordionProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onStateChange?: (isOpen: boolean) => void;
};
export const Accordion = ({
  title,
  children,
  isOpen = false,
  onStateChange = (_) => {},
}: AccordionProps) => {
  const [isOpened, setOpened] = useState<boolean>(false);
  const [height, setHeight] = useState<string>("0px");
  const contentElement = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && !isOpened) {
      HandleOpening();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (contentElement !== null && isOpened) {
      setHeight(
        children ? `${contentElement.current!.scrollHeight - 30}px` : "0px"
      );
    }
  }, [children]);

  const HandleOpening = () => {
    if (contentElement !== null) {
      setOpened(!isOpened);
      const height = Validator.getLeaf(contentElement, "current?.scrollHeight"); //contentElement.current?.scrollHeight;
      setHeight(
        !isOpened ? `${contentElement.current!.scrollHeight}px` : "0px"
      );
      onStateChange(!isOpened);
    }
  };
  return (
    <div onClick={HandleOpening} className="flex flex-col w-full">
      <div className="flex items-center">
        <div className="flex-1">{title}</div>
      </div>
      <div
        ref={contentElement}
        style={{ height: height }}
        className={cx("transition-all duration-200 ease-in-expo", {
          "overflow-hidden": !isOpened,
        })}
      >
        {children && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
