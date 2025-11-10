import type { MiddlewareHandler } from 'hono'
import { auth } from '@rantai-skena/auth'
import { db } from '@rantai-skena/db'
import { user } from '@rantai-skena/db/schema/auth'
import { eq } from 'drizzle-orm'

export const roleGuard = (allowedRoles?: ('artist' | 'agent')[]): MiddlewareHandler => {
  return async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)) as Array<{
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image: string | null;
      role: 'artist' | 'agent' | null;
      createdAt: Date;
      updatedAt: Date;
    }>;

    if (!currentUser) {
      return c.json({ error: 'User not found' }, 404)
    }

    if (!currentUser.role) {
      return c.redirect('/register/role')
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      return c.json({ error: 'Forbidden: insufficient role' }, 403)
    }

    c.set('user', currentUser)

    await next()
  }
}
