import { Next, Context } from 'hono';
import { verify } from 'hono/jwt';

export const jwtMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    c.status(401);
    return c.json({
      error: 'Authorization header missing or malformed',
    });
  }
  const token = authHeader.split(' ')[1];
  const payload = await verify(token, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({
      error: 'Unauthorized User',
    });
  }
  c.set('userId', payload.id);
  await next();
};
