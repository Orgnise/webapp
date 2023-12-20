import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helper/app-routes";
import useLocalStorage from "../../hooks/use-local-storage";
import { useAppService } from "../../hooks/use-app-service";
import useAuth from "../../hooks/use-auth";
import useSocket from "../../hooks/use-socket.hook";
import { SocketEvent } from "../../constant/socket-event-constant";
import Button from "../../components/atom/button";
import Label from "../../components/typography";
import { TextField } from "../../components/molecule/text-field";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setError] = useState({});
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const navigate = useNavigate();
  const auth = useAuth();
  const { authService } = useAppService();

  const socket = useSocket([]);

  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  const handleLogin = (e) => {
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
        confirmPassword: "Password and confirm password should be same",
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
      setError({});
      authService
        .register({
          name,
          email,
          password,
          confirmPassword: cPassword,
        })
        .then(({ user }) => {
          console.log("User registered successfully");

          socket.emit(SocketEvent.auth.register, {
            jwtToken: user.jwtToken,
          });
          console.log("New user created", user);
          auth.signIn(user);
          navigate(AppRoutes.workspace.team, { replace: true });
        })
        .catch(({ response }) => {
          const { status, errorCode, message, error } = response.data;
          if (status === 422 && Array.isArray(error)) {
            const errors = {};
            error.forEach((err) => {
              errors[Object.keys(err)[0]] = Object.values(err)[0];
            });
            setError(errors);
            if (errors.confirmPassword) {
              setError({
                ...errors,
                confirmPassword: "Password and confirm password should be same",
              });
            }
            console.log(
              "🚀 ~ file: signup.page.js ~ line 89 ~ handleLogin ~ errors",
              errors
            );
          } else {
            alert(Array.isArray(error) ? error[0] : message);
          }
        });
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setError({
          ...errors,
          name:
            value.length < 5
              ? "Full Name must be at least 5 characters long!"
              : undefined,
        });
        break;
      case "email":
        setError({
          ...errors,
          email:
            !value || validEmailRegex.test(value)
              ? undefined
              : "Email is not valid!",
        });
        break;
      case "password":
        setError({
          ...errors,
          password:
            value.length < 6
              ? "Password must be at least 6 characters long!"
              : undefined,
        });
        break;

        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-screen-xl m-auto h-full">
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
            wrapperClassName="w-9/12"
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            onChange={(e) => {
              setCPassword(e.target.value);
              handleChange(e);
            }}
            value={cPassword}
            autoComplete="confirm-password"
            error={errors.confirmPassword}
            type="password"
            wrapperClassName="w-9/12"
          />
          <Button label="Sign up" onClick={() => {}} className=" w-9/12" />
          <div className="flex items-center place-content-evenly text-center w-9/12 pt-10">
            <span className="border-t theme-border flex-1" />
            <span className="px-4 text-sm hover:underline cursor-pointer">
              <Link to={AppRoutes.login}>DO YOU HAVE AN ACCOUNT?</Link>
            </span>
            <span className="border-t theme-border flex-1" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
