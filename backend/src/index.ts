import { Hono } from 'hono';
import userRouter from './routes/user';
import blogRouter from './routes/blog';
import { ContextBindings, ContextVariables } from './types/context';

const app = new Hono<{
  Bindings: ContextBindings;
  Variables: ContextVariables;
}>();

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);

export default app;
