import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { EnvironmentBindings } from '../types/bindings';
import { jwtMiddleware } from './middleware/jwtMiddleware';

const blog = new Hono<EnvironmentBindings>();
blog.use(jwtMiddleware);

blog.post('/', (c) => {
  console.log(c.get('userId'));
  return c.text('Post blog');
});

blog.put('/', (c) => {
  return c.text('Put blog');
});

blog.get('/:id', (c) => {
  const id = c.req.param('id');
  return c.text(`Get blog ${id}`);
});

blog.get('/bulk', (c) => {
  return c.text('Get blogs');
});

export default blog;
