import React, { createContext } from "react";
import AppService from "../service/app-service";
const AppServiceContext = createContext(null);

AppServiceContext.displayName = "AppServiceContext";

export { AppServiceContext };

export default ({ children }) => {
  const appService = new AppService();

  return (
    <AppServiceContext.Provider value={appService}>
      {children}
    </AppServiceContext.Provider>
  );
};

export const withAppService = (Component) => (props) =>
  (
    <AppServiceContext.Consumer>
      {(appService) => <Component appService={appService} {...props} />}
    </AppServiceContext.Consumer>
  );
