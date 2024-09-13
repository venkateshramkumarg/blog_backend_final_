import { Hono } from 'hono'
import { cors } from 'hono/cors'
import usersGroup from './api/users'
import postsGroup from './api/posts'
import commentsGroup from './api/comments'

const app = new Hono().basePath('/api')

app.use('*', cors({
  origin: '*', 
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowHeaders: ['Content-Type', 'Authorization'],
}));


app.route('/users',usersGroup)
app.route('/posts',postsGroup)
app.route('/comments',commentsGroup)

app.get('/', (c) => {
  return c.text('Welcome to Hono')
})

export default { 
  port: 3000, 
  fetch: app.fetch, 
} 
