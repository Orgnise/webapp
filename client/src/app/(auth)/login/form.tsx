"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import Label from "@/components/atom/label";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/molecule/text-field";
import { useSession, signIn, signOut } from "next-auth/react";

type LoginInput = {
  email: string;
  password: string;
};
export function LoginForm() {
  const [inputs, setInputs] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [errors, setError] = useState<{
    email?: string;
    password?: string;
    other?: string;
  }>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (inputs.password.length < 6) {
      setError({
        ...errors,
        password: "Password should be at least 6 characters long",
      });
      return;
    }
    setError({});
    await signIn("credentials", {
      email: inputs.email,
      password: inputs.password,
      callbackUrl: "/",
    }).catch((error) => {
      console.log(error);
    });
  };

  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <form
      className="flex flex-col items-center place-content-center  h-full  rounded-md"
      onSubmit={handleSubmit}>
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
        onChange={handleChange}
        value={inputs.email}
        autoComplete="email"
        error={errors.email}
        type="email"
        wrapperClassName="w-9/12"
        props={{
          name: "email",
        }}
      />
      <TextField
        label="Password"
        name="password"
        minLength={6}
        required={true}
        onChange={handleChange}
        value={inputs.password}
        autoComplete="password"
        error={errors.password}
        type="password"
        wrapperClassName="w-9/12"
        props={{
          name: "password",
        }}
      />
      <Button className="mt-4 w-9/12" type="submit">
        Log in
      </Button>
      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true">
        {errors?.other && (
          <>
            {/* <ExclamationCircleIcon className="h-5 w-5 text-red-500" /> */}
            <p className="text-sm text-red-500">{errors?.other}</p>
          </>
        )}
      </div>
      <div className="flex items-center place-content-evenly text-center w-9/12 py-10">
        <span className="border-t theme-border flex-1" />
        <span className="px-4 text-sm ">OR</span>
        <span className="border-t theme-border flex-1" />
      </div>
      <div className="flex gap-4 mt-4">
        {/* GOOGLE LOGIN */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            // googleLogin();
            await signIn("google");
          }}
          className=" bg-white shadow rounded-full p-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Google-favicon-vector.png"
            className="h-8 w-8"
          />
        </button>
        {/* Github Login */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            // googleLogin();
            await signIn("github");
          }}
          className="bg-white shadow rounded-full p-2">
          <img
            src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
            className="h-8 w-8"
          />
        </button>
        {/* Twitter Login */}
        <button
          className=" bg-white shadow rounded-full p-2"
          onClick={async (e) => {
            e.preventDefault();
            // googleLogin();
            await signIn("twitter");
          }}>
          <img
            src="https://abs.twimg.com/favicons/twitter.ico"
            className="h-8 w-8"
          />
        </button>
      </div>
      <div className="flex items-center place-content-evenly text-center w-9/12 pt-10">
        <span className="border-t theme-border flex-1" />
        <span className="px-4 text-sm underline cursor-pointer">
          <Link href={"/signup"}>CREATE AN ACCOUNT</Link>
        </span>
        <span className="border-t theme-border flex-1" />
      </div>

      {/* Terms & Conditions and Privacy Policy */}
      <div className="flex flex-col items-center place-content-center text-center w-9/12 pt-10">
        <span className="text-sm">
          By signing in, you agree to our{" "}
          <span className="underline cursor-pointer">
            <Link href="terms">Terms & Conditions</Link>
          </span>{" "}
          and{" "}
          <span className="underline cursor-pointer">
            <Link href="policy">Privacy Policy</Link>
          </span>
        </span>
      </div>
    </form>
  );
}
