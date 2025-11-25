import { db } from "@rantai-skena/db";
import { artistProfile } from "@rantai-skena/db/schema/app";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

interface ArtistProfileUpdateRequest {
  stageName?: string;
  city?: string;
  genre?: string;
  bio?: string;
  imageUrl?: string;
  contactEmail?: string;
  instagram?: string;
  spotify?: string;
  youtube?: string;
}

const DEFAULT_STAGE_NAME = "";

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
  const body = (await c.req.json()) as ArtistProfileUpdateRequest;

  const {
    stageName,
    city,
    genre,
    bio,
    imageUrl,
    contactEmail,
    instagram,
    spotify,
    youtube,
  } = body;

  const [existingProfile] = await db
    .select()
    .from(artistProfile)
    .where(eq(artistProfile.userId, user.id));

  // INSERT for first-time profile creation
  if (!existingProfile) {
    const [insertedProfile] = await db
      .insert(artistProfile)
      .values({
        id: nanoid(),
        userId: user.id,
        stageName: stageName ?? DEFAULT_STAGE_NAME,
        city,
        genre,
        bio,
        imageUrl,
        contactEmail,
        instagram,
        spotify,
        youtube,
      })
      .returning();

    return c.json({ success: true, data: insertedProfile });
  }

  const [updatedProfile] = await db
    .update(artistProfile)
    .set({
      stageName: stageName ?? existingProfile.stageName,
      city: city ?? existingProfile.city,
      genre: genre ?? existingProfile.genre,
      bio: bio ?? existingProfile.bio,
      imageUrl: imageUrl ?? existingProfile.imageUrl,
      contactEmail: contactEmail ?? existingProfile.contactEmail,
      instagram: instagram ?? existingProfile.instagram,
      spotify: spotify ?? existingProfile.spotify,
      youtube: youtube ?? existingProfile.youtube,
      updatedAt: new Date(),
    })
    .where(eq(artistProfile.userId, user.id))
    .returning();

  return c.json({ success: true, data: updatedProfile });
});

export default router;
