"use client";
import { LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import type { UrlObject } from "url";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const menuItems = [{ name: "", href: "" }];

const artistMenus = [
  { name: "Dashboard", href: "#link" },
  { name: "Explore Gigs", href: "#link" },
  { name: "Chatbot", href: "#link" },
];

const agentMenus = [
  { name: "Dashboard", href: "#link" },
  { name: "Explore Artists", href: "#link" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuItems, setMenuItems] = useState<{ name: string; href: string }[]>(
    [],
  );

  const { data: session, isPending } = authClient.useSession();

  const logout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (isPending) return;

    const role = session?.user?.name;

    if (role === "artist") setMenuItems(artistMenus);
    else if (role === "agent") setMenuItems(agentMenus);
    else setMenuItems([]);
  }, [session, isPending]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header>
      <nav
        className="fixed z-20 w-full px-2 transition-colors duration-500 ease-in-out"
        data-state={menuState && "active"}
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
            "max-w-4xl rounded-2xl border bg-background/60 shadow-md backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                aria-label="home"
                className="flex items-center space-x-2 font-bold text-lg tracking-wide"
                href="/"
              >
                RantaiSkena
              </Link>

              <button
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="-m-2.5 -mr-4 relative z-20 block cursor-pointer p-2.5 lg:hidden"
                onClick={() => setMenuState(!menuState)}
              >
                <Menu className="m-auto size-6 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 duration-200" />
                <X className="-rotate-180 absolute inset-0 m-auto size-6 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 scale-0 in-data-[state=active]:opacity-100 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-10 font-medium text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      className="block text-muted-foreground underline-offset-4 duration-150 hover:text-accent-foreground hover:underline"
                      href={item.href as unknown as UrlObject}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 in-data-[state=active]:block hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:in-data-[state=active]:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        className="block text-muted-foreground underline-offset-4 duration-150 hover:text-accent-foreground hover:underline"
                        href={item.href as unknown as UrlObject}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {session?.user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="text-red-600 hover:text-red-700 focus:text-red-700"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login">
                    <span className="px-3 py-1 font-bold tracking-wider">
                      Login
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
