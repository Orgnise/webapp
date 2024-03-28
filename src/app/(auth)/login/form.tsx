"use client";

import { Spinner } from "@/components/atom/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fold } from "@/lib/utils";
import cx from "classnames";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
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
          signIn("email", {
            email,
            redirect: false,
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          }).then((res) => {
            if (res?.ok && !res?.error) {
              // Clear email value
              if (emailRef.current) emailRef.current!.value = "";
              toast.success("Email sent - check your inbox!");
            } else {
              toast.error("Error sending email - try again?");
            }
            setShowEmailOption(false);
          });
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
          onClick={async (e) => {
            e.preventDefault();
            // googleLogin();
            await signIn("google");
          }}
          className="flex w-1/3 place-content-center rounded-sm border border-border bg-white p-1.5"
        >
          <Image
            unoptimized={true}
            height={32}
            width={32}
            src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Google-favicon-vector.png"
            className="h-6 w-6"
            alt={"Google"}
          />
        </button>
        {/* Github Login */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            await signIn("github");
          }}
          className="flex w-1/3 place-content-center rounded-sm border border-border bg-white p-1.5"
        >
          <Image
            unoptimized={true}
            src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
            className="h-6 w-6"
            height={32}
            width={32}
            alt="Github"
          />
        </button>
        {/* X Login */}
        {/* <button
          className="flex w-1/3 place-content-center rounded-sm border border-border bg-white p-1.5"
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
          className="flex w-1/3 place-content-center rounded-sm border border-border bg-white p-1.5"
          onClick={async (e) => {
            e.preventDefault();
            // googleLogin();
            await signIn("slack");
          }}
        >
          <Image
            unoptimized={true}
            height={32}
            width={32}
            src="https://previews.us-east-1.widencdn.net/preview/48045879/assets/asset-view/0cece34e-cbb7-4c6f-be3e-d475baeb3a8d/thumbnail/eyJ3Ijo0ODAsImgiOjQ4MCwic2NvcGUiOiJhcHAifQ==?Expires=1711648800&Signature=RylY68r7Rqga~CLxYCyXsz52ywGbwK6BNAhvEln1prkGcdaj1jzhiF3Y8YgsOlTD2Bv-iF7qolm2YwuXI-RRwteXirEX6oXkErjPz-cogkVBZd~797r4caiF02v7vvSI30BESnihsPum6yRbomXGXaCamwGww-39ZNYSxxxeRZsh0QA3GU7PggM7Rfb8w~A8bDEYFEtAP4zuefO~iuD0q-Yc-0Ee7T1Y3pIaPI-dYSuEPjeGdRFzJD4fYQVFtK60bvakUSCsVk1Lq0z8~S5JWr6bQPMBAGeaH2pUu07iEkumNAF3EV3sh98uoyV6wARGlR6TAN7PNsHCDdvQr~7a-w__&Key-Pair-Id=APKAJM7FVRD2EPOYUXBQ"
            className="h-5 w-5"
            alt="Slack"
          />
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
