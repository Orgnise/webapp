import { Logo } from "@/components/atom/logo";
import { Spinner } from "@/components/atom/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { TeamRole } from "@/lib/constants/team-role";
import { fetcher } from "@/lib/fetcher";
import useTeam from "@/lib/swr/use-team";
import { Team } from "@/lib/types/types";
import clsx from "clsx";
import { MinusCircleIcon, Plus } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";

interface EmailInvite {
  email: string;
  role: TeamRole;
}

export default function InviteViaEmail({ team }: { team?: Team }) {
  const [resetLinkStatus, setResetLinkStatus] = useState<
    "IDLE" | "LOADING" | "SUCCESS"
  >();

  const { toast } = useToast();
  const MAX_ALLOWED_EMAILS = 5;

  const [emails, setEmails] = useState<EmailInvite[]>([
    {
      email: "",
      role: "member",
    },
  ]);

  const { team: activeTeam, error, loading, updateTeamAsync } = useTeam();

  function senInvitedMail(e: any) {
    e.preventDefault();
    setResetLinkStatus("LOADING");
    fetcher(`/api/teams/${team?.meta.slug}/invites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails: emails }),
    })
      .then(async (res) => {
        await mutate(`/api/teams/${team?.meta.slug}/invites`);
        toast({
          title: "Success!",
          description: "Invitation sent!",
        });
        setResetLinkStatus("SUCCESS");

        document.getElementById("InviteTeamCloseDialogButton")?.click();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error!",
          description:
            error?.message ??
            "Sending invitation failed. Try agin in some time",
          variant: "destructive",
        });
        setResetLinkStatus("IDLE");
      });
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
        <Logo className="h-10" />
        <h3 className="text-lg font-medium">Send Invite Emails</h3>
        <p className="text-center text-sm text-muted-foreground/90">
          Invite a teammate to join your team. Invitations will be valid for 14
          days.
        </p>
      </div>

      <form
        onSubmit={senInvitedMail}
        className="flex w-full flex-col  overflow-hidden bg-accent px-4 py-8 text-left sm:px-8"
      >
        <div className="flex flex-col gap-4">
          {emails.map((email, index) => (
            <div key={index} className="flex flex-col gap-1">
              <label
                htmlFor={`email-${index}`}
                className="text-sm text-secondary-foreground"
              >
                Email
              </label>
              <div className="group flex flex-row items-center gap-1">
                <div className="group flex w-full flex-row items-center gap-1 border border-border bg-background ">
                  <Input
                    type="email"
                    value={email.email}
                    onChange={(e) => {
                      const updatedEmails = emails.map((email, i) =>
                        i === index
                          ? { ...email, email: e.target.value }
                          : email,
                      );
                      setEmails(updatedEmails);
                    }}
                    placeholder="enter email address"
                    required
                    name={`email-${index}`}
                    className="rounded-none border-none bg-transparent dark:bg-background"
                  />
                  <MinusCircleIcon
                    className={clsx(
                      "invisible mr-1 cursor-pointer text-destructive group-hover:visible",
                      {
                        hidden: emails.length === 1,
                      },
                    )}
                    size="20"
                    onClick={() => {
                      setEmails(emails.filter((_, i) => i !== index));
                    }}
                  />
                  <Select
                    defaultValue={email.role}
                    onValueChange={(e) => {
                      setEmails(
                        emails.map((email, i) =>
                          i === index
                            ? { ...email, role: e as TeamRole }
                            : email,
                        ),
                      );
                    }}
                  >
                    <SelectTrigger className="w-[140px] gap-1 border-none px-2 ">
                      <SelectValue placeholder={email.role} />
                    </SelectTrigger>
                    <SelectContent className="border-border">
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={emails.length >= MAX_ALLOWED_EMAILS}
          className="hover:bg-accent-hover hover:text-accent-hover disabled:hover:text-secondary-foreground/72 flex h-10 max-w-fit items-center justify-center gap-1.5  rounded-md text-sm text-secondary-foreground/70 hover:text-secondary-foreground disabled:cursor-not-allowed disabled:px-1 disabled:text-xs"
          onClick={() => {
            setEmails([...emails, { email: "", role: "member" }]);
          }}
        >
          {emails.length < MAX_ALLOWED_EMAILS ? (
            <span className="flex items-center">
              <Plus className="h-4" />
              Add another
            </span>
          ) : (
            `Max ${MAX_ALLOWED_EMAILS} emails allowed`
          )}
        </button>

        <Button
          disabled={resetLinkStatus === "LOADING"}
          className="mt-4 cursor-pointer"
        >
          {resetLinkStatus === "LOADING" ? (
            <Spinner className="h-6" />
          ) : (
            "Send invite"
          )}
        </Button>
      </form>
    </div>
  );
}
