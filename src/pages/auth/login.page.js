import React, { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helper/app-routes";
import { useAppService } from "../../hooks/use-app-service";
import useSocket from "../../hooks/use-socket.hook";
import { SocketEvent } from "../../constant/socket-event-constant";
import Validator from "../../helper/validator";
import useAuth from "../../hooks/use-auth";
import Button from "../../components/atom/button";
import Label from "../../components/typography";
import { TextField } from "../../components/molecule/text-field";
import { toast } from "react-hot-toast";

const LoginComponent = () => {
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
    authService.login({ email, password }).then(({ user }) => {
      console.log("User authenticate successfully");

      socket.emit(SocketEvent.auth.register, {
        jwtToken: user.jwtToken,
      });
      auth.signIn(user);
      if (from === "/login") {
        navigate(AppRoutes.workspace.team, { replace: true });
      } else {
        alert(Array.isArray(errors) ? errors[0] : message);
      }
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token, expire_in } = tokenResponse;
      loginWithGoogle(access_token);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  const loginWithGoogle = (accessToken) => {
    if (!accessToken) {
      setError({
        ...errors,
        googleAuth: "Something went wrong. Please try again later",
      });
      return;
    }
    setError({});
    authService
      .loginWithGoogle(accessToken)
      .then(({ user }) => {
        console.log("User registered successfully");

        socket.emit(SocketEvent.auth.register, {
          jwtToken: user.jwtToken,
        });

        auth.signIn(user);
        navigate(AppRoutes.workspace.team, { replace: true });
      })
      .catch((err) => {
        const { status, error } = err;
        if (status === 400) {
          setError({
            ...errors,
            googleAuth: "Something went wrong. Please try again later",
          });
          return;
        } else {
          setError({
            ...errors,
            googleAuth: error,
          });
        }
        toast.error("Something went wrong. Please try again later", {
          position: "top-right",
        });
      });
  };

  return (
    <div className="bg- max-w-screen-xl m-auto h-full">
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
            onChange={(e) => {
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
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            autoComplete="password"
            error={errors.password}
            type="password"
            wrapperClassName="w-9/12"
          />
          <Button label="Sign in" onClick={() => {}} className=" w-9/12" />
          {/* GOOGLE LOGIN */}
          <div className="mt-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                googleLogin();
              }}
              className="px-4 theme-input  my-6 bg-white shadow">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Google-favicon-vector.png"
                className="h-6 w-6"
              />
              <span className="ml-2">Sign in with Google</span>
            </button>
          </div>
          <div className="flex items-center place-content-evenly text-center w-9/12 pt-10">
            <span className="border-t theme-border flex-1" />
            <span className="px-4 text-sm underline cursor-pointer">
              <Link to={AppRoutes.signup}>CREATE AN ACCOUNT</Link>
            </span>
            <span className="border-t theme-border flex-1" />
          </div>

          {/* Terms & Conditions and Privacy Policy */}
          <div className="flex flex-col items-center place-content-center text-center w-9/12 pt-10">
            <span className="text-sm">
              By signing in, you agree to our{" "}
              <span className="underline cursor-pointer">
                <Link to={AppRoutes.terms}>Terms & Conditions</Link>
              </span>{" "}
              and{" "}
              <span className="underline cursor-pointer">
                <Link to={AppRoutes.privacy}>Privacy Policy</Link>
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
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <LoginComponent />
    </GoogleOAuthProvider>
  );
}

export default Login;
