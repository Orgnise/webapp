"use client";

import NovelEditor from "@/components/ui/editor/editor";
import { constructMetadata } from "@/lib/utility/construct-metadata";
import { useEffect } from "react";

export const metadata = constructMetadata({
  title: `Terms and Conditions - ${process.env.NEXT_PUBLIC_APP_NAME}`,
});

export default function TermsAndConditionPageClient({ data }: { data: any }) {
  useEffect(() => {
    document.title = "Terms and Conditions - Orgnise";
  }, []);
  return (
    <NovelEditor
      content={data}
      editable={false}
      storageKey={"privacy-policy"}
      editorClassName="border-none"
      autofocus={false}
    />
  );
}
