// apps/server/src/routes/application/application.status.ts

import { db } from "@rantai-skena/db";
import { application, event as eventTable } from "@rantai-skena/db/schema/app";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

const router = new Hono();

// Update status application
router.patch("/:id/status", roleGuard(["agent"]), async (c) => {
  const user = getCurrentUser(c);
  const id = c.req.param("id");
  const body = await c.req.json();

  const { status } = body as { status?: string };

  const allowedStatuses = ["pending", "approved", "rejected", "completed"];

  if (!status || !allowedStatuses.includes(status)) {
    return c.json({ success: false, error: "Invalid status" }, 400);
  }

  // Ambil application + event untuk cek kepemilikan
  const [existing] = await db
    .select({
      id: application.id,
      eventId: eventTable.id,
      agentId: eventTable.agentId,
    })
    .from(application)
    .leftJoin(eventTable, eq(application.eventId, eventTable.id))
    .where(eq(application.id, id));

  if (!existing || existing.agentId !== user.id) {
    return c.json(
      { success: false, error: "Application not found or forbidden" },
      404,
    );
  }

  const [updated] = await db
    .update(application)
    .set({
      status: status as any,
      updatedAt: new Date(),
    })
    .where(eq(application.id, id))
    .returning();

  return c.json({ success: true, data: updated });
});

export default router;
