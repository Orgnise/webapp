import React from "react";
import Logo from "../../components/atom/logo";

interface NavbarLayoutProps {
  children: React.ReactNode;
}

/**
 * NavbarLayout is a layout component that wraps navbar and content
 * @param children
 */

export const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  return (
    <div className=" text-white font-medium border-b px-4">
      <div className="h-16 flex items-center">
        <div className="flex items-center flex-shrink-0  w-64">
          <Logo />
        </div>
        <div className="mx-auto max-w-7xl w-full">{children}</div>
      </div>
    </div>
  );
};
