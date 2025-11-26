import { db } from "@rantai-skena/db";
import { event } from "@rantai-skena/db/schema/app";
import { user } from "@rantai-skena/db/schema/auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

const router = new Hono();

router.get("/public", async (c) => {
  const published = await db
    .select({
      id: event.id,
      agentId: event.agentId,
      agentName: user.name,
      name: event.name,
      location: event.location,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      genres: event.genres,
      description: event.description,
      isPublished: event.isPublished,
      imageUrl: event.imageUrl,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    })
    .from(event)
    .leftJoin(user, eq(event.agentId, user.id));

  return c.json({ success: true, data: published });
});

// GET /api/events  (artist → published, agent → own)
router.get("/", roleGuard(), async (c) => {
  const currentUser = getCurrentUser(c);

  if (currentUser.role === "agent") {
    const events = await db
      .select({
        id: event.id,
        agentId: event.agentId,
        agentName: user.name,
        name: event.name,
        location: event.location,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        genres: event.genres,
        description: event.description,
        isPublished: event.isPublished,
        imageUrl: event.imageUrl,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      })
      .from(event)
      .leftJoin(user, eq(event.agentId, user.id))
      .where(eq(event.agentId, currentUser.id));

    return c.json({ success: true, data: events });
  }

  const published = await db
    .select({
      id: event.id,
      agentId: event.agentId,
      agentName: user.name,
      name: event.name,
      location: event.location,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      genres: event.genres,
      description: event.description,
      isPublished: event.isPublished,
      imageUrl: event.imageUrl,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    })
    .from(event)
    .leftJoin(user, eq(event.agentId, user.id))
    .where(eq(event.isPublished, true));

  return c.json({ success: true, data: published });
});

export default router;
