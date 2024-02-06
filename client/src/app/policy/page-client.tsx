"use client";

import { Editor } from "novel";
import { useEffect } from "react";

export default function PrivacyPolicyPageClient({ data }: { data: any }) {
    useEffect(() => {
        document.title = "Privacy Policy - Pulse";
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 200);

    }, []);
    return (
        <Editor
            key={"privacy-policy"}
            className="shadow-none p-0 m-0"
            defaultValue={data}
            disableLocalStorage={true}
            editorProps={{
                editable: (state) => false,
            }}
        />

    );
}
