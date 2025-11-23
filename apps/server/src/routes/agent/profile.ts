import { db } from "@rantai-skena/db";
import { agentProfile } from "@rantai-skena/db/schema/app";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

const router = new Hono();

router.get("/profile", roleGuard(["agent"]), async (c) => {
  const user = getCurrentUser(c);

  const [profile] = await db
    .select()
    .from(agentProfile)
    .where(eq(agentProfile.userId, user.id));

  return c.json({ success: true, data: profile ?? null });
});

router.put("/profile", roleGuard(["agent"]), async (c) => {
  const user = getCurrentUser(c);
  const body = await c.req.json();

  const { agencyName, city, bio, instagram, contactEmail, contactPhone } = body;

  const [exist] = await db
    .select()
    .from(agentProfile)
    .where(eq(agentProfile.userId, user.id));

  if (!exist) {
    const [inserted] = await db
      .insert(agentProfile)
      .values({
        id: nanoid(),
        userId: user.id,
        agencyName,
        city,
        bio,
        instagram,
        contactEmail,
        contactPhone,
      })
      .returning();

    return c.json({ success: true, data: inserted });
  }

  const [updated] = await db
    .update(agentProfile)
    .set({
      agencyName,
      city,
      bio,
      instagram,
      contactEmail,
      contactPhone,
      updatedAt: new Date(),
    })
    .where(eq(agentProfile.userId, user.id))
    .returning();

  return c.json({ success: true, data: updated });
});

export default router;
