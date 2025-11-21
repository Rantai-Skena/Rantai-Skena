import { auth } from "@rantai-skena/auth";
import { db } from "@rantai-skena/db";
import { user } from "@rantai-skena/db/schema/auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const router = new Hono();

router.put("/role", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.json();
  const role = body?.role as "artist" | "agent" | undefined;

  if (role !== "artist" && role !== "agent") {
    return c.json({ error: "Invalid role" }, 400);
  }

  const [updated] = await db
    .update(user)
    .set({
      role,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id))
    .returning();

  if (!updated) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ success: true, data: updated });
});

export default router;
