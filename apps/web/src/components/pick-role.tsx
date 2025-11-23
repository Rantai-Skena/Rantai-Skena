"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";

export default function PickRole() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<"artist" | "agent" | null>(
    null,
  );
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

  const handleRoleSelect = async (role: "artist" | "agent") => {
    if (loadingRole) return;

    setLoadingRole(role);

    try {
      const res = await fetch(`${baseUrl}/api/auth/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}));
        throw new Error(
          (errorPayload as { error?: string }).error ?? "Failed to update role",
        );
      }

      router.push(
        role === "artist" ? "/onboarding/artist" : "/onboarding/agent",
      );
    } catch (error) {
      console.error(error);
      toast.error("Unable to update your role. Please try again.");
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <Link href="/" className="contents">
        <ArrowLeftIcon size={28} />
      </Link>
      <div className="flex flex-col gap-10 px-10 lg:px-20">
        <div className="flex flex-col items-center justify-between lg:items-start">
          <h1 className="text-center text-h4 md:text-h3 lg:text-left lg:text-h1">
            Welcome to <span className="text-autumn-500">RantaiSkena</span>
          </h1>
          <h2 className="text-center text-h5 lg:text-left lg:text-h4">
            Start by choose your role
          </h2>
        </div>
        <div className="grid grid-rows-2 gap-10 md:grid-cols-2 md:grid-rows-none">
          <Card className="h-full transform px-10 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(31,154,255,0.35)]">
            <div className="flex flex-col items-center justify-center gap-6">
              <img src="guitar.png" alt="artist-icon" className="h-24" />
              <h2 className="bg-gradient-artist bg-clip-text text-h5 text-transparent lg:text-h3">
                Artist
              </h2>
              <div className="h-px w-full bg-gradient-artist" />
              <p className="text-center text-caption lg:text-bodyLarge">
                Showcase your portofolio and connect with the right agents.
              </p>
              <Button
                variant="destructive"
                disabled={loadingRole !== null}
                onClick={() => void handleRoleSelect("artist")}
              >
                {loadingRole === "artist"
                  ? "Setting role..."
                  : "Continue as Artist"}
              </Button>
            </div>
          </Card>
          <Card className="h-full transform px-10 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,78,134,0.35)]">
            <div className="flex flex-col items-center justify-center gap-6">
              <img src="agent.png" alt="agent-icon" className="h-24" />
              <h2 className="bg-gradient-agent bg-clip-text text-h5 text-transparent lg:text-h3">
                Agent
              </h2>
              <div className="h-px w-full bg-gradient-agent" />
              <p className="text-center text-caption lg:text-bodyLarge">
                Discovering emerging artist, manage bookings, and find your next
                big act.
              </p>
              <Button
                variant="destructive"
                disabled={loadingRole !== null}
                onClick={() => void handleRoleSelect("agent")}
              >
                {loadingRole === "agent"
                  ? "Setting role..."
                  : "Continue as Agent"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
