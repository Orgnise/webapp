"use client";
import { DeleteAccountSection } from "@/components/ui/account/delete-account";
import UploadAvatar from "@/components/ui/account/upload-avatar";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { APP_NAME } from "@/lib/constants/constants";
import { useSession } from "next-auth/react";

export default function SettingsPageClient() {
  const { data: session, update, status } = useSession();
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-6">
      <Form
        title="Your Name"
        description={`This will be your display name on Orgnise.`}
        inputAttrs={{
          name: "name",
          defaultValue:
            status === "loading" ? undefined : session?.user?.name || "",
          placeholder: "Steve Jobs",
          maxLength: 32,
        }}
        helpText="Max 32 characters."
        handleSubmit={(data) =>
          fetch("/api/user", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.status === 200) {
              // await update();
              update();
              toast({
                title: "Success",
                description: "Successfully updated your name!",
              });
            } else {
              const { error } = await res.json();
              toast({
                description: error.message,
                variant: "destructive",
              });
            }
          })
        }
      />
      <Form
        title="Your Email"
        description={`This will be the email you use to log in to ${APP_NAME} and receive notifications.`}
        inputAttrs={{
          name: "email",
          type: "email",
          defaultValue: session?.user?.email || undefined,
          placeholder: "stevs@jobs.co",
        }}
        helpText="Must be a valid email address."
        handleSubmit={(data) =>
          fetch("/api/user", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.status === 200) {
              update();
              toast({
                title: "Success",
                description: "Successfully updated your email!",
              });
            } else {
              const { error } = await res.json();
              toast({
                description: error.message,
                variant: "destructive",
              });
            }
          })
        }
      />
      <UploadAvatar />
      <DeleteAccountSection />
    </div>
  );
}
