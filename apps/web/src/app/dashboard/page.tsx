"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
// import { redirect } from "next/navigation";
import Dashboard from "./dashboard";
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
    return <p>Loading...</p>;
  }
  if (!session?.user) {
    console.log("No session user, redirecting to /login");
    return <p>Redirecting to login...</p>;
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

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      <Dashboard session={session} />
    </div>
  );
}
