"use client";
import React, { useState } from "react";
import Link from "next/link";
import Label from "@/components/atom/label";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/molecule/text-field";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState({
    email: "",
    password: "",
  });

  /// 👇🏻  Use the useSocket hook to get the socket

  // const location = useLocation();
  // const pathname = location.pathname;

  // get the redirect url from the query params
  // const redirect = new URLSearchParams(useLocation().search).get("redirect");

  const login = (e: any) => {
    e.preventDefault();
    if (password.length < 6) {
      setError({
        ...errors,
        password: "Password should be at least 6 characters long",
      });
      return;
    }
    setError({
      email: "",
      password: "",
    });
  };

  return (
    <div className="bg- max-w-screen-xl m-auto h-screen">
      <div className="max-w-xl mx-auto grid md:grid-cols-1 grid-cols-1 gap-2 h-full  items-center place-content-center">
        <form
          className="flex flex-col items-center place-content-center  h-full  rounded-md"
          onSubmit={login}>
          <div className="flex flex-col items-center font-normal">
            <Label size="h1" variant="t2">
              Welcome back
            </Label>
            <Label className="mb-12">
              We are <strong className="theme-text-primary">happy</strong> to
              see you back
            </Label>
          </div>
          <TextField
            label="Email"
            name="email"
            required={true}
            onChange={(e: any) => {
              setEmail(e.target.value);
            }}
            value={email}
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
            onChange={(e: any) => {
              setPassword(e.target.value);
            }}
            value={password}
            autoComplete="password"
            error={errors.password}
            type="password"
            wrapperClassName="w-9/12"
          />
          <Button onClick={login} className=" w-9/12" type="submit">
            Sign in
          </Button>
          {/* GOOGLE LOGIN */}
          <div className="mt-4">
            <Button
              variant={"secondary"}
              onClick={(e) => {
                e.preventDefault();
                // googleLogin();
              }}
              className="px-4 theme-input  my-6 bg-white shadow">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Google-favicon-vector.png"
                className="h-6 w-6"
              />
              <span className="ml-2 text-foreground">Sign in with Google</span>
            </Button>
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
      </div>
    </div>
  );
};

function Login() {
  return (
    // <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <LoginComponent />
    // </GoogleOAuthProvider>
  );
}

export default Login;
