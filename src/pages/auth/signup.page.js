import React, { useState } from "react";
import cx from "classnames";
import { Link, useNavigate } from "react-router-dom";
import loginSvg from "../../assets/secure-login-animate.svg";
import { AppRoutes } from "../../helper/app-routes";
import useLocalStorage from "../../hooks/use-local-storage";

const Signup = () => {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [errors, setError] = useState({});
  const [password, setPassword] = useState();
  const [cPassword, setCPassword] = useState();
  const history = useNavigate();

  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password || !cPassword || !name) {
      alert("Please enter email and password");
      return;
    } else if (password !== cPassword) {
      alert("Password and confirm password should be same");
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
      fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert("User created successfully");
            history(AppRoutes.login);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    switch (name) {
      case "fullName":
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
            value.length < 8
              ? "Password must be at least 8 characters long!"
              : undefined,
        });

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
          <div className="flex flex-col space-y-2 w-9/12">
            <label className="text-md  text-slate-500">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter fullname"
              className="border border-slate-400 rounded-md p-2 mb-5 placeholder:text-slate-300 placeholder:text-sm"
              required
              onChange={(e) => {
                setName(e.target.value);
                /// Debounce function
                setTimeout(() => {
                  handleChange(e);
                }, 1000);
              }}
              value={name}
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col space-y-2 w-9/12">
            <label className="text-md  text-slate-500">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter email"
              className={cx(
                "border border-slate-400 rounded-md p-2 mb-5 placeholder:text-slate-300 placeholder:text-sm",
                {
                  "border-red-500 ": errors.email,
                }
              )}
              required
              onChange={(e) => {
                setEmail(e.target.value);
                /// Debounce function
                setTimeout(() => {
                  handleChange(e);
                }, 1000);
              }}
              value={email}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col space-y-2 w-9/12">
            <label className="text-md text-slate-500 "> Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border border-slate-400 rounded-md p-2 mb-5 placeholder:text-slate-300 placeholder:text-sm"
              required
              onChange={(e) => {
                setPassword(e.target.value);
                /// Debounce function
                setTimeout(() => {
                  handleChange(e);
                }, 1000);
              }}
              value={password}
              autoComplete="current-password"
            />
          </div>
          <div className="flex flex-col space-y-2 w-9/12">
            <label className="text-md text-slate-500 ">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter confirm password"
              className="border border-slate-400 rounded-md p-2 mb-5 placeholder:text-slate-300 placeholder:text-sm"
              required
              onChange={(e) => {
                setCPassword(e.target.value);
                /// Debounce function
                setTimeout(() => {
                  handleChange(e);
                }, 1000);
              }}
              value={cPassword}
              autoComplete="confirm-password"
            />
          </div>
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

export default Signup;
