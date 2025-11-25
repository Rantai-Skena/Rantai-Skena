import { db } from "@rantai-skena/db";
import {
  artistProfile,
  galleryImage,
  music,
} from "@rantai-skena/db/schema/app";
import { user } from "@rantai-skena/db/schema/auth";
import { and, eq, ilike, isNotNull, or } from "drizzle-orm";
import { Hono } from "hono";

const router = new Hono();

const parseGenres = (rawGenre: unknown): string[] => {
  if (!rawGenre) return [];
  if (Array.isArray(rawGenre)) return rawGenre.map(String).filter(Boolean);

  if (typeof rawGenre === "string") {
    return rawGenre
      .split(",")
      .map((genre) => genre.trim())
      .filter(Boolean);
  }
  return [];
};

router.get("/", async (c) => {
  const searchQuery = c.req.query("q")?.trim();
  const genresParam = c.req.query("genres")?.trim();
  const cityFilter = c.req.query("city")?.trim();

  const requestedGenres = genresParam
    ? genresParam
        .split(",")
        .map((genre) => genre.trim())
        .filter(Boolean)
    : [];

  const whereClauses = [
    // Ensure user has an artist profile (stageName is required)
    isNotNull(artistProfile.stageName),
  ];

  if (searchQuery) {
    const searchCondition = or(
      ilike(artistProfile.stageName, `%${searchQuery}%`),
      ilike(user.name, `%${searchQuery}%`),
    );
    if (searchCondition) {
      whereClauses.push(searchCondition);
    }
  }

  if (cityFilter) {
    whereClauses.push(eq(artistProfile.city, cityFilter));
  }

  const artistRows = await db
    .select({
      id: user.id,
      stageName: artistProfile.stageName,
      city: artistProfile.city,
      genre: artistProfile.genre,
      image: user.image,
      name: user.name,
    })
    .from(user)
    .innerJoin(artistProfile, eq(artistProfile.userId, user.id))
    .where(and(...whereClauses));

  const mappedArtists = artistRows
    .map((row) => {
      const parsedGenres = parseGenres(row.genre);
      return {
        id: row.id,
        name: row.stageName ?? row.name,
        city: row.city ?? null,
        genres: parsedGenres,
        image: row.image ?? null,
      };
    })
    .filter((artist) => {
      if (requestedGenres.length === 0) return true;
      return artist.genres.some((genre) => requestedGenres.includes(genre));
    });

  return c.json({ success: true, data: mappedArtists });
});

// GET /api/artists/:id
router.get("/:id", async (c) => {
  const artistId = c.req.param("id");

  const profileRows = await db
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
    .where(
      and(
        eq(artistProfile.userId, artistId),
        isNotNull(artistProfile.stageName), // Ensure profile exists
      ),
    )
    .limit(1);

  const artistProfile_data = profileRows[0];
  if (!artistProfile_data) {
    return c.json({ success: false, error: "Artist not found" }, 404);
  }

  const [musicTracks, galleryImages] = await Promise.all([
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
      .where(eq(music.artistId, artistId))
      .orderBy(music.createdAt),

    db
      .select({
        id: galleryImage.id,
        imageUrl: galleryImage.imageUrl,
        caption: galleryImage.caption,
        createdAt: galleryImage.createdAt,
      })
      .from(galleryImage)
      .where(eq(galleryImage.artistId, artistId))
      .orderBy(galleryImage.createdAt),
  ]);

  return c.json({
    success: true,
    data: {
      profile: {
        ...artistProfile_data,
        genres: parseGenres(artistProfile_data.genre),
        name: artistProfile_data.stageName ?? artistProfile_data.name,
      },
      music: musicTracks,
      gallery: galleryImages,
    },
  });
});

export default router;
