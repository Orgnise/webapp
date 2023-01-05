import React, { useState } from "react";
import cx from "classnames";
import { Link, useLocation, useNavigate } from "react-router-dom";
import loginSvg from "../../assets/secure-login-animate.svg";
import { AppRoutes } from "../../helper/app-routes";
import { useAppService } from "../../hooks/use-app-service";
import useSocket from "../../hooks/use-socket.hook";
import { SocketEvent } from "../../constant/socket-event-constant";
import Validator from "../../helper/validator";
import useAuth from "../../hooks/use-auth";
import Button from "../../components/atom/button";
import Label from "../../components/typography";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState({});

  /// 👇🏻  Use the useSocket hook to get the socket
  const socket = useSocket([], {});
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const { authService } = useAppService();
  const location = useLocation();
  const pathname = location.pathname;

  const auth = useAuth();

  const from =
    Validator.getLeaf(location, "state.from.pathname") || AppRoutes.dashboard;

  // get the redirect url from the query params
  const redirect = new URLSearchParams(useLocation().search).get("redirect");

  // if the user is already logged in, redirect to the dashboard
  React.useEffect(() => {
    if (Validator.hasValue(auth.user)) {
      // if (![AppRoutes.login, AppRoutes.signup, "/"].includes(pathname)) {
      //   navigate(`${AppRoutes.login}?redirect=${pathname}`);
      // }
      // navigate(AppRoutes.workspace.team, { replace: true });
      if (from === "/login") {
        navigate(AppRoutes.workspace.team, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [auth.user]);

  const login = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError({
        ...errors,
        password: "Password should be at least 6 characters long",
      });
      return;
    }
    setError({});
    authService
      .login({ email, password })
      .then(({ user }) => {
        console.log("User authenticate successfully");

        socket.emit(SocketEvent.auth.register, {
          jwtToken: user.jwtToken,
        });
        auth.signIn(user);
        if (from === "/login") {
          navigate(AppRoutes.workspace.team, { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      })
      .catch((err) => {
        const response = err.response;
        if (!response) {
          console.error(
            "🚀 ~ file: login.page.js ~ line 43 ~ login ~ response",
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
    <div className="bg- max-w-screen-xl m-auto h-full">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-2 h-full  items-center place-content-center">
        <img className="hidden md:inline-block" src={loginSvg} />
        <form
          className="flex flex-col items-center place-content-center space-y-6 h-full  rounded-md"
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
            onChange={(e) => {
              setEmail(e.target.value);
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
            }}
            value={password}
            autoComplete="password"
            error={errors.password}
            inputType="password"
          />
          <Button label="Sign in" onClick={() => {}} className=" w-9/12" />
          <div className="flex items-center place-content-evenly text-center w-9/12 pt-10">
            <span className="border-t theme-border flex-1" />
            <span className="px-4 text-sm hover:underline cursor-pointer">
              <Link to={AppRoutes.signup}>CREATE AN ACCOUNT</Link>
            </span>
            <span className="border-t theme-border flex-1" />
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
      <Label> {label}</Label>
      <input
        type={inputType}
        name={name}
        placeholder={`Enter ${label}`}
        className={cx("theme-input  mb-5 ", {
          "border-red-500 ": error,
        })}
        required
        onChange={onChange}
        value={value}
        autoComplete={autoComplete}
      />
      <label
        className={cx("text-red-500 text-xs", {
          "inline-block  scale-100": error !== "" && error !== undefined,
          "h-0": !error,
        })}>
        {error}
      </label>
    </div>
  );
}

export default Login;
