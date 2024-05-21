import { Hono } from 'hono';
import user from './routes/user';
import blog from './routes/blog';
import { EnvironmentBindings } from './types/bindings';

const app = new Hono<EnvironmentBindings>();

app.route('/api/v1/user', user);
app.route('/api/v1/blog', blog);

export default app;
