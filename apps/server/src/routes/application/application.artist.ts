// apps/server/src/routes/application/application.artist.ts

import { db } from "@rantai-skena/db";
import { application, event as eventTable } from "@rantai-skena/db/schema/app";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { roleGuard } from "../../middleware/roleGuard";
import { getCurrentUser } from "../../utils/getCurrentUser";

const router = new Hono();

// Artist apply ke sebuah event
router.post("/", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);
  const body = await c.req.json();

  const { eventId, message } = body as {
    eventId?: string;
    message?: string;
  };

  if (!eventId) {
    return c.json({ success: false, error: "eventId is required" }, 400);
  }

  // Pastikan event ada & sudah publish (opsional)
  const [targetEvent] = await db
    .select()
    .from(eventTable)
    .where(eq(eventTable.id, eventId));

  if (!targetEvent) {
    return c.json({ success: false, error: "Event not found" }, 404);
  }

  // Cek apakah artist sudah pernah apply ke event ini
  const [existingApplication] = await db
    .select()
    .from(application)
    .where(
      eq(application.eventId, eventId) && eq(application.artistId, user.id),
    );

  if (existingApplication) {
    return c.json(
      {
        success: true,
        data: {
          id: existingApplication.id,
          message: existingApplication.message,
          status: existingApplication.status,
          eventId: existingApplication.eventId,
          artistId: existingApplication.artistId,
          createdAt: existingApplication.createdAt,
          toastMessage: "Kamu sudah pernah apply ke event ini!",
        },
      },
      200,
    );
  }

  const [inserted] = await db
    .insert(application)
    .values({
      id: nanoid(),
      eventId,
      artistId: user.id,
      status: "pending",
      message,
    })
    .returning();

  return c.json(
    {
      success: true,
      data: {
        id: inserted?.id,
        message: inserted?.message,
        status: inserted?.status,
        eventId: inserted?.eventId,
        artistId: inserted?.artistId,
        createdAt: inserted?.createdAt,
        toastMessage: "Berhasil apply ke event ini!",
      },
      message: "Berhasil apply ke event ini!",
    },
    201,
  );
});

// List application milik artist (My Application)
router.get("/my", roleGuard(["artist"]), async (c) => {
  const user = getCurrentUser(c);

  const rows = await db
    .select({
      id: application.id,
      status: application.status,
      message: application.message,
      createdAt: application.createdAt,
      eventId: eventTable.id,
      eventName: eventTable.name,
      eventLocation: eventTable.location,
      eventStartsAt: eventTable.startsAt,
      agentId: eventTable.agentId,
    })
    .from(application)
    .leftJoin(eventTable, eq(application.eventId, eventTable.id))
    .where(eq(application.artistId, user.id));

  return c.json({ success: true, data: rows });
});

export default router;
