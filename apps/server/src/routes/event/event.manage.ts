import { db } from "@rantai-skena/db";
import { event } from "@rantai-skena/db/schema/app";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

const router = new Hono();

// Agent-only list
router.get("/", roleGuard(["agent"]), async (c) => {
  const user = getCurrentUser(c);

  const events = await db
    .select()
    .from(event)
    .where(eq(event.agentId, user.id));

  return c.json({ success: true, data: events });
});

// Create event
router.post("/", roleGuard(["agent"]), async (c) => {
  const user = getCurrentUser(c);
  const body = await c.req.json();

  const [inserted] = await db
    .insert(event)
    .values({
      id: nanoid(),
      agentId: user.id,
      ...body,
      startsAt: new Date(body.startsAt),
      endsAt: body.endsAt ? new Date(body.endsAt) : null,
    })
    .returning();

  return c.json({ success: true, data: inserted }, 201);
});

// Update event
router.put("/:id", roleGuard(["agent"]), async (c) => {
  const user = getCurrentUser(c);
  const id = c.req.param("id");
  const body = await c.req.json();

  const [exist] = await db
    .select()
    .from(event)
    .where(and(eq(event.id, id), eq(event.agentId, user.id)));

  if (!exist)
    return c.json(
      { success: false, error: "Event not found or not yours" },
      404,
    );

  const [updated] = await db
    .update(event)
    .set({
      ...body,
      startsAt: body.startsAt ? new Date(body.startsAt) : exist.startsAt,
      updatedAt: new Date(),
    })
    .where(eq(event.id, id))
    .returning();

  return c.json({ success: true, data: updated });
});

// Delete event
router.delete("/:id", roleGuard(["agent"]), async (c) => {
  const user = getCurrentUser(c);
  const id = c.req.param("id");

  const [exist] = await db
    .select()
    .from(event)
    .where(and(eq(event.id, id), eq(event.agentId, user.id)));

  if (!exist)
    return c.json(
      { success: false, error: "Event not found or not yours" },
      404,
    );

  await db.delete(event).where(eq(event.id, id));

  return c.json({ success: true });
});

export default router;
