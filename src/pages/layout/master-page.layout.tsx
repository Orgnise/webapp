import React from "react";
import { NavbarLayout } from "./navbar.layout";

interface MasterPageLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  navbar: React.ReactNode;
  content: React.ReactNode;
}
/**
 * MasterPageLayout is a layout component that wraps sidebars and content
 * @param children
 */

export const MasterPageLayout = ({
  children,
  sidebar,
  navbar,
}: MasterPageLayoutProps) => {
  return (
    <div className="MasterPageLayout flex flex-col h-screen ">
      <NavbarLayout>{navbar}</NavbarLayout>

      {/* Content */}
      <div className="flex overflow-hidden">
        {/* Sidebar */}
        <div className="">{sidebar}</div>

        {/*  Page content */}
        <main className="flex-1 z-0">
          <div className="mx-auto sm:px-4">{children}</div>
        </main>
      </div>
    </div>
  );
};
