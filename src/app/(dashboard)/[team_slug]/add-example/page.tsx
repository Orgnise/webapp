"use client";

/**
 * Terms and conditions page
 */
export default function TermsAndConditionPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="bg-default flex h-screen flex-col">
      <div className="flex flex-1 items-center ">
        <div className="mx-auto max-w-xl px-3 py-24">
          <div className="flex flex-col place-content-center items-center space-y-3 text-sm">
            {/* <CreateTeam /> */}
            {params.slug}
          </div>
        </div>
      </div>
    </div>
  );
}
