"use client";
import NovelEditor from "@/components/ui/editor/editor";
import { useEffect } from "react";

export default function PrivacyPolicyPageClient({ data }: { data: any }) {
  useEffect(() => {
    document.title = `Privacy Policy - ${process.env.NEXT_PUBLIC_APP_NAME}`;
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
