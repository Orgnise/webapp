import { Spinner } from "@/components/atom/spinner";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/model";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { Input } from "../input";

export default function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
}: {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [deleting, setDeleting] = useState(false);

  async function deleteAccount() {
    setDeleting(true);
    await fetch(`/api/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (res.status === 200) {
        update();
        // delay to allow for the route change to complete
        await new Promise((resolve) =>
          setTimeout(() => {
            router.push("/register");
            resolve(null);
          }, 200),
        );
      } else {
        setDeleting(false);
        const error = await res.text();
        throw error;
      }
    });
  }

  return (
    <Modal
      showModal={showDeleteAccountModal}
      setShowModal={setShowDeleteAccountModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
        <Avatar user={session?.user} />
        <h3 className="text-lg font-medium">Delete Account</h3>
        <p className="text-center text-sm text-muted-foreground">
          Warning: This will permanently delete your account, all your
          workspaces, and all your short links.
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(deleteAccount(), {
            loading: "Deleting account...",
            success: "Account deleted successfully!",
            error: (err) => err,
          });
        }}
        className="flex flex-col space-y-6 bg-accent/30 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label
            htmlFor="verification"
            className="block text-sm text-secondary-foreground/80"
          >
            To verify, type{" "}
            <span className="font-semibold text-secondary-foreground">
              confirm delete account
            </span>{" "}
            below
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            {/* <input
              type="text"
              name="verification"
              id="verification"
              pattern="confirm delete account"
              required
              autoFocus={false}
              autoComplete="off"
              className="block w-full rounded-md border-border text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            /> */}
            <Input
              type="text"
              name="verification"
              id="verification"
              pattern="confirm delete account"
              required
              autoFocus={false}
              autoComplete="off"
            />
          </div>
        </div>

        <Button variant="destructive">
          {deleting ? <Spinner /> : "Confirm Delete Account"}
        </Button>
      </form>
    </Modal>
  );
}

export function useDeleteAccountModal() {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const DeleteAccountModalCallback = useCallback(() => {
    return (
      <DeleteAccountModal
        showDeleteAccountModal={showDeleteAccountModal}
        setShowDeleteAccountModal={setShowDeleteAccountModal}
      />
    );
  }, [showDeleteAccountModal, setShowDeleteAccountModal]);

  return useMemo(
    () => ({
      setShowDeleteAccountModal,
      DeleteAccountModal: DeleteAccountModalCallback,
    }),
    [setShowDeleteAccountModal, DeleteAccountModalCallback],
  );
}
