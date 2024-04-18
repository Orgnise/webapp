import { Logo } from "@/components/atom/logo";
import { Modal } from "@/components/ui/model";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Button2 } from "../button";
import { CopyButton } from "../copy-button";

function TokenCreatedModal({
  showTokenCreatedModal,
  setShowTokenCreatedModal,
  token,
}: {
  showTokenCreatedModal: boolean;
  setShowTokenCreatedModal: Dispatch<SetStateAction<boolean>>;
  token: string;
}) {
  return (
    <Modal
      showModal={showTokenCreatedModal}
      setShowModal={setShowTokenCreatedModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
        <Logo className="h-12" />
        <h3 className="text-lg font-medium">API Key Created</h3>
        <p className="text-center text-sm text-muted-foreground/90">
          For security reasons, we will only show you the key once. Please copy
          and store it somewhere safe.
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-accent/30 px-4 py-8 text-left sm:px-16">
        <div className="flex items-center justify-between rounded-md border border-border bg-card p-3">
          <p className="font-mono text-sm text-muted-foreground/90">{token}</p>
          <CopyButton value={token} className="rounded-md" />
        </div>
        <Button2
          text="Done"
          variant="secondary"
          onClick={() => setShowTokenCreatedModal(false)}
        />
      </div>
    </Modal>
  );
}

export function useTokenCreatedModal({ token }: { token: string }) {
  const [showTokenCreatedModal, setShowTokenCreatedModal] = useState(false);

  const TokenCreatedModalCallback = useCallback(() => {
    return (
      <TokenCreatedModal
        showTokenCreatedModal={showTokenCreatedModal}
        setShowTokenCreatedModal={setShowTokenCreatedModal}
        token={token}
      />
    );
  }, [showTokenCreatedModal, token]);

  return useMemo(
    () => ({
      setShowTokenCreatedModal,
      TokenCreatedModal: TokenCreatedModalCallback,
    }),
    [setShowTokenCreatedModal, TokenCreatedModalCallback],
  );
}
