import { Hono } from 'hono';
import user from './routes/user';
import blog from './routes/blog';
import { ContextBindings, ContextVariables } from './types/context';

const app = new Hono<{
  Bindings: ContextBindings;
  Variables: ContextVariables;
}>();

app.route('/api/v1/user', user);
app.route('/api/v1/blog', blog);

export default app;
