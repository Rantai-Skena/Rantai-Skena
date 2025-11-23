// apps/server/src/routes/application/application.agent.ts

import { db } from "@rantai-skena/db";
import { application, event as eventTable } from "@rantai-skena/db/schema/app";
import { user as userTable } from "@rantai-skena/db/schema/auth";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

const router = new Hono();

// Path penuh: GET /api/events/:id/applications
router.get("/:id/applications", roleGuard(["agent"]), async (c) => {
  const user = getCurrentUser(c);
  const eventId = c.req.param("id");

  // Pastikan event milik agent yang login
  const [targetEvent] = await db
    .select()
    .from(eventTable)
    .where(and(eq(eventTable.id, eventId), eq(eventTable.agentId, user.id)));

  if (!targetEvent) {
    return c.json(
      { success: false, error: "Event not found or not owned by you" },
      404,
    );
  }

  const rows = await db
    .select({
      id: application.id,
      status: application.status,
      message: application.message,
      createdAt: application.createdAt,
      artistId: application.artistId,
      artistName: userTable.name,
      artistEmail: userTable.email,
    })
    .from(application)
    .leftJoin(userTable, eq(application.artistId, userTable.id))
    .where(eq(application.eventId, eventId));

  return c.json({ success: true, data: rows });
});

export default router;
