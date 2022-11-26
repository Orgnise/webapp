import React from "react";

export const WithBreadcrumb = ({ BCrumb, children }: any) => {
  return (
    <section className="flex flex-col h-screen bg-gray-100">
      {/* Display the list of organizations */}
      <div className="overflow-y-auto">
        <div className="max-w-screen-xl mx-auto mb-32">
          {BCrumb}
          {children}
        </div>
      </div>
    </section>
  );
};
