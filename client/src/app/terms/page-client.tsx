"use client";

import { Editor } from "novel";
import { useEffect } from "react";

export default function TermsAndConditionPageClient({ data }: { data: any }) {
    useEffect(() => {
        document.title = "Terms and Conditions - Pulse";
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 200);

    }, []);
    return (
        <Editor
            key={"terms-and-conditions"}
            className="shadow-none p-0 m-0"
            defaultValue={data}
            disableLocalStorage={true}
            editorProps={{
                editable: (state) => false,
            }}
        />

    );
}
