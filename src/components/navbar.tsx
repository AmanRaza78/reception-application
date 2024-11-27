import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();
  return (
    <nav
      className="border-b bg-background h-[10vh] flex items-center"
      aria-label="Global"
    >
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-3xl text-primary">Jobox Reception</h1>
        </Link>

        <div className="flex items-center gap-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/visitors/createvisitors">
                <Button>Create Visitor</Button>
              </Link>
              <Link href="/visitors">
                <Button variant="secondary">Visitors</Button>
              </Link>
              <LogoutLink>
                <Button variant="destructive">Logout</Button>
              </LogoutLink>
            </>
          ) : (
            <LoginLink>
              <Button>Login</Button>
            </LoginLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
