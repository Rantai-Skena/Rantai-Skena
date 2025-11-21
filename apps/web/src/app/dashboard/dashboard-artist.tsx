"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { authClient } from "@/lib/auth-client";
import { HeroHeader } from "../../components/header";
import MyApplication from "../../components/my-application";
import MyMusic from "../../components/my-music";
import Schedule from "../../components/schedule";

export default function DashboardArtist({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const privateData = session.user;
  const [activeTab, setActiveTab] = useState("My Music");

  const tabs = [
    { id: "My Music", label: "My Music" },
    { id: "Performance Schedule", label: "Performance Schedule" },
    { id: "My Applications", label: "My Applications" },
  ];
  return (
    <>
      <HeroHeader />
      <div className="flex min-h-screen w-full bg-background pt-20">
        <aside className="flex w-fit flex-col items-center gap-4 bg-card p-6 shadow-xl">
          <div className="flex flex-col items-center gap-2 px-4">
            <div className="h-40 w-40 overflow-hidden rounded-full bg-gradient-artist" />
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-h4">{privateData.name}</h1>
              <h5 className="text-bodyLarge">{privateData.email}</h5>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "artistOutline" : "ghost"}
              >
                <span
                  className={`font-medium text-base ${activeTab !== tab.id ? "text-white" : "bg-gradient-artist bg-clip-text text-transparent"}`}
                >
                  {tab.label}
                </span>
              </Button>
            ))}
          </nav>
        </aside>

        <main className="flex min-h-screen grow overflow-y-auto bg-card p-6">
          {activeTab === "My Music" && <MyMusic />}
          {activeTab === "Performance Schedule" && <Schedule />}
          {activeTab === "My Applications" && <MyApplication />}
        </main>
      </div>
    </>
  );
}
