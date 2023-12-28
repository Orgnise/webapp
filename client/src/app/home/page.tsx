"use client";
import { useSession, signOut } from "next-auth/react";
import Login from "../(auth)/login/page";
import { NavbarLayout } from "@/components/layout/nav-layout";
import Nav from "@/components/layout/nav";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return <Login />;
  }
  return (
    <div className="">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
    </div>
  );
}
