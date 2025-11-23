// apps/server/src/routes/gallery/gallery.ts

import { db } from "@rantai-skena/db";
import { galleryImage } from "@rantai-skena/db/schema/app";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

const router = new Hono();

// List gallery milik artist
router.get("/", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);

  const rows = await db
    .select()
    .from(galleryImage)
    .where(eq(galleryImage.artistId, user.id));

  return c.json({ success: true, data: rows });
});

// Tambah foto ke gallery
router.post("/", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);
  const body = await c.req.json();

  const { imageUrl, caption } = body as {
    imageUrl?: string;
    caption?: string;
  };

  if (!imageUrl) {
    return c.json({ success: false, error: "imageUrl is required" }, 400);
  }

  const [inserted] = await db
    .insert(galleryImage)
    .values({
      id: nanoid(),
      artistId: user.id,
      imageUrl,
      caption,
    })
    .returning();

  return c.json({ success: true, data: inserted }, 201);
});

// Hapus foto dari gallery
router.delete("/:id", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);
  const id = c.req.param("id");

  const [existing] = await db
    .select()
    .from(galleryImage)
    .where(and(eq(galleryImage.id, id), eq(galleryImage.artistId, user.id)));

  if (!existing) {
    return c.json(
      { success: false, error: "Image not found or not owned by you" },
      404,
    );
  }

  await db.delete(galleryImage).where(eq(galleryImage.id, id));

  return c.json({ success: true });
});

export default router;
