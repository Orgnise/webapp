"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import DeleteAccountModal from "@/components/ui/models/delete-account-modal";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useState } from "react";

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
      <DeleteAccountSection />
    </div>
  );
}

export function DeleteAccountSection() {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  return (
    <div className="rounded-lg border border-destructive bg-card">
      <DeleteAccountModal
        showDeleteAccountModal={showDeleteAccountModal}
        setShowDeleteAccountModal={setShowDeleteAccountModal}
      />
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="text-xl font-medium">Delete Account</h2>
        <p className="text-sm text-muted-foreground">
          Permanently delete your {process.env.NEXT_PUBLIC_APP_NAME} account,
          all of your teams, workspaces and their respective collections. This
          action cannot be undone - please proceed with caution.
        </p>
      </div>
      <div className="border-b border-destructive" />

      <div className="flex items-center justify-end p-3 sm:px-10">
        <div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteAccountModal(true)}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
