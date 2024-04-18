"use client";

import Label from "@/components/atom/label";
import { Spinner } from "@/components/atom/spinner";
import { TextField } from "@/components/molecule/text-field";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginWithCredentialsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setError] = useState<{
    email?: string;
    password?: string;
    other?: string;
  }>({});

  const searchParams = useSearchParams();
  const next = searchParams?.get("next");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setError({});
    setIsLoading(true);
    const email = e.target?.email?.value;
    const password = e.target.password?.value;
    await signIn("credentials", {
      email: email,
      password: password,
      callbackUrl: next && next.length > 0 ? next : "/",
    }).catch((error) => {
      console.log(error);
    });
    setIsLoading(false);
  };

  return (
    <form
      className="flex h-full flex-col place-content-center  items-center  rounded-md"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center font-normal">
        <Label size="h1" variant="t2">
          Welcome back
        </Label>
        <Label className="mb-12">
          We are <strong className="theme-text-primary">happy</strong> to see
          you back
        </Label>
      </div>
      <TextField
        label="Email"
        name="email"
        required={true}
        autoComplete="email"
        error={errors.email}
        type="email"
        wrapperClassName="w-9/12"
      />
      <TextField
        label="Password"
        name="password"
        minLength={6}
        required={true}
        autoComplete="password"
        error={errors.password}
        type="password"
        wrapperClassName="w-9/12"
      />
      <Button className="mt-4 w-9/12" type="submit">
        {isLoading ? (
          <span className="flex items-center gap-1">
            <Spinner className="h-6" />
            <span>Logging In</span>
          </span>
        ) : (
          "Login"
        )}
      </Button>
      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {errors?.other && (
          <>
            <p className="text-sm text-red-500">{errors?.other}</p>
          </>
        )}
      </div>
      <div className="flex w-9/12 place-content-evenly items-center py-10 text-center">
        <span className="theme-border flex-1 border-t" />
        <span className="px-4 text-sm ">OR</span>
        <span className="theme-border flex-1 border-t" />
      </div>
      <div className="mt-4 flex gap-4">
        {/* GOOGLE LOGIN */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            // googleLogin();
            await signIn("google");
          }}
          className=" rounded-full bg-card p-2 shadow"
        >
          <Image
            unoptimized={true}
            height={32}
            width={32}
            src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Google-favicon-vector.png"
            className="h-8 w-8"
            alt={"Google"}
          />
        </button>
        {/* Github Login */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            await signIn("github");
          }}
          className="rounded-full bg-card p-2 shadow"
        >
          <Image
            unoptimized={true}
            src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
            className="h-8 w-8"
            height={32}
            width={32}
            alt="Github"
          />
        </button>
        {/* Twitter Login */}
        <button
          className=" rounded-full bg-card p-2 shadow"
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
            src="https://abs.twimg.com/favicons/twitter.ico"
            className="h-8 w-8"
            alt="Twitter"
          />
        </button>
      </div>
      <div className="flex w-9/12 place-content-evenly items-center pt-10 text-center">
        <span className="theme-border flex-1 border-t" />
        <span className="cursor-pointer px-4 text-sm underline">
          <Link href={"/signup"}>CREATE AN ACCOUNT</Link>
        </span>
        <span className="theme-border flex-1 border-t" />
      </div>

      {/* Terms & Conditions and Privacy Policy */}
      <div className="flex w-9/12 flex-col place-content-center items-center pt-10 text-center">
        <span className="text-sm">
          By signing in, you agree to our{" "}
          <span className="cursor-pointer underline">
            <Link href="terms">Terms & Conditions</Link>
          </span>{" "}
          and{" "}
          <span className="cursor-pointer underline">
            <Link href="policy">Privacy Policy</Link>
          </span>
        </span>
      </div>
    </form>
  );
}
