import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database; KV: KVNamespace; R2: R2Bucket };
const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-crm' }));

// 获取会员列表
app.get('/api/crm/members', async (c) => {
  const shopId = c.req.query('shop_id');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = (page - 1) * limit;

  let query = 'SELECT id, name, phone, type, created_at FROM users WHERE type = ?';
  const params: any[] = ['customer'];
  if (shopId) { query += ' AND shop_id = ?'; params.push(shopId); }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await c.env.DB.prepare(query).bind(...params).all();
  return c.json({ data: result.results, page, limit });
});

// 获取会员详情
app.get('/api/crm/members/:id', async (c) => {
  const { id } = c.req.param();
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(id).first();

  if (!user) return c.json({ error: '用户不存在' }, 404);

  // 获取诊断记录
  const diagnoses = await c.env.DB.prepare(
    'SELECT * FROM diagnoses WHERE user_id = ? ORDER BY created_at DESC LIMIT 5'
  ).bind(id).all();

  // 获取订单历史
  const orders = await c.env.DB.prepare(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 10'
  ).bind(id).all();

  return c.json({ ...user, diagnoses: diagnoses.results, orders: orders.results });
});

// 获取门店列表
app.get('/api/shops', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT s.*, (SELECT COUNT(*) FROM users WHERE shop_id = s.id) as staff_count FROM shops s ORDER BY s.created_at DESC'
  ).all();
  return c.json({ data: result.results });
});

// 创建门店
app.post('/api/shops', async (c) => {
  const body = await c.req.json();
  const result = await c.env.DB.prepare(
    'INSERT INTO shops (name, address, contact_name, contact_phone, profit_rate) VALUES (?, ?, ?, ?, ?) RETURNING id'
  ).bind(body.name, body.address, body.contact_name, body.contact_phone, body.profit_rate || 0.6).first();

  return c.json({ success: true, id: result?.id });
});

// 门店详情
app.get('/api/shops/:id', async (c) => {
  const shop = await c.env.DB.prepare('SELECT * FROM shops WHERE id = ?').bind(c.req.param('id')).first();
  if (!shop) return c.json({ error: '门店不存在' }, 404);

  const staff = await c.env.DB.prepare('SELECT id, name, phone, type FROM users WHERE shop_id = ? AND type IN (?, ?)')
    .bind(c.req.param('id'), 'staff', 'shop').all();

  return c.json({ ...shop, staff: staff.results });
});

export default app;
