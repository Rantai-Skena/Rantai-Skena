"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiGet } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type ApplicationStatus = "pending" | "approved" | "rejected" | "completed";

type ApplicationApi = {
  id: string;
  status: ApplicationStatus;
  message: string | null;
  createdAt: string;
  eventId: string;
  eventName: string;
  eventLocation: string | null;
  eventStartsAt: string | null;
  agentId: string;
};

const TABS = [
  { id: "all" as const, label: "All" },
  { id: "pending" as const, label: "Pending" },

  { id: "approved" as const, label: "Accepted" },
  { id: "rejected" as const, label: "Rejected" },
  { id: "completed" as const, label: "Completed" },
];

type TabId = (typeof TABS)[number]["id"];

function formatStatusLabel(status: ApplicationStatus) {
  if (status === "approved") return "Accepted";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusBadgeClass(status: ApplicationStatus) {
  switch (status) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/40";
    case "approved":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40";
    case "rejected":
      return "bg-red-500/10 text-red-400 border border-red-500/40";
    case "completed":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/40";
    default:
      return "bg-muted text-foreground";
  }
}

export default function MyApplication() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [apps, setApps] = useState<ApplicationApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet<ApplicationApi[]>("/applications/my");
        if (!cancelled) {
          setApps(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load applications",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === "all") return apps;
    return apps.filter((a) => a.status === activeTab);
  }, [apps, activeTab]);

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-h4">My Applications</h2>
          <p className="text-bodyLarge text-muted-foreground">
            Track the status of your event applications in real time.
          </p>
        </div>
      </header>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full",
              activeTab === tab.id && "bg-gradient-artist text-white shadow-md",
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <Card className="flex-1 bg-card/60 p-4">
        {loading && (
          <p className="text-muted-foreground text-sm">
            Loading your applications...
          </p>
        )}

        {error && !loading && (
          <p className="text-red-400 text-sm">Error: {error}</p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-muted-foreground text-sm">
            You don&apos;t have any applications yet.
          </p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <ul className="mt-2 space-y-3">
            {filtered.map((app) => {
              const date =
                app.eventStartsAt ?? app.createdAt ?? new Date().toISOString();

              return (
                <li
                  key={app.id}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-card/40 p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-base">{app.eventName}</h3>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 font-medium text-xs",
                          statusBadgeClass(app.status),
                        )}
                      >
                        {formatStatusLabel(app.status)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {app.eventLocation ?? "Location TBA"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(date).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    {app.message && (
                      <p className="text-muted-foreground text-xs">
                        Your message: {app.message}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
