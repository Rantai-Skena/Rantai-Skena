// apps/server/src/routes/music/music.ts

import { db } from "@rantai-skena/db";
import { music } from "@rantai-skena/db/schema/app";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
// import { roleGuard } from "../../middleware/roleGuard";
// import { getCurrentUser } from "../../utils/getCurrentUser";
import { roleGuard } from "@/middleware/roleGuard";
import { getCurrentUser } from "@/utils/getCurrentUser";

const router = new Hono();

// List music milik artist
router.get("/", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);

  const rows = await db.select().from(music).where(eq(music.artistId, user.id));

  return c.json({ success: true, data: rows });
});

// Tambah music
router.post("/", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);
  const body = await c.req.json();

  const { title, coverUrl, spotifyUrl, youtubeUrl, otherUrl } = body as {
    title?: string;
    coverUrl?: string;
    spotifyUrl?: string;
    youtubeUrl?: string;
    otherUrl?: string;
  };

  if (!title) {
    return c.json({ success: false, error: "title is required" }, 400);
  }

  const [inserted] = await db
    .insert(music)
    .values({
      id: nanoid(),
      artistId: user.id,
      title,
      coverUrl,
      spotifyUrl,
      youtubeUrl,
      otherUrl,
    })
    .returning();

  return c.json({ success: true, data: inserted }, 201);
});

// Update music
router.put("/:id", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);
  const id = c.req.param("id");
  const body = await c.req.json();

  const { title, coverUrl, spotifyUrl, youtubeUrl, otherUrl } = body as {
    title?: string;
    coverUrl?: string;
    spotifyUrl?: string;
    youtubeUrl?: string;
    otherUrl?: string;
  };

  const [existing] = await db
    .select()
    .from(music)
    .where(and(eq(music.id, id), eq(music.artistId, user.id)));

  if (!existing) {
    return c.json(
      { success: false, error: "Music not found or not owned by you" },
      404,
    );
  }

  const [updated] = await db
    .update(music)
    .set({
      title: title ?? existing.title,
      coverUrl: coverUrl ?? existing.coverUrl,
      spotifyUrl: spotifyUrl ?? existing.spotifyUrl,
      youtubeUrl: youtubeUrl ?? existing.youtubeUrl,
      otherUrl: otherUrl ?? existing.otherUrl,
      updatedAt: new Date(),
    })
    .where(eq(music.id, id))
    .returning();

  return c.json({ success: true, data: updated });
});

// Delete music
router.delete("/:id", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);
  const id = c.req.param("id");

  const [existing] = await db
    .select()
    .from(music)
    .where(and(eq(music.id, id), eq(music.artistId, user.id)));

  if (!existing) {
    return c.json(
      { success: false, error: "Music not found or not owned by you" },
      404,
    );
  }

  await db.delete(music).where(eq(music.id, id));

  return c.json({ success: true });
});

export default router;
