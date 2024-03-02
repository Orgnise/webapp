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
    <div className="sticky z-10 border-b border-border bg-card px-4 font-medium before:top-0">
      <div className="flex  items-center">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </div>
    </div>
  );
};
