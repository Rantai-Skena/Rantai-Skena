import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "..";
import { event } from "../schema/app";
import { user } from "../schema/auth";

/**
 * Helper: ensure at least some agents exist.
 * user.id ga punya default, jadi kalau bikin baru harus supply id sendiri.
 */
async function ensureAgents() {
  const agents = await db.select().from(user).where(eq(user.role, "agent"));
  if (agents.length > 0) return agents;

  const now = new Date();

  // bikin 4 agent dummy biar variasi eventnya makin banyak
  const dummyAgents = Array.from({ length: 4 }).map((_, i) => {
    const id = nanoid();
    const name = faker.person.fullName();
    const email = `agent.${i + 1}.${faker.string.alphanumeric(6).toLowerCase()}@example.com`;

    return {
      id,
      name,
      email,
      emailVerified: true,
      image: null,
      role: "agent" as const,
      createdAt: now,
      updatedAt: now,
    };
  });

  await db.insert(user).values(dummyAgents);
  return dummyAgents;
}

// -------- Random helpers --------

const GENRE_POOL = [
  "indie",
  "alternative",
  "pop",
  "rock",
  "metal",
  "punk",
  "jazz",
  "soul",
  "rnb",
  "lofi",
  "acoustic",
  "folk",
  "hiphop",
  "electronic",
  "house",
  "techno",
  "dangdut",
  "koplo",
  "reggae",
  "ska",
];

const CITY_POOL = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Medan",
  "Makassar",
  "Denpasar",
  "Malang",
  "Balikpapan",
  "Palembang",
  "Bogor",
];

/**
 * Random datetime in December 2025 (UTC).
 */
function randomDateInDecember2025(): Date {
  const start = new Date(Date.UTC(2025, 11, 1, 0, 0, 0)); // month 11 = Dec
  const end = new Date(Date.UTC(2025, 11, 31, 23, 59, 59));

  const ts = faker.number.int({
    min: start.getTime(),
    max: end.getTime(),
  });

  return new Date(ts);
}

/**
 * Random end time beberapa jam setelah startsAt.
 * Kadang return null buat ngetes field opsional endsAt.
 */
function randomEndsAt(startsAt: Date): Date | null {
  const shouldHaveEnd = faker.datatype.boolean({ probability: 0.8 });
  if (!shouldHaveEnd) return null;

  const hoursToAdd = faker.number.int({ min: 2, max: 10 });
  const minutesToAdd = faker.helpers.arrayElement([0, 15, 30, 45]);

  const end = new Date(startsAt);
  end.setUTCHours(end.getUTCHours() + hoursToAdd);
  end.setUTCMinutes(end.getUTCMinutes() + minutesToAdd);

  return end;
}

function randomGenres(): string[] {
  const count = faker.number.int({ min: 1, max: 4 });
  return faker.helpers.arrayElements(GENRE_POOL, count);
}

function randomLocation(): string {
  const city = faker.helpers.arrayElement(CITY_POOL);
  const venueType = faker.helpers.arrayElement([
    "Rooftop",
    "Concert Hall",
    "Music Cafe",
    "Community Park",
    "Beach Stage",
    "Warehouse Venue",
    "Auditorium",
    "Open Air Venue",
  ]);

  return `${venueType}, ${city}, Indonesia`;
}

function randomEventName(genres: string[]) {
  // bikin nama event agak nyambung sama genre
  const vibe = faker.helpers.arrayElement([
    "Night",
    "Sessions",
    "Festival",
    "Showcase",
    "Live",
    "Gathering",
    "Jam",
    "Carnival",
  ]);

  const mainGenre = genres[0] ?? "Music";
  const city = faker.helpers.arrayElement(CITY_POOL);

  return `${city} ${faker.word.adjective()} ${mainGenre} ${vibe}`;
}

function randomDescription(genres: string[], location: string) {
  const mainGenre = genres[0] ?? "music";
  const perks = faker.helpers.arrayElements(
    [
      "slot terbatas",
      "sound system premium",
      "open for applicants",
      "audience 300+",
      "live streaming",
      "backline tersedia",
      "merch booth included",
      "door prize untuk penonton",
    ],
    faker.number.int({ min: 2, max: 4 }),
  );

  return [
    `Event ${mainGenre} di ${location}.`,
    faker.lorem.sentences({ min: 1, max: 2 }),
    `Highlight: ${perks.join(", ")}.`,
  ].join(" ");
}

// -------- Main seed --------

export async function seedEvents(options?: { total?: number }) {
  faker.seed(202512); // biar reproducible (boleh kamu ganti / hapus)

  const agents = await ensureAgents();
  if (agents.length === 0) throw new Error("No agents found or created");

  const total = options?.total ?? 25;

  const eventsData = Array.from({ length: total }).map(() => {
    const agent = faker.helpers.arrayElement(agents);

    const startsAt = randomDateInDecember2025();
    const endsAt = randomEndsAt(startsAt);
    const genres = randomGenres();
    const location = randomLocation();

    // published lebih sering true biar enak dicek di UI
    const isPublished = faker.datatype.boolean({ probability: 0.7 });

    return {
      agentId: agent.id,
      name: randomEventName(genres),
      location,
      startsAt,
      endsAt,
      genres,
      description: randomDescription(genres, location),
      isPublished,
      // createdAt/updatedAt auto defaultNow() di schema,
      // jadi gak perlu diisi kecuali kamu mau override.
    };
  });

  const inserted = await db.insert(event).values(eventsData).returning();

  console.log(`✅ Seeded ${inserted.length} events (randomized, Dec 2025)`);
  return inserted;
}

// kalau file ini dijalankan langsung
// ESM-friendly runner: file ini emang khusus buat di-run langsung
seedEvents()
  .then(() => {
    console.log("✅ Seed events finished");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed events failed:", err);
    process.exit(1);
  });
