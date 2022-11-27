import React, { useState } from "react";
import cx from "classnames";
import { Link, useNavigate } from "react-router-dom";
import loginSvg from "../../assets/secure-login-animate.svg";
import { AppRoutes } from "../../helper/app-routes";
import { useAppService } from "../../hooks/use-app-service";
import useLocalStorage from "../../hooks/use-local-storage";
import useSocket from "../../hooks/use-socket.hook";
import { SocketEvent } from "../../constant/socket-event-constant";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState({});
  const history = useNavigate();
  const [storedValue, setValue] = useLocalStorage("user", null);

  /// 👇🏻  Use the useSocket hook to get the socket
  const socket = useSocket([], {});

  const { authService } = useAppService();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError({
        ...errors,
        password: "Password should be atleast 6 characters long",
      });
      return;
    }
    setError({});
    authService
      .login({ email, password })
      .then(({ user }) => {
        console.log("User authenticate successfully");
        setValue(user);
        socket.emit(SocketEvent.auth.register, {
          jwtToken: user.jwtToken,
        });
        history(AppRoutes.dashboard);
        window.location.reload();
      })
      .catch((err) => {
        const response = err.response;
        if (!response) {
          console.error(
            "🚀 ~ file: login.page.js ~ line 43 ~ handleLogin ~ response",
            response
          );

          return;
        }
        const { status, errorCode, message, error } = response.data;
        if (status === 422 && Array.isArray(error)) {
          const errors = {};
          error.forEach((err) => {
            errors[Object.keys(err)[0]] = Object.values(err)[0];
          });
          setError(errors);
        } else {
          alert(Array.isArray(error) ? error[0] : message);
        }
      });
  };

  return (
    <div className="max-w-screen-xl m-auto h-full">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-2 h-full place-content-center">
        <img className="hidden md:inline-block" src={loginSvg} />

        <form
          className="flex flex-col items-center place-content-center space-y-6 h-full bg-slate-50 rounded-md"
          onSubmit={handleLogin}
        >
          <div className="flex flex-col items-center font-normal">
            <h3 className="text-3xl font-bold ">Welcome back</h3>
            <p className="text-xl  mb-12">
              We are <span className="text-teal-500">happy</span> to see you
              back
            </p>
          </div>
          {/* <div className="flex flex-col space-y-2 w-9/12">
            <label className="text-md  text-slate-500">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter email"
              className="border border-slate-400 rounded-md p-2 mb-5 placeholder:text-slate-300 placeholder:text-sm"
              required
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              autoComplete="current-password"
            />
          </div> */}
          <TextField
            label="Email"
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
              // handleChange(e);
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
              // handleChange(e);
            }}
            value={password}
            autoComplete="password"
            error={errors.password}
            inputType="password"
          />
          <div className="flex items-center w-9/12 text-slate-500">
            <input
              className="h-5 w-5 rounded mr-3"
              type="checkbox"
              onChange={(e) => {}}
              value={true}
              enterKeyHint="done"
            />
            Remember me
          </div>
          <button className="bg-teal-400 px-6 py-2 rounded text-white w-9/12 font-normal mt-8">
            Sign In
          </button>
          <div className="flex items-center place-content-evenly text-center w-9/12 pt-10">
            <span className="border-t flex-1" />
            <span className="text-slate-500 px-4 text-sm hover:underline cursor-pointer">
              <Link to={AppRoutes.signup}>CREATE AN ACCOUNT</Link>
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

export default Login;
