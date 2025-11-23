// apps/server/src/routes/music/music.ts

import { db } from "@rantai-skena/db";
import { music } from "@rantai-skena/db/schema/app";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

const router = new Hono();

/**
 * GET /api/music
 * Dipakai di MyMusic:
 *   apiGet<MusicRow[]>("/music")
 * Mengembalikan semua track music milik artist login.
 */
router.get("/", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);

  const rows = await db
    .select()
    .from(music)
    .where(eq(music.artistId, user.id))
    .orderBy(music.createdAt); // kalau mau terbaru dulu, nanti bisa diubah di level query

  return c.json({ success: true, data: rows });
});

/**
 * POST /api/music
 * Dipakai di MyMusic:
 *   apiPost<MusicRow, typeof musicForm>("/music", {...})
 * Body yang dikirim:
 *   { title, coverUrl, spotifyUrl, youtubeUrl, otherUrl }
 */
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

  if (!title || title.trim().length === 0) {
    return c.json({ success: false, error: "Title is required" }, 400);
  }

  const [inserted] = await db
    .insert(music)
    .values({
      id: nanoid(),
      artistId: user.id,
      title: title.trim(),
      coverUrl: coverUrl?.trim() || null,
      spotifyUrl: spotifyUrl?.trim() || null,
      youtubeUrl: youtubeUrl?.trim() || null,
      otherUrl: otherUrl?.trim() || null,
    })
    .returning();

  return c.json({ success: true, data: inserted }, 201);
});

/**
 * DELETE /api/music/:id
 * Belum dipakai di frontend sekarang, tapi sekalian aku buatkan
 * kalau nanti kamu mau tambah fitur delete di MyMusic.
 */
router.delete("/:id", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);
  const id = c.req.param("id");

  // Pastikan track milik artist ini
  const [existing] = await db
    .select()
    .from(music)
    .where(and(eq(music.id, id), eq(music.artistId, user.id)));

  if (!existing) {
    return c.json(
      { success: false, error: "Music not found or forbidden" },
      404,
    );
  }

  const [deleted] = await db.delete(music).where(eq(music.id, id)).returning();

  return c.json({ success: true, data: deleted });
});

export default router;
