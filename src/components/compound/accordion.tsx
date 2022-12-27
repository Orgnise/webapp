import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import React, { useState, useRef } from "react";
import Validator from "../../helper/validator";
import FIcon from "../ficon";

type AccordionProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  onStateChange?: (isOpen: boolean) => void;
};
export const Accordion = ({
  title,
  children,
  onStateChange = (_) => {},
}: AccordionProps) => {
  const [isOpened, setOpened] = useState<boolean>(false);
  const [height, setHeight] = useState<string>("0px");
  const contentElement = useRef<HTMLDivElement>(null);

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
        className="overflow-hidden transition-all duration-200 ease-in-expo"
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
