import { db } from "@rantai-skena/db";
import { event } from "@rantai-skena/db/schema/app";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

const router = new Hono();

router.get("/public", async (c) => {
  const published = await db.select().from(event);

  return c.json({ success: true, data: published });
});

// GET /api/events  (artist → published, agent → own)
router.get("/", roleGuard(), async (c) => {
  const user = getCurrentUser(c);

  if (user.role === "agent") {
    const events = await db
      .select()
      .from(event)
      .where(eq(event.agentId, user.id));

    return c.json({ success: true, data: events });
  }

  const published = await db
    .select()
    .from(event)
    .where(eq(event.isPublished, true));

  return c.json({ success: true, data: published });
});

export default router;
