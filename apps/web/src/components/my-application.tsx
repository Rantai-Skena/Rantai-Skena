"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Application {
  id: number;
  title: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  agency: string;
  date: string;
}

const dummyApplications: Application[] = [
  {
    id: 1,
    title: "Festival Jakarta Musik",
    status: "Approved",
    agency: "Promotor XYZ",
    date: "20 Des 2025",
  },
  {
    id: 2,
    title: "Konser Kampus ITB",
    status: "Pending",
    agency: "Penyelenggara Kampus",
    date: "15 Jan 2026",
  },
  {
    id: 3,
    title: "Acara Seni Lokal",
    status: "Rejected",
    agency: "Komunitas Seni",
    date: "05 Feb 2026",
  },
  {
    id: 4,
    title: "Panggung Hiburan Akhir Pekan",
    status: "Approved",
    agency: "Dinas Pariwisata",
    date: "10 Mar 2026",
  },
  {
    id: 5,
    title: "Lomba Band Nasional",
    status: "Pending",
    agency: "Asosiasi Musik",
    date: "22 Apr 2026",
  },
  {
    id: 6,
    title: "Charity Show",
    status: "Completed",
    agency: "Yayasan Kasih",
    date: "01 Mei 2026",
  },
];

export default function MyApplication() {
  const [activeTab, setActiveTab] = useState<
    "all" | "accepted" | "pending" | "rejected" | "completed"
  >("all");

  const tabs = [
    { id: "all", label: "All" },
    { id: "accepted", label: "Acepted" },
    { id: "pending", label: "Pending" },
    { id: "rejected", label: "Rejected" },
    { id: "completed", label: "Completed" },
  ];

  const filteredApplications = dummyApplications.filter((app) => {
    if (activeTab === "all") return true;

    const statusMapping = {
      accepted: "approved",
      pending: "pending",
      rejected: "rejected",
      completed: "completed"
    };

    const targetStatus = statusMapping[activeTab as keyof typeof statusMapping];

    return app.status.toLowerCase() === targetStatus;
  });

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "Approved":
        return "text-green-500 border-green-500 bg-green-500/10";
      case "Pending":
        return "text-yellow-500 border-yellow-500 bg-yellow-500/10";
      case "Rejected":
        return "text-red-500 border-red-500 bg-red-500/10";
      default:
        return "text-gray-500 border-gray-500";
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col rounded-2xl bg-neutral-900 p-8">
      <h2 className="mb-6 font-bold text-h4 text-white">My Application</h2>

      <div className="custom-scrollbar mb-6 flex w-full justify-center space-x-2 overflow-x-auto border-gray-700 border-b pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "px-4 py-0 font-medium text-sm transition-colors duration-200",
              activeTab === tab.id
                ? "bg-gradient-artist text-white shadow-md"
                : "bg-transparent text-gray-300 hover:bg-neutral-800",
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="grow">
        {filteredApplications.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredApplications.map((app) => (
              <Card
                key={app.id}
                className="gap-2 border border-neutral-700 bg-neutral-800 p-5 shadow-xl transition-all hover:border-autumn-500"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-semibold text-white text-xl">
                    {app.title}
                  </h3>
                  <div
                    className={cn(
                      "rounded-full border px-3 py-1 font-medium text-xs",
                      getStatusColor(app.status),
                    )}
                  >
                    {app.status}
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="mb-1 text-gray-400">{app.agency}</p>
                  <p className="text-gray-400">{app.date}</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    className="text-autumn-500 text-sm hover:bg-autumn-500/20"
                  >
                    Lihat Detail
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-neutral-800 p-10 text-center text-gray-400">
            <p>Tidak ada aplikasi dengan status {activeTab.toUpperCase()}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
