import React from "react";
import Validator from "../helper/validator";
import useLocalStorage from "../hooks/use-local-storage";

export interface AuthContextType {
  user: any;
  signIn: (user: any) => void;
  signOut: (callback: VoidFunction) => void;
}

export let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);

  const storage = useLocalStorage("user");

  React.useEffect(() => {
    if (Validator.hasValue(storage.value)) {
      setUser(storage.value);
    }
  }, [storage.value]);

  let signIn = (newUser: any) => {
    setUser(newUser);
    storage.setValue(newUser);
  };

  let signOut = () => {
    setUser(null);
    storage.removeValue();
  };

  let value = { user, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
