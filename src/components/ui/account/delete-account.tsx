import { Button } from "@/components/ui/button";
import DeleteAccountModal from "@/components/ui/models/delete-account-modal";
import { useState } from "react";

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
