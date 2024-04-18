import { Logo } from "@/components/atom/logo";
import { Token } from "@/lib/types/types";
import { timeAgo } from "@/lib/utility/datetime";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { TokenAvatar } from "../avatar";
import { Badge } from "../badge";
import { Button2 } from "../button";
import { Modal } from "../model";

function DeleteTokenModal({
  showDeleteTokenModal,
  setShowDeleteTokenModal,
  token,
}: {
  showDeleteTokenModal: boolean;
  setShowDeleteTokenModal: Dispatch<SetStateAction<boolean>>;
  token: Token;
}) {
  const [removing, setRemoving] = useState(false);

  return (
    <Modal
      showModal={showDeleteTokenModal}
      setShowModal={setShowDeleteTokenModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
        <Logo className="h-12 " />
        <h3 className="text-lg font-medium">Delete API Key</h3>
        <p className="text-center text-sm text-muted-foreground/90">
          This will permanently delete the API key for and revoke all access to
          your account. Are you sure you want to continue?
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-accent/30 px-4 py-8 text-left sm:px-16">
        <div className="relative flex items-center space-x-3 rounded-md border border-border bg-card px-1 py-3">
          <Badge variant="default" className="absolute bottom-1 right-2">
            {token.partialKey}
          </Badge>
          <TokenAvatar id={token._id} />
          <div className="flex flex-col">
            <h3 className="line-clamp-1 w-48 font-semibold text-secondary-foreground/85">
              {token.name}
            </h3>
            <p
              className="text-xs text-muted-foreground/90"
              suppressHydrationWarning
            >
              Last used {timeAgo(token.lastUsed, { withAgo: true })}
            </p>
          </div>
        </div>
        <Button2
          text="Confirm"
          variant="destructive"
          loading={removing}
          onClick={() => {
            setRemoving(true);
            fetch(`/api/user/tokens?id=${token._id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            }).then(async (res) => {
              setRemoving(false);
              if (res.status === 200) {
                toast.success(`Successfully deleted API key`);
                mutate("/api/user/tokens");
                setShowDeleteTokenModal(false);
              } else {
                const error = await res.text();
                toast.error(error);
              }
            });
          }}
        />
      </div>
    </Modal>
  );
}

export function useDeleteTokenModal({ token }: { token: Token }) {
  const [showDeleteTokenModal, setShowDeleteTokenModal] = useState(false);

  const DeleteTokenModalCallback = useCallback(() => {
    return (
      <DeleteTokenModal
        showDeleteTokenModal={showDeleteTokenModal}
        setShowDeleteTokenModal={setShowDeleteTokenModal}
        token={token}
      />
    );
  }, [showDeleteTokenModal, token]);

  return useMemo(
    () => ({
      setShowDeleteTokenModal,
      DeleteTokenModal: DeleteTokenModalCallback,
    }),
    [setShowDeleteTokenModal, DeleteTokenModalCallback],
  );
}
