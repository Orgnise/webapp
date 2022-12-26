import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import React, { useState, useRef } from "react";
import Validator from "../../helper/validator";
import FIcon from "../ficon";

type AccordionProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};
export const Accordion = ({ title, children }: AccordionProps) => {
  const [isOpened, setOpened] = useState<boolean>(false);
  const [height, setHeight] = useState<string>("0px");
  const contentElement = useRef<HTMLDivElement>(null);

  const HandleOpening = () => {
    if (contentElement !== null) {
      setOpened(!isOpened);
      const height = Validator.getLeaf(contentElement, "current?.scrollHeight"); //contentElement.current?.scrollHeight;
      setHeight(!isOpened ? `${height}px` : "0px");
    }
  };
  return (
    <div onClick={HandleOpening} className="">
      <div className={"flex justify-between "}>
        <h4 className="font-semibold">{title}</h4>
        {isOpened ? (
          <FIcon icon={solid("angle-left")} />
        ) : (
          <FIcon icon={solid("angle-down")} />
        )}
      </div>
      <div
        ref={contentElement}
        style={{ height: height }}
        className="bg-gray-200 overflow-hidden transition-all duration-200"
      >
        <p className="p-4">{children}</p>
      </div>
    </div>
  );
};

export default Accordion;
