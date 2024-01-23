"use client";
import { useSession } from "next-auth/react";
import Login from "../(auth)/login/page";
import { NavbarLayout } from "@/components/layout/nav-layout";
import Nav from "@/components/layout/nav";
import Teams from "./teams/page";
import Loading from "./loading";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }
  if (!session) return <Login />;
  return (
    <div className="">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <Teams />
    </div>
  );
}
