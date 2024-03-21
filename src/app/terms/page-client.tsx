"use client";

import NovelEditor from "@/components/ui/editor/editor";
import { useEffect } from "react";

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
