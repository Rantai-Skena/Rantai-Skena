"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import DashboardAgent from "./dashboard-agent";
import DashboardArtist from "./dashboard-artist";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserRole = async (): Promise<string | null> => {
    try {
      const data = await apiGet<{ role: string }>("/auth/role");
      return data.role;
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      return null;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <s>
  useEffect(() => {
    if (!(isPending || session?.user)) {
      router.push("/login");
    }

    if (session?.user) {
      getUserRole().then((fetchedRole) => {
        if (!fetchedRole) {
          router.push("/onboarding");
          return;
        }
        setRole(fetchedRole);
        setLoading(false);
      });
    }
  }, [isPending, session?.user, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (role === "artist") {
    return <DashboardArtist session={session} />;
  }
  if (role === "agent") {
    return <DashboardAgent session={session} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );
}
