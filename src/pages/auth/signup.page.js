import React, { useState } from "react";
import cx from "classnames";
import { Link, useNavigate } from "react-router-dom";
import loginSvg from "../../assets/secure-login-animate.svg";
import { AppRoutes } from "../../helper/app-routes";
import useLocalStorage from "../../hooks/use-local-storage";
import { useAppService } from "../../hooks/use-app-service";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setError] = useState({});
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const history = useNavigate();
  const { authService } = useAppService();
  const [_, setValue] = useLocalStorage("user", null);

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
      return;
    } else {
      setError({});
      authService
        .register({
          name: name,
          email: email,
          password: password,
          confirmPassword: cPassword,
        })
        .then(({ user }) => {
          console.log("User registered successfully");
          setValue(user);
          history(AppRoutes.dashboard);
          console.log("New user created", user);
          window.location.reload();
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
      <div className="grid md:grid-cols-2 grid-cols-1 gap-2 h-full place-content-center">
        <img className="hidden md:inline-block" src={loginSvg} />

        <form
          className="flex flex-col items-center place-content-center space-y-6 h-full bg-slate-50 rounded-md py-10"
          onSubmit={handleLogin}
        >
          <div className="flex flex-col items-center font-normal">
            <h3 className="text-3xl font-bold ">Welcome back</h3>
            <p className="text-xl  mb-12">
              We are <span className="text-teal-500">happy</span> to have you
            </p>
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
            inputType="text"
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
            inputType="email"
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
            inputType="password"
          />
          <TextField
            label="Confirm Password"
            name="cpassword"
            onChange={(e) => {
              setCPassword(e.target.value);
              handleChange(e);
            }}
            value={cPassword}
            autoComplete="confirm-password"
            error={errors.confirmPassword}
            inputType="password"
          />
          <button className="bg-teal-400 px-6 py-2 rounded text-white w-9/12 font-normal mt-8">
            Sign up
          </button>
          <div className="flex items-center place-content-evenly text-center w-9/12 pt-10">
            <span className="border-t flex-1" />
            <span className="text-slate-500 px-4 text-sm hover:underline cursor-pointer">
              <Link to={AppRoutes.login}>DO YOU HAVE AN ACCOUNT?</Link>
            </span>
            <span className="border-t flex-1" />
          </div>
        </form>
      </div>
    </div>
  );
};

function TextField({
  label,
  inputType = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
}) {
  return (
    <div className="flex flex-col space-y-2 w-9/12">
      <label className="text-md text-slate-500 "> {label}</label>
      <input
        type={inputType}
        name={name}
        placeholder={`Enter ${label}`}
        className={cx(
          "border border-slate-400 rounded-md p-2 mb-5 placeholder:text-slate-300 placeholder:text-sm  placeholder:first-letter:uppercase",
          {
            "border-red-500 ": error,
          }
        )}
        required
        onChange={onChange}
        value={value}
        autoComplete={autoComplete}
      />
      <label
        className={cx("text-red-500 text-xs", {
          "inline-block  scale-100": error !== "" && error !== undefined,
          "h-0": !error,
        })}
      >
        {error}
      </label>
    </div>
  );
}

export default Signup;
