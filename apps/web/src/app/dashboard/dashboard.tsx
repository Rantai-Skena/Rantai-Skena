"use client";
import type { authClient } from "@/lib/auth-client";

export default function Dashboard({
	session,
}: {
	session: typeof authClient.$Infer.Session;
}) {
	const privateData = session.user;
	return (
		<>
			{privateData ? (
				<div>
					<h1>Dashboard</h1>
					<p>Welcome {privateData.name}</p>
					{/* Render more private data here */}
				</div>
			) : (
				<p>
					You are not logged in. Please <a href="/login">login</a>.
				</p>
			)}
		</>
	);
}
