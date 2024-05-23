import { Next, Context } from 'hono';
import { verify } from 'hono/jwt';
import { ContextBindings, ContextVariables } from '../types/context';
import { createMiddleware } from 'hono/factory';
import { Variables } from 'hono/types';

export const jwtMiddleware = createMiddleware<{ Variables: ContextVariables }>(
  async (c: Context, next: Next) => {
    const authHeader = c.req.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      c.status(401);
      return c.json({
        error: 'Authorization header missing or malformed',
      });
    }
    const token = authHeader.split(' ')[1];

    try {
      const payload = await verify(token, c.env.JWT_SECRET);
      if (!payload || !payload.id) {
        throw new Error('Invalid token payload');
      }
      c.set('userId', payload.id);
      await next();
    } catch (e) {
      c.status(401);
      return c.json({
        error: 'Unauthorized User',
      });
    }
  }
);
