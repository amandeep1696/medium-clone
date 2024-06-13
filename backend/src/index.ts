import { Hono } from 'hono';
import { cors } from 'hono/cors';
import userRouter from './routes/user';
import blogRouter from './routes/blog';
import { ContextBindings, ContextVariables } from './types/context';

// todo deploy it

const app = new Hono<{
  Bindings: ContextBindings;
  Variables: ContextVariables;
}>();

app.use('/*', cors());

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);

export default app;
