import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { user } from "./auth";

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "approved",
  "rejected",
  "completed",
]);

export const artistProfile = pgTable("artist_profile", {
  id: text("id")
    .primaryKey()
    .$default(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  stageName: text("stage_name").notNull(),
  city: text("city"),
  genre: text("genre"),
  bio: text("bio"),

  instagram: text("instagram"),
  spotify: text("spotify"),
  youtube: text("youtube"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const agentProfile = pgTable("agent_profile", {
  id: text("id")
    .primaryKey()
    .$default(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  agencyName: text("agency_name").notNull(),
  city: text("city"),
  bio: text("bio"),

  instagram: text("instagram"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const event = pgTable("event", {
  id: text("id")
    .primaryKey()
    .$default(() => nanoid()),
  agentId: text("agent_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  location: text("location").notNull(),

  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at"),

  genres: text("genres").array(),
  description: text("description"),

  isPublished: boolean("is_published").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const application = pgTable("application", {
  id: text("id")
    .primaryKey()
    .$default(() => nanoid()),

  eventId: text("event_id")
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),

  artistId: text("artist_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  status: applicationStatusEnum("status").notNull().default("pending"),
  message: text("message"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const music = pgTable("music", {
  id: text("id")
    .primaryKey()
    .$default(() => nanoid()),
  artistId: text("artist_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  coverUrl: text("cover_url"),

  spotifyUrl: text("spotify_url"),
  youtubeUrl: text("youtube_url"),
  otherUrl: text("other_url"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const galleryImage = pgTable("gallery_image", {
  id: text("id")
    .primaryKey()
    .$default(() => nanoid()),
  artistId: text("artist_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  imageUrl: text("image_url").notNull(),
  caption: text("caption"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gigs = pgTable("gigs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  city: text("city"),
  venue: text("venue"),
  coverUrl: text("cover_url"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull(),
  artistId: text("artist_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
