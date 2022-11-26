import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import React from "react";
import { Link } from "react-router-dom";
import FIcon from "./ficon";

interface Props {
  items: Array<{ label: string; link: string }>;
  className?: string;
}

/**
 * Breadcrumb component
 * @param {Array<Object>} items - Array of breadcrumb items. Each item should have label and link. Example: ```[{label: 'Home', link: '/'}]```
 * @returns {React.Component} - Breadcrumb component
 */
const Breadcrumb: React.FC<Props> = ({ items, className }) => {
  return (
    <div className="Breadcrumb">
      <div className={className}>
        <ul className="flex items-center font-medium space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center font-medium space-x-2">
              <Link
                to={item.link}
                className="hover:underline theme-text-primary"
              >
                {item.label}
              </Link>
              {index === items.length - 1 ? (
                <></>
              ) : (
                <FIcon icon={solid("angle-right")} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb;
