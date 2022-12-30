import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import SocketProvider from "./provider/socket.provider";
import AppServiceContext from "./provider/app-service.provider";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./provider/auth-provider";
import AppServiceProvider from "./provider/app-service.provider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <SocketProvider>
    <AppServiceProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </AppServiceProvider>
  </SocketProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
