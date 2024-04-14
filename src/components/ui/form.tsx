import { InputHTMLAttributes, ReactNode, useMemo, useState } from "react";
import { Spinner } from "../atom/spinner";
import { Button } from "./button";
import { Input } from "./input";

export function Form({
  title,
  description,
  inputAttrs,
  helpText,
  buttonText = "Save Changes",
  disabled,
  handleSubmit,
}: {
  title: string;
  description: string;
  inputAttrs: InputHTMLAttributes<HTMLInputElement>;
  helpText?: string | ReactNode;
  buttonText?: string;
  disabled?: string | ReactNode;
  handleSubmit: (data: any) => Promise<any>;
}) {
  const [value, setValue] = useState(inputAttrs.defaultValue);
  const [saving, setSaving] = useState(false);
  const saveDisabled = useMemo(() => {
    return saving || !value || value === inputAttrs.defaultValue;
  }, [saving, value, inputAttrs.defaultValue]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        await handleSubmit({
          [inputAttrs.name as string]: value,
        });
        setSaving(false);
      }}
      className="rounded-lg border border-border bg-card"
    >
      <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {typeof inputAttrs.defaultValue === "string" ? (
          <Input
            {...inputAttrs}
            placeholder="My team"
            minLength={3}
            maxLength={32}
            name="name"
            type={inputAttrs.type || "text"}
            disabled={disabled ? true : false}
            required
            // defaultValue={team!.name}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : (
          <div className="h-[2.35rem] w-full max-w-md animate-pulse rounded-md bg-accent/40" />
        )}
      </div>

      <div className="flex items-center justify-between space-x-4 rounded-b-lg border-t border-border bg-accent/20 p-3 sm:px-10">
        {typeof helpText === "string" ? (
          <p
            className="prose-sm text-muted-foreground transition-colors prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-gray-700"
            dangerouslySetInnerHTML={{ __html: helpText || "" }}
          />
        ) : (
          helpText
        )}
        <div className="flex shrink-0 items-center">
          <Button disabled={saveDisabled} variant={"default"}>
            {saving ? <Spinner className="h-8" /> : buttonText}
          </Button>
        </div>
      </div>
    </form>
  );
}
