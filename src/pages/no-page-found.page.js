import React, { useEffect } from "react";

function NoPageFound() {
  useEffect(() => {
    document.title = "Page not found | Pulse";
  });
  return (
    <div className="bg-gray-100">
      <div className="flex h-screen items-center place-content-center  max-w-screen">
        <p className="text-center text-xl">No page found</p>
      </div>
    </div>
  );
}

export default NoPageFound;
