import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import LogoutButton from "./logout-button";

const Navbar = async () => {
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
          <Link href="/">
            <Button>Home</Button>
          </Link>
          <Link href="/visitors">
            <Button variant="secondary">Visitors</Button>
          </Link>
          <LogoutButton/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
