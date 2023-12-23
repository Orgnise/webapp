"use client";
import React, { useState } from "react";
import Link from "next/link";
import Label from "@/components/atom/label";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/molecule/text-field";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setError] = useState({
    email: "",
    password: "",
    cPassword: "",
    name: "",
  });
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (!email || !password || !cPassword || !name) {
      setError({
        ...errors,
        email: "Email is required",
        password: "Password is required",
        cPassword: "Confirm Password is required",
        name: "Name is required",
      });
      return;
    } else if (password !== cPassword) {
      setError({
        ...errors,
        cPassword: "Password and confirm password should be same",
      });
      return;
    }
    if (errors.email || errors.password || errors.name) {
      if (errors.email) {
        alert(errors.email);
      } else if (errors.password) {
        alert(errors.password);
      } else if (errors.name) {
        alert(errors.name);
      }
    } else {
      setError({
        email: "",
        password: "",
        cPassword: "",
        name: "",
      });
    }
  };

  const handleChange = (event: any) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setError({
          ...errors,
          name:
            value.length < 5
              ? "Full Name must be at least 5 characters long!"
              : "",
        });
        break;
      case "email":
        setError({
          ...errors,
          email:
            !value || validEmailRegex.test(value) ? "" : "Email is not valid!",
        });
        break;
      case "password":
        setError({
          ...errors,
          password:
            value.length < 6
              ? "Password must be at least 6 characters long!"
              : "",
        });
        break;

        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-screen-xl m-auto h-screen">
      <div className="max-w-xl mx-auto grid md:grid-cols-1 grid-cols-1 gap-2 h-full  items-center place-content-center">
        <form
          className="flex flex-col items-center place-content-center h-full  rounded-md py-10"
          onSubmit={handleLogin}>
          <div className="flex flex-col items-center font-normal">
            <h3 className="text-3xl font-bold ">Welcome back</h3>
            <Label>
              We are <strong className="theme-text-primary">happy</strong> to
              have you
            </Label>
          </div>

          <TextField
            label="Fullname"
            name="name"
            onChange={(e) => {
              setName(e.target.value);
              handleChange(e);
            }}
            value={name}
            autoComplete="name"
            error={errors.name}
            type="text"
            wrapperClassName="w-9/12"
          />
          <TextField
            label="Email"
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
              handleChange(e);
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
            onChange={(e) => {
              setPassword(e.target.value);
              handleChange(e);
            }}
            value={password}
            autoComplete="password"
            error={errors.password}
            type="password"
            props={{
              minLength: 6,
            }}
            wrapperClassName="w-9/12"
          />

          <TextField
            label="Confirm Password"
            name="cPassword"
            onChange={(e) => {
              setCPassword(e.target.value);
              handleChange(e);
            }}
            value={cPassword}
            autoComplete="confirm-password"
            error={errors.cPassword}
            type="password"
            props={{
              minLength: 6,
            }}
            wrapperClassName="w-9/12"
          />
          <Button onClick={() => {}} className=" w-9/12">
            Sign up
          </Button>
          <div className="flex items-center place-content-evenly text-center w-9/12 pt-10">
            <span className="border-t theme-border flex-1" />
            <span className="px-4 text-sm hover:underline cursor-pointer">
              <Link href="login">DO YOU HAVE AN ACCOUNT?</Link>
            </span>
            <span className="border-t theme-border flex-1" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
