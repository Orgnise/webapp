import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginSvg from "../assets/secure-login-animate.svg";
import { AppRoutes } from "../helper/app-routes";
import useLocalStorage from "../hooks/use-local-storage";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();
  const [storedValue, setValue] = useLocalStorage("user", null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!storedValue || Object.keys(storedValue).length === 0) {
      setValue({ username, password });
      history(AppRoutes.dashboard);
      console.log("New user created");
      window.location.reload();
    }
    //👇🏻 saves the user object in localStorage
    // setValue({ username: username, password: password });
    else if (
      storedValue.username === username &&
      storedValue.password === password
    ) {
      history(AppRoutes.dashboard);
      console.log("User logged in");
      window.location.reload();
    } else {
      alert("Invalid Credentials");
    }
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
          <div className="flex flex-col space-y-2 w-9/12">
            <label className="text-md  text-slate-500">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="border border-slate-400 rounded-md p-2 mb-5 placeholder:text-slate-300 placeholder:text-sm"
              required
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              autoComplete="username"
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
          </div>
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
        </form>
      </div>
    </div>
  );
};

export default Login;
