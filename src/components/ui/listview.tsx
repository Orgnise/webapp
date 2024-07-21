import cx from "classnames";
import React from "react";

interface ListViewProps {
  items: Array<any> | undefined | null;
  renderItem: (item: any, index: number) => React.ReactNode;
  placeholder?: React.ReactNode;
  noItemsElement?: React.ReactNode | React.ReactNode[];
  footerElement?: React.ReactNode;
  className?: string;
  loading?: boolean;
  sortBy?: (a: any, b: any) => number;
  ref?: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
}

/**
 * @name ListView Component to display a list of items
 * @description A list view component that renders a list of items.
 * @param {Array<any>} items - The list of items to be rendered
 * @param {boolean} reversedOrder - Whether to reverse the order of the list
 * @param {boolean} loading - Whether the list is loading
 * @param {React.RefObject<HTMLDivElement>} ref - The ref to be used for scrolling
 * @param {React.ReactNode} placeholder - The placeholder to be displayed when the list is empty
 * @param {React.ReactNode} renderItem - The function that renders each item
 * @param {React.ReactNode} placeholder - The placeholder to be displayed when the list is empty
 * @param {React.ReactNode} noItemsElement - The message to be displayed when the list is empty
 * @param {React.ReactNode} footerElement - The element to be displayed at the bottom of the list
 * @param {string} className - The class name to be applied to the list view
 * @returns {React.ReactNode} - The list view component
 */
export const ListView: React.FC<ListViewProps> = ({
  items,
  renderItem,
  noItemsElement,
  footerElement,
  placeholder,
  className,
  loading = false,
  sortBy,
  ref,
}) => {
  if (loading) {
    return placeholder ? <>{placeholder}</> : null;
  }

  if (!items || items === null || items.length === 0) {
    if (noItemsElement) {
      return (
        <>
          {noItemsElement}
          {footerElement && footerElement}
        </>
      );
    } else {
      return null;
    }
  }
  if (sortBy && items && items.length > 0) {
    items.sort(sortBy);
  }

  return (
    <div
      ref={ref}
      className={cx("ListView", items?.length > 0 ? className : "")}
    >
      {items.map((item, index) => renderItem(item, index))}
      {footerElement && footerElement}
    </div>
  );
};
