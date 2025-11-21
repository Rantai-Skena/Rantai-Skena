import { db } from "@rantai-skena/db";
import { event } from "@rantai-skena/db/schema/app";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { roleGuard } from "../../middleware/roleGuard";

const router = new Hono();

router.get("/:id", roleGuard(), async (c) => {
  const id = c.req.param("id");

  const [row] = await db.select().from(event).where(eq(event.id, id));

  if (!row) return c.json({ success: false, error: "Not found" }, 404);

  return c.json({ success: true, data: row });
});

export default router;
