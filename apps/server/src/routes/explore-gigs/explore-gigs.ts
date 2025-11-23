// apps/server/src/routes/explore-gigs/explore-gigs.ts

import { db } from "@rantai-skena/db";
import { gigs } from "@rantai-skena/db/schema/app";
import { and, eq, gte, lte } from "drizzle-orm";
import { Hono } from "hono";

const router = new Hono();

/**
 * GET /api/explore-gigs
 * Public — tidak perlu login
 * Mengembalikan daftar gigs yang sudah "published"
 * Opsional: query filtering
 *   - city
 *   - fromDate (ISO)
 *   - toDate (ISO)
 */
router.get("/", async (c) => {
  const city = c.req.query("city");
  const fromDate = c.req.query("fromDate"); // yyyy-mm-dd
  const toDate = c.req.query("toDate");

  const conditions = [eq(gigs.status, "published")];

  if (city) conditions.push(eq(gigs.city, city));

  if (fromDate) conditions.push(gte(gigs.startDate, new Date(fromDate)));
  if (toDate) conditions.push(lte(gigs.startDate, new Date(toDate)));

  const data = await db
    .select()
    .from(gigs)
    .where(and(...conditions))
    .orderBy(gigs.startDate);

  return c.json({ success: true, data });
});

export default router;
