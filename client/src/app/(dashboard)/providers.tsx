"use client";

import { ReactNode, createContext } from "react";

import { SessionProvider } from "next-auth/react";
import { Team } from "@/lib/types/types";
import useTeams from "@/lib/swr/use-teams";

export default function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>
    <DashBoardProvider>
      {children}
    </DashBoardProvider>
  </SessionProvider>;
}


interface DashBoardProviderProps {
  loading?: boolean;
  error?: any;
  teams?: Team[];
}

export const DashBoardContext = createContext(null) as unknown as React.Context<DashBoardProviderProps>;
DashBoardContext.displayName = "DashBoardContext";

function DashBoardProvider({ children }: { children: ReactNode }) {

  const { error, loading, teams } = useTeams();


  return <DashBoardContext.Provider value={{
    error,
    loading,
    teams
  }}>
    {children}
  </DashBoardContext.Provider>;
}