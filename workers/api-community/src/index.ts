import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database };

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-community' }));

// 帖子列表
app.get('/api/posts', async (c) => {
  const { type, page = '1', limit = '20' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let sql = 'SELECT p.*, u.name as author_name, u.avatar_url as author_avatar FROM community_posts p JOIN users u ON u.id = p.user_id WHERE p.status = ?';
  const params: any[] = ['published'];

  if (type) { sql += ' AND p.type = ?'; params.push(type); }
  sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const data = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json({ data: data.results, page: parseInt(page), limit: parseInt(limit) });
});

// 帖子详情
app.get('/api/posts/:id', async (c) => {
  const id = c.req.param('id');
  const post = await c.env.DB.prepare(
    'SELECT p.*, u.name as author_name, u.avatar_url as author_avatar FROM community_posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?'
  ).bind(id).first();
  if (!post) return c.json({ error: '帖子不存在' }, 404);

  const comments = await c.env.DB.prepare(
    'SELECT c.*, u.name as author_name, u.avatar_url as author_avatar FROM community_comments c JOIN users u ON u.id = c.user_id WHERE c.post_id = ? ORDER BY c.created_at ASC'
  ).bind(id).all();

  return c.json({ ...post, comments: comments.results });
});

// 发布帖子
app.post('/api/posts', async (c) => {
  const { user_id, type, title, content, images, before_image, after_image, tags } = await c.req.json();
  if (!user_id || !content) return c.json({ error: '缺少必要信息' }, 400);

  const result = await c.env.DB.prepare(
    'INSERT INTO community_posts (user_id, type, title, content, images, before_image, after_image, tags) VALUES (?,?,?,?,?,?,?,?) RETURNING id'
  ).bind(user_id, type || 'article', title || null, content, images || null, before_image || null, after_image || null, tags || null).first();

  return c.json({ success: true, id: result?.id });
});

// 评论
app.post('/api/posts/:id/comments', async (c) => {
  const post_id = c.req.param('id');
  const { user_id, content } = await c.req.json();
  if (!user_id || !content) return c.json({ error: '缺少必要信息' }, 400);

  await c.env.DB.prepare('INSERT INTO community_comments (post_id, user_id, content) VALUES (?,?,?)').bind(post_id, user_id, content).run();
  await c.env.DB.prepare('UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = ?').bind(post_id).run();

  return c.json({ success: true });
});

// 点赞/取消赞
app.post('/api/posts/:id/like', async (c) => {
  const post_id = c.req.param('id');
  const { user_id } = await c.req.json();
  if (!user_id) return c.json({ error: '缺少用户' }, 400);

  const existing = await c.env.DB.prepare('SELECT id FROM community_likes WHERE post_id=? AND user_id=?').bind(post_id, user_id).first();
  if (existing) {
    await c.env.DB.prepare('DELETE FROM community_likes WHERE id=?').bind(existing.id).run();
    await c.env.DB.prepare('UPDATE community_posts SET like_count = MAX(0, like_count - 1) WHERE id=?').bind(post_id).run();
    return c.json({ success: true, liked: false });
  } else {
    await c.env.DB.prepare('INSERT INTO community_likes (post_id, user_id) VALUES (?,?)').bind(post_id, user_id).run();
    await c.env.DB.prepare('UPDATE community_posts SET like_count = like_count + 1 WHERE id=?').bind(post_id).run();
    return c.json({ success: true, liked: true });
  }
});

// 知识库/文章类型帖子
app.get('/api/knowledge', async (c) => {
  const data = await c.env.DB.prepare(
    "SELECT p.*, u.name as author_name FROM community_posts p JOIN users u ON u.id = p.user_id WHERE p.type='article' AND p.status='published' ORDER BY p.created_at DESC"
  ).all();
  return c.json({ data: data.results });
});

// 用户打卡记录
app.get('/api/checkins/:user_id', async (c) => {
  const data = await c.env.DB.prepare(
    "SELECT * FROM community_posts WHERE user_id=? AND type='checkin' ORDER BY created_at DESC LIMIT 50"
  ).bind(c.req.param('user_id')).all();
  return c.json({ data: data.results });
});

export default app;
