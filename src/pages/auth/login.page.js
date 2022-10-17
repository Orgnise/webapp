import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginSvg from "../../assets/secure-login-animate.svg";
import { AppRoutes } from "../../helper/app-routes";
import useLocalStorage from "../../hooks/use-local-storage";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const history = useNavigate();
  const [storedValue, setValue] = useLocalStorage("user", null);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          console.log("User login successfully");
          setValue(data.user);
          history(AppRoutes.dashboard);
          console.log("New user created", data);
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
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

export default Login;
