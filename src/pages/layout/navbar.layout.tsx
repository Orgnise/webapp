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
    <div className=" bg-slate-700 text-white font-medium">
      <div className="h-16 flex items-center">
        <div className="flex items-center flex-shrink-0 px-4 w-64">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
            alt="Workflow"
          />
        </div>
        <div className="mx-auto max-w-7xl w-full">{children}</div>
      </div>
    </div>
  );
};
