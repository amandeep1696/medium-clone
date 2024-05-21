import { Hono } from 'hono';

const user = new Hono();

user.post('/signup', (c) => {
  return c.text('Sign up');
});

user.post('/signin', (c) => {
  return c.text('Sign in');
});

export default user;
