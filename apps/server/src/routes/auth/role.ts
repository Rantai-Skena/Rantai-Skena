import { auth } from "@rantai-skena/auth";
import { db } from "@rantai-skena/db";
import { agentProfile, artistProfile } from "@rantai-skena/db/schema/app";
import { user } from "@rantai-skena/db/schema/auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const router = new Hono();

interface RoleRequestBody {
  role: "artist" | "agent";
}

type UserRole = "artist" | "agent" | null;

router.put("/role", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = (await c.req.json()) as RoleRequestBody;
  const { role } = body;

  if (role !== "artist" && role !== "agent") {
    return c.json({ error: "Invalid role" }, 400);
  }

  const [updatedUser] = await db
    .update(user)
    .set({
      role,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id))
    .returning();

  if (!updatedUser) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ success: true, data: updatedUser });
});

router.get("/role", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userWithProfiles = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      artistProfileId: artistProfile.id,
      agentProfileId: agentProfile.id,
    })
    .from(user)
    .leftJoin(artistProfile, eq(artistProfile.userId, user.id))
    .leftJoin(agentProfile, eq(agentProfile.userId, user.id))
    .where(eq(user.id, session.user.id))
    .limit(1);

  const foundUser = userWithProfiles[0];

  if (!foundUser) {
    return c.json({ error: "User not found" }, 404);
  }

  let determinedRole: UserRole = null;

  if (foundUser.artistProfileId && foundUser.agentProfileId) {
    determinedRole = "artist";
  } else if (foundUser.artistProfileId) {
    determinedRole = "artist";
  } else if (foundUser.agentProfileId) {
    determinedRole = "agent";
  }

  const userResponse = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    emailVerified: foundUser.emailVerified,
    image: foundUser.image,
    role: determinedRole,
    createdAt: foundUser.createdAt,
    updatedAt: foundUser.updatedAt,
  };

  return c.json({ success: true, data: userResponse });
});

export default router;
