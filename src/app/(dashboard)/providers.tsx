"use client";

import { ReactNode, createContext } from "react";

import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/fetcher";
import useTeams from "@/lib/swr/use-teams";
import { Team } from "@/lib/types/types";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <DashBoardProvider>{children}</DashBoardProvider>
      {/* {children} */}
    </SessionProvider>
  );
}

interface DashBoardProviderProps {
  loading?: boolean;
  error?: any;
  teams?: Team[];
  createTeam: (name: string, description: string) => Promise<void>;
}

export const DashBoardContext2 = createContext(
  null,
) as unknown as React.Context<DashBoardProviderProps>;
DashBoardContext2.displayName = "DashBoardContext2";

function DashBoardProvider({ children }: { children: ReactNode }) {
  const { error, loading, teams, mutate } = useTeams();
  const { toast } = useToast();

  // Create Team
  async function createTeam(name: string, description: string) {
    try {
      const response = await fetcher("/api/teams/create", {
        method: "POST",
        body: JSON.stringify({ name, description }),
      });
      document.getElementById("CreateTeamCloseDialogButton")?.click();
      mutate({ data: [...teams, response.team] }, false);
      toast({
        title: "Team created",
        description: "Team has been created",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? `Error occurred while creating Team`,
        duration: 2000,
        variant: "destructive",
      });
    }
  }

  return (
    <DashBoardContext2.Provider
      value={{
        error,
        loading,
        teams,
        createTeam,
      }}
    >
      {children}
    </DashBoardContext2.Provider>
  );
}
