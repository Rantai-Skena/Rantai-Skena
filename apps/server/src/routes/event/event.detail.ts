import { db } from "@rantai-skena/db";
import { event } from "@rantai-skena/db/schema/app";
import { user } from "@rantai-skena/db/schema/auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { roleGuard } from "../../middleware/roleGuard";

const router = new Hono();

router.get("/:id", roleGuard(), async (c) => {
  const id = c.req.param("id");

  const [row] = await db
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
    .where(eq(event.id, id));
  console.log(row);
  if (!row) return c.json({ success: false, error: "Not found" }, 404);

  return c.json({ success: true, data: row });
});

export default router;
