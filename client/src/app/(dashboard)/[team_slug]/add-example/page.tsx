"use client";

import { NavbarLayout } from "@/components/layout/nav-layout";
import React from "react";

/**
 * Terms and conditions page
 */
export default function TermsAndConditionPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex flex-col h-screen bg-default">
      <div className="flex-1 flex items-center ">
        <div className="max-w-xl mx-auto py-24 px-3">
          <div className="flex flex-col space-y-3 items-center place-content-center text-sm">
            {/* <CreateTeam /> */}
            {params.slug}
          </div>
        </div>
      </div>
    </div>
  );
}
