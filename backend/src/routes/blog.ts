import { Hono } from 'hono';
import { ContextBindings, ContextVariables } from '../types/context';
import { jwtMiddleware } from '../middleware/jwtMiddleware';

const blogRouter = new Hono<{
  Bindings: ContextBindings;
  Variables: ContextVariables;
}>();

blogRouter.use(jwtMiddleware);

blogRouter.post('/', (c) => {
  console.log(c.get('userId'));
  return c.text('Post blog');
});

blogRouter.put('/', (c) => {
  return c.text('Put blog');
});

blogRouter.get('/:id', (c) => {
  const id = c.req.param('id');
  return c.text(`Get blog ${id}`);
});

blogRouter.get('/bulk', (c) => {
  return c.text('Get blogs');
});

export default blogRouter;
