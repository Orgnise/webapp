"use client";

import { Spinner } from "@/components/atom/spinner";
import { LoadingSpinner } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fold } from "@/lib/utils";
import cx from "classnames";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setError] = useState<{
    email?: string;
    password?: string;
    other?: string;
  }>({});
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const signupPath = "/signup"; //next ? `/signup${next}` : "/signup";

  const emailRef = useRef<HTMLInputElement | null>(null);
  const [showEmailOption, setShowEmailOption] = useState(false);
  const [noSuchAccount, setNoSuchAccount] = useState(false);

  const [clickedGoogle, setClickedGoogle] = useState(false);
  const [clickedGithub, setClickedGithub] = useState(false);
  const [clickedSlack, setClickedSlack] = useState(false);

  useEffect(() => {
    // when leave page, reset state
    return () => {
      setClickedGoogle(false);
      setClickedGithub(false);
      setClickedSlack(false);
    };
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError({});
    setIsLoading(true);
    const email = e.target?.email?.value;
    console.log(process.env);
    fetch("/api/auth/account-exists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(async (res) => {
        const { exists } = await res.json();
        if (exists) {
          const res = await signIn("email", {
            email,
            redirect: false,
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          });
          if (res?.ok && !res?.error) {
            // Clear email value
            if (emailRef.current) emailRef.current!.value = "";
            toast.success("Email sent - check your inbox!");
          } else {
            toast.error("Error sending email - try again?");
          }
          setShowEmailOption(false);
        } else {
          toast.error("No account found with that email address.");
          setNoSuchAccount(true);
        }
      })
      .catch(() => {
        toast.error("Error sending email - try again?");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex h-full flex-col place-content-center items-center bg-secondary/60 py-6">
      <div className="mt-4 flex w-9/12 place-content-evenly gap-2">
        {/* GOOGLE LOGIN */}
        <button
          disabled={clickedGoogle || clickedGithub || clickedSlack}
          onClick={async (e) => {
            e.preventDefault();
            setClickedGoogle(true);
            // googleLogin();
            await signIn("google");
          }}
          className="flex w-1/3 place-content-center items-center rounded-sm border border-border bg-card p-1.5"
        >
          {clickedGoogle ? (
            <LoadingSpinner />
          ) : (
            <Image
              unoptimized={true}
              height={32}
              width={32}
              src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Google-favicon-vector.png"
              className="h-6 w-6"
              alt={"Google"}
            />
          )}
        </button>
        {/* Github Login */}
        <button
          disabled={clickedGoogle || clickedGithub || clickedSlack}
          onClick={async (e) => {
            setClickedGithub(true);
            e.preventDefault();
            await signIn("github");
          }}
          className="flex w-1/3 place-content-center rounded-sm border border-border bg-card p-1.5"
        >
          {clickedGithub ? (
            <LoadingSpinner />
          ) : (
            <Image
              unoptimized={true}
              src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
              className="h-6 w-6"
              height={32}
              width={32}
              alt="Github"
            />
          )}
        </button>
        {/* X Login */}
        {/* <button
          className="flex w-1/3 place-content-center rounded-sm border border-border bg-card p-1.5"
          onClick={async (e) => {
            e.preventDefault();
            // googleLogin();
            await signIn("twitter");
          }}
        >
          <Image
            unoptimized={true}
            height={32}
            width={32}
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"
            className="h-6 w-6"
            alt="X"
          />
        </button> */}
        {/** Slack */}
        <button
          disabled={clickedGoogle || clickedGithub || clickedSlack}
          className="flex w-1/3 place-content-center rounded-sm border border-border bg-card p-1.5"
          onClick={async (e) => {
            setClickedSlack(true);
            e.preventDefault();
            await signIn("slack");
          }}
        >
          {clickedSlack ? (
            <LoadingSpinner />
          ) : (
            <Image
              unoptimized={true}
              height={32}
              width={32}
              src="_static/slack-logo.svg"
              className="h-6 w-6 scale-150"
              alt="Slack"
            />
          )}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center"
      >
        {showEmailOption && (
          <div className="mt-4 flex w-full flex-col items-center">
            <div className="mx-auto my-6 h-[1px] w-10/12 border-t border-border dark:border-card" />
            <Input
              ref={emailRef}
              name="email"
              required={true}
              autoComplete="email"
              // error={errors.email}
              type="email"
              placeholder="email@example.com"
              className="mb-4 w-9/12 dark:border-card"
              onChange={(e) => {
                setNoSuchAccount(false);
              }}
            />
          </div>
        )}

        <Fold
          value={showEmailOption}
          ifPresent={(value: unknown) => (
            <Button className="mt-1 w-9/12" type={"submit"}>
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <Spinner className="h-6" />
                  <span>Logging In</span>
                </span>
              ) : (
                "Continue with Email"
              )}
            </Button>
          )}
          ifAbsent={() => (
            <Button
              className="hover:text-primary-background dark:hover:text-primary-background mt-4 w-9/12 bg-background text-secondary-foreground hover:bg-primary-foreground dark:hover:bg-primary-foreground"
              type={"button"}
              onClick={(e) => {
                e.preventDefault();
                setShowEmailOption(true);
              }}
            >
              Continue with Email
            </Button>
          )}
        />
      </form>

      <div
        className="flex items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {errors?.other && (
          <>
            <p className="text-sm text-red-500">{errors?.other}</p>
          </>
        )}
      </div>
      <div className="flex w-9/12 place-content-evenly items-center py-6 text-center">
        <span className="flex-1 border-t border-border dark:border-card" />

        <span className="flex-1 border-t border-border dark:border-card" />
      </div>

      <div
        className={cx(
          "flex w-9/12 place-content-evenly items-center text-center text-sm",
          {
            "text-muted-foreground": !noSuchAccount,
            "text-destructive": noSuchAccount,
          },
        )}
      >
        <span className="flex-1 " />

        {noSuchAccount ? "No such account" : "Don't have an account?"}
        <span
          className={cx("cursor-pointer px-1 font-bold", {
            "hover:text-secondary-foreground": !noSuchAccount,
          })}
        >
          <Link href={signupPath}>Sign up</Link>
        </span>
        {noSuchAccount ? "instead?" : ""}
        <span className="flex-1 " />
      </div>

      {/* Terms & Conditions and Privacy Policy */}
      {/* <div className="flex w-9/12 flex-col place-content-center items-center pt-3 text-center text-xs text-muted-foreground/90">
        <span className="">
          By signing in, you agree to our{" "}
          <span className="cursor-pointer underline">
            <Link href="terms">Terms & Conditions</Link>
          </span>{" "}
          and{" "}
          <span className="cursor-pointer underline">
            <Link href="policy">Privacy Policy</Link>
          </span>
        </span>
      </div> */}
    </div>
  );
}
