import { db } from "@rantai-skena/db";
import {
  artistProfile,
  galleryImage,
  music,
} from "@rantai-skena/db/schema/app";
import { user } from "@rantai-skena/db/schema/auth";
import { and, eq, ilike, or } from "drizzle-orm";
import { Hono } from "hono";

const router = new Hono();

const parseGenres = (raw: unknown): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);

  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
  }
  return [];
};

// GET /api/artists?q=...&genres=Pop,Rock&city=Jakarta
router.get("/", async (c) => {
  const q = c.req.query("q")?.trim();
  const genresParam = c.req.query("genres")?.trim();
  const city = c.req.query("city")?.trim();

  const genres = genresParam
    ? genresParam
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean)
    : [];

  const whereClauses = [eq(user.role, "artist")];

  if (q) {
    const searchCondition = or(
      ilike(artistProfile.stageName, `%${q}%`),
      ilike(user.name, `%${q}%`),
    );
    if (searchCondition) {
      whereClauses.push(searchCondition);
    }
  }

  if (city) {
    whereClauses.push(eq(artistProfile.city, city));
  }

  const rows = await db
    .select({
      id: user.id,
      stageName: artistProfile.stageName,
      city: artistProfile.city,
      genre: artistProfile.genre,
      image: user.image,
      name: user.name,
    })
    .from(user)
    .leftJoin(artistProfile, eq(artistProfile.userId, user.id))
    .where(and(...whereClauses));

  const mapped = rows
    .map((r) => {
      const parsed = parseGenres(r.genre);
      return {
        id: r.id,
        name: r.stageName ?? r.name,
        city: r.city ?? null,
        genres: parsed,
        image: r.image ?? null,
      };
    })
    .filter((r) => {
      if (genres.length === 0) return true;
      return r.genres.some((g) => genres.includes(g));
    });

  return c.json({ success: true, data: mapped });
});

// GET /api/artists/:id
router.get("/:id", async (c) => {
  const id = c.req.param("id");

  const profileRow = await db
    .select({
      userId: artistProfile.userId,
      stageName: artistProfile.stageName,
      city: artistProfile.city,
      bio: artistProfile.bio,
      genre: artistProfile.genre,
      instagram: artistProfile.instagram,
      contactEmail: artistProfile.contactEmail,
      spotifyUrl: artistProfile.spotify,
      youtubeUrl: artistProfile.youtube,
      image: user.image,
      name: user.name,
    })
    .from(artistProfile)
    .innerJoin(user, eq(artistProfile.userId, user.id))
    .where(and(eq(artistProfile.userId, id), eq(user.role, "artist")))
    .limit(1);

  const profile = profileRow[0];
  if (!profile) {
    return c.json({ success: false, error: "Artist not found" }, 404);
  }

  const [tracks, gallery] = await Promise.all([
    db
      .select({
        id: music.id,
        title: music.title,
        coverUrl: music.coverUrl,
        spotifyUrl: music.spotifyUrl,
        youtubeUrl: music.youtubeUrl,
        otherUrl: music.otherUrl,
        createdAt: music.createdAt,
      })
      .from(music)
      .where(eq(music.artistId, id))
      .orderBy(music.createdAt),

    db
      .select({
        id: galleryImage.id,
        imageUrl: galleryImage.imageUrl,
        caption: galleryImage.caption,
        createdAt: galleryImage.createdAt,
      })
      .from(galleryImage)
      .where(eq(galleryImage.artistId, id))
      .orderBy(galleryImage.createdAt),
  ]);

  return c.json({
    success: true,
    data: {
      profile: {
        ...profile,
        genres: parseGenres(profile.genre),
        name: profile.stageName ?? profile.name,
      },
      music: tracks,
      gallery,
    },
  });
});

export default router;
