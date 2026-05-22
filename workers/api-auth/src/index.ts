import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

// 健康检查
app.get('/', (c) => c.json({ status: 'ok', service: 'airaquas-api', version: '0.1.0' }));

// ====== 用户模块 ======

// 注册
app.post('/api/users/register', async (c) => {
  const { phone, password, name, type, shop_id } = await c.req.json();
  if (!phone || !password || !type) {
    return c.json({ error: '缺少必要字段' }, 400);
  }

  const result = await c.env.DB.prepare(
    'INSERT INTO users (phone, password_hash, name, type, shop_id) VALUES (?, ?, ?, ?, ?) RETURNING id'
  ).bind(phone, password, name, type, shop_id || null).first();

  return c.json({ success: true, id: result?.id });
});

// 登录
app.post('/api/users/login', async (c) => {
  const { phone, password } = await c.req.json();
  const user = await c.env.DB.prepare(
    'SELECT id, name, type, shop_id, status FROM users WHERE phone = ? AND password_hash = ?'
  ).bind(phone, password).first();

  if (!user) return c.json({ error: '账号或密码错误' }, 401);
  if (user.status === 'disabled') return c.json({ error: '账号已被禁用' }, 403);

  const token = crypto.randomUUID();
  await c.env.KV.put(`session:${token}`, JSON.stringify(user), { expirationTtl: 86400 });
  return c.json({ success: true, token, user });
});

// 按 ID 或手机号查用户
app.get('/api/users/:id', async (c) => {
  const { id } = c.req.param();
  const byField = id.length === 11 && /^\d{11}$/.test(id) ? 'phone' : 'id';

  const user = await c.env.DB.prepare(
    `SELECT id, name, phone, type, shop_id, avatar_url, created_at FROM users WHERE ${byField} = ?`
  ).bind(id).first();

  return user ? c.json(user) : c.json({ error: '用户不存在' }, 404);
});

export default app;

