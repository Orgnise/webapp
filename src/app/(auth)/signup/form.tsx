"use client";

import cx from "classnames";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setError] = useState<{
    email?: string;
    password?: string;
    other?: string;
  }>({});
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");

  return (
    <div className="flex h-full flex-col place-content-center items-center bg-secondary/60 py-6">
      <div className="mt-4 flex w-9/12 flex-col place-content-evenly gap-2">
        {/* GOOGLE LOGIN */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            // googleLogin();
            await signIn("google");
          }}
          className="flex w-full place-content-center items-center rounded-sm border border-border bg-white p-1.5"
        >
          <Image
            unoptimized={true}
            height={32}
            width={32}
            src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Google-favicon-vector.png"
            className="h-6 w-6"
            alt={"Google"}
          />
          <span className="px-2 text-sm">Continue with Google</span>
        </button>
        {/* Github Login */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            await signIn("github");
          }}
          className="flex w-full place-content-center items-center rounded-sm border border-border bg-white p-1.5"
        >
          <Image
            unoptimized={true}
            src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
            className="h-6 w-6"
            height={32}
            width={32}
            alt="Github"
          />
          <span className="px-2 text-sm">Continue with Github</span>
        </button>
        {/* Twitter Login */}
        {/* <button
          className="flex w-full place-content-center items-center rounded-sm border border-border bg-white p-1.5"
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
            className="h-5 w-5"
            alt="X"
          />
          <span className="px-2 text-sm">Continue with X</span>
        </button> */}
        <button
          className="flex w-full place-content-center items-center rounded-sm border border-border bg-white p-1.5"
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
            src="_static/slack-logo.svg"
            className="h-6 w-6 scale-150"
            alt="Slack"
          />
          <span className="px-2 text-sm">Continue with Slack</span>
        </button>
      </div>

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

      <div
        className={cx(
          "mt-6 flex w-9/12 place-content-evenly items-center text-center text-sm text-muted-foreground",
        )}
      >
        <span className="flex-1 " />
        Already have an account?
        <span
          className={cx(
            "cursor-pointer px-1 font-bold hover:text-secondary-foreground",
            {},
          )}
        >
          <Link href={"/login"}>Log in</Link>
        </span>
        <span className="flex-1 " />
      </div>

      {/* Terms & Conditions and Privacy Policy */}
      {/* <div className="mt-6 flex w-9/12 flex-col place-content-center items-center pt-3 text-center text-xs text-muted-foreground/90">
        <span className="">
          By continue, you agree to our{" "}
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
