"use client";

import { IconMenu } from "@/components/atom/icon-menu";
import { TokenAvatar } from "@/components/ui/avatar";
import { Form } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useDeleteTokenModal } from "@/components/ui/models/delete-token-modal";
import { useTokenCreatedModal } from "@/components/ui/models/token-created-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetcher } from "@/lib/fetcher";
import { Token } from "@/lib/types/types";
import { timeAgo } from "@/lib/utility/datetime";

import { FolderOpen, MoreVertical, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function TokensPageClient() {
  const {
    data: tokens,
    mutate,
    isLoading,
  } = useSWR<Token[]>("/api/user/tokens", fetcher);

  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const { TokenCreatedModal, setShowTokenCreatedModal } = useTokenCreatedModal({
    token: createdToken || "",
  });
  return (
    <>
      <TokenCreatedModal />
      <Form
        title="Create New API Key"
        description="Enter a unique name for your API key to differentiate it from other keys."
        inputAttrs={{
          name: "name",
          defaultValue: "",
          placeholder: "Second Brain API Key",
          maxLength: 140,
        }}
        helpText="<a href='http://docs.orgnise.in/api-reference/introduction' target='_blank'>Learn more about Orgnise's API.</a>"
        buttonText="Submit"
        handleSubmit={(data) =>
          fetch("/api/user/tokens", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.status === 200) {
              const { token } = await res.json();
              setCreatedToken(token);
              setShowTokenCreatedModal(true);
              mutate();
              toast.success("Successfully created a new token!");
            } else {
              const errorMessage = await res.text();
              toast.error(errorMessage || "Something went wrong");
            }
          })
        }
      />
      <div className="rounded-lg border border-border bg-card">
        <div className="flex flex-col space-y-3 p-5 sm:p-10">
          <h2 className="text-xl font-medium">Your API Keys</h2>
          <p className="text-sm text-muted-foreground">
            These API keys allow other apps to access your account. Use it with
            caution - do not share your API key with others, or expose it in the
            browser or other client-side code
          </p>
        </div>
        {isLoading || !tokens ? (
          <div className="flex flex-col items-center justify-center space-y-4 pb-20 pt-10">
            <LoadingSpinner className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Fetching API keys...
            </p>
          </div>
        ) : tokens.length > 0 ? (
          <div>
            <div className="grid grid-cols-5 border-b border-border px-5 py-2 text-sm font-medium text-muted-foreground sm:px-10">
              <div className="col-span-3">Name</div>
              <div>Key</div>
              <div className="text-center">Last used</div>
            </div>
            <div className="divide-y divide-border">
              {tokens.map((token) => (
                <TokenRow key={token._id} {...token} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 pb-20 pt-10">
            <FolderOpen className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No API keys found. Create one above.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

const TokenRow = (token: Token) => {
  const [openPopover, setOpenPopover] = useState(false);
  const { DeleteTokenModal, setShowDeleteTokenModal } = useDeleteTokenModal({
    token,
  });
  return (
    <>
      <DeleteTokenModal />
      <div className="relative grid grid-cols-5 items-center px-5 py-3 sm:px-10">
        <div className="col-span-3 flex items-center space-x-3">
          <TokenAvatar id={token._id} />
          <div className="flex flex-col space-y-px">
            <p className="font-semibold text-secondary-foreground/85">
              {token.name}
            </p>
            <p
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              Created {timeAgo(token.createdAt, { withAgo: true })}
            </p>
          </div>
        </div>
        <div className="font-mono text-sm">{token.partialKey}</div>
        <div
          className="text-center text-sm text-muted-foreground"
          suppressHydrationWarning
        >
          {timeAgo(token.lastUsed)}
        </div>
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger className="absolute right-4 top-3">
            <button
              onClick={() => {
                setOpenPopover(!openPopover);
              }}
              className=" active:bg-accent/200 rounded-md px-1 py-2 transition-all duration-75 hover:bg-accent/100"
            >
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <div className="grid w-full gap-1 ">
              <button
                onClick={() => {
                  setOpenPopover(false);
                  setShowDeleteTokenModal(true);
                }}
                className="rounded-md p-2 text-left text-sm font-medium text-destructive transition-all duration-75 hover:bg-destructive hover:text-destructive-foreground"
              >
                <IconMenu
                  text="Delete API Key"
                  icon={<Trash className="h-4 w-4" />}
                />
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
