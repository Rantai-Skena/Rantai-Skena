import { db } from "@rantai-skena/db";
import { artistProfile } from "@rantai-skena/db/schema/app";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

const router = new Hono();

router.get("/profile", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);

  const [profile] = await db
    .select()
    .from(artistProfile)
    .where(eq(artistProfile.userId, user.id));

  return c.json({ success: true, data: profile ?? null });
});

router.put("/profile", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);
  const body = await c.req.json();

  const { stageName, city, genre, bio, instagram, spotify, youtube } = body;

  const [exist] = await db
    .select()
    .from(artistProfile)
    .where(eq(artistProfile.userId, user.id));

  if (!exist) {
    const [inserted] = await db
      .insert(artistProfile)
      .values({
        id: nanoid(),
        userId: user.id,
        stageName,
        city,
        genre,
        bio,
        instagram,
        spotify,
        youtube,
      })
      .returning();

    return c.json({ success: true, data: inserted });
  }

  const [updated] = await db
    .update(artistProfile)
    .set({
      stageName,
      city,
      genre,
      bio,
      instagram,
      spotify,
      youtube,
      updatedAt: new Date(),
    })
    .where(eq(artistProfile.userId, user.id))
    .returning();

  return c.json({ success: true, data: updated });
});

export default router;
