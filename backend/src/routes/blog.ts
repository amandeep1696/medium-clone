import { Hono } from 'hono';
import { ContextBindings, ContextVariables } from '../types/context';
import { jwtMiddleware } from '../middleware/jwtMiddleware';
import { prismaMiddleware } from '../middleware/prismaMiddleware';

const blogRouter = new Hono<{
  Bindings: ContextBindings;
  Variables: ContextVariables;
}>();

blogRouter.use(jwtMiddleware);
blogRouter.use(prismaMiddleware);

// todo check all the routes through gpt again
// todo probably add comment functionality
// todo probably add tags as many to many relationship
// todo probably add email verification signup
// todo probably add image thumbnails for blog posts

blogRouter.post('/', async (c) => {
  const prisma = c.get('prisma');
  const body = await c.req.json();

  try {
    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: c.get('userId'),
      },
    });

    c.status(201);
    return c.json({
      id: newPost.id,
    });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({
      error: 'Internal server error',
    });
  }
});

// todo dont let different author put
blogRouter.put('/', async (c) => {
  const prisma = c.get('prisma');
  const body = await c.req.json();

  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    c.status(200);
    return c.json({
      id: updatedPost.id,
    });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({
      error: 'Internal server error',
    });
  }
});

// todo add pagination
// todo probably just return the titles
blogRouter.get('/bulk', async (c) => {
  const prisma = c.get('prisma');

  try {
    const posts = await prisma.post.findMany();
    c.status(200);
    return c.json({
      posts,
    });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({
      error: 'Internal server error',
    });
  }
});

blogRouter.get('/:id', async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });

    c.status(200);
    return c.json({
      post,
    });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({
      error: 'Internal server error',
    });
  }
});

export default blogRouter;
