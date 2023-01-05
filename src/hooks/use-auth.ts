import React from "react";
import { AuthContext, AuthContextType } from "../provider/auth-provider";

/**
 * Hook to get the user from the context
 */
function useAuth(): AuthContextType {
  return React.useContext(AuthContext);
}

export default useAuth;
