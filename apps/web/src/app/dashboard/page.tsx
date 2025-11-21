"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import DashboardAgent from "./dashboard-agent";
// import { redirect } from "next/navigation";
import DashboardArtist from "./dashboard-artist";
export default function DashboardPage() {
  // const session = await authClient.getSession({
  // 	fetchOptions: {
  // 		headers: await headers(),
  // 		throw: true,
  // 	},
  // });
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  console.log("Session isPending:", isPending);
  console.log("Session retrieved:", session);
  console.log("Session user:", session?.user);

  useEffect(() => {
    if (!(isPending || session?.user)) {
      router.push("/login");
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
    console.log("No session user, redirecting to /login");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
    // return <>
    // <h1>Dashboard</h1>
    // <p>You are not logged in. Please <a href="/login">login</a>.</p>
    // <p>
    // Session data: {JSON.stringify(session)}
    // </p>
    // </>;
  }

  if (session?.user) {
    if (!session.user.name) {
      console.log("Warning: session user exists but name is missing");
    }
    console.log("Rendering dashboard for user:", session.user.name);
  }

  // TODO: ganti role
  if (session?.user.name !== "ananda") {
    return <DashboardArtist session={session} />;
  }

  return <DashboardAgent session={session} />;
}
