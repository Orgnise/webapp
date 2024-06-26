import { trim } from "@/lib/functions/trim";
import { InputHTMLAttributes, ReactNode, useMemo, useState } from "react";
import { Button2 } from "./button";
import { Input } from "./input";
import { Switch } from "./switch";

export function Form({
  title,
  description,
  inputAttrs,
  helpText,
  buttonText = "Save Changes",
  disabledTooltip,
  handleSubmit,
  inputSwitch,
}: {
  title: string;
  description: string;
  inputAttrs?: InputHTMLAttributes<HTMLInputElement>;
  inputSwitch?: {
    name: string;
    labelOnChecked: string;
    labelOnUnChecked?: string;
    checked: boolean;
  };
  helpText?: string | ReactNode;
  buttonText?: string;
  disabledTooltip?: string | ReactNode;
  handleSubmit: (data: any) => Promise<any>;
}) {
  const [value, setValue] = useState(
    inputAttrs?.defaultValue ?? inputSwitch?.checked,
  );
  const [saving, setSaving] = useState(false);
  const saveDisabled = useMemo(() => {
    const isDisabled =
      saving ||
      value == undefined ||
      trim(value) === "" ||
      value === (inputAttrs?.defaultValue ?? inputSwitch?.checked);
    return isDisabled;
  }, [saving, value, inputAttrs?.defaultValue, inputSwitch?.checked]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        const keyName = inputAttrs
          ? inputAttrs.name!
          : inputSwitch
            ? inputSwitch.name
            : "";
        try {
          await handleSubmit({
            [keyName]: value,
          });
        } catch (error) {}
        setSaving(false);
      }}
      className="rounded-lg border border-border bg-card"
    >
      <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {inputAttrs && typeof inputAttrs.defaultValue === "string" ? (
          <Input
            {...inputAttrs}
            type={inputAttrs.type || "text"}
            disabled={disabledTooltip ? true : false}
            required
            // defaultValue={team!.name}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : inputSwitch ? (
          <div className="flex h-10 items-center rounded border border-border p-2">
            <label
              htmlFor={inputSwitch.name}
              className="flex-grow text-sm text-muted-foreground"
            >
              {value
                ? inputSwitch.labelOnChecked
                : inputSwitch.labelOnUnChecked}
            </label>
            <Switch
              id={inputSwitch.name}
              name={inputSwitch.name}
              disabled={disabledTooltip ? true : false}
              onCheckedChange={(val) => {
                console.log("Check change to:", val);
                setValue(val);
              }}
              checked={value as boolean}
            />
          </div>
        ) : (
          <div className="h-[2.35rem] w-full max-w-md animate-pulse rounded-md bg-accent/40" />
        )}
      </div>

      <div className="flex items-center justify-between space-x-4 rounded-b-lg border-t border-border bg-accent/20 p-3 sm:px-10">
        {typeof helpText === "string" ? (
          <p
            className="prose-sm text-muted-foreground transition-colors prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-secondary-foreground/85"
            dangerouslySetInnerHTML={{ __html: helpText || "" }}
          />
        ) : (
          helpText
        )}
        <div className="flex shrink-0 items-center">
          <Button2
            disabled={saveDisabled}
            loading={saving}
            variant={"default"}
            text={buttonText}
            disabledTooltip={disabledTooltip}
          />
        </div>
      </div>
    </form>
  );
}
