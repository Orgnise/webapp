import React from "react";

interface NavbarLayoutProps {
  children: React.ReactNode;
}

/**
 * NavbarLayout is a layout component that wraps navbar and content
 * @param children
 */

export const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  return (
    <div className="font-medium theme-border border-b px-4 bg-card ">
      <div className="h-16 flex items-center">
        <div className="mx-auto max-w-7xl w-full">{children}</div>
      </div>
    </div>
  );
};
