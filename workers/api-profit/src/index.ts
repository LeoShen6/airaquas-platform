import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database };
const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-profit' }));

// 创建分润
app.post('/api/commissions', async (c) => {
  const { order_id, shop_id, staff_id, type, amount, rate } = await c.req.json();
  const result = await c.env.DB.prepare(
    'INSERT INTO commissions (order_id, shop_id, staff_id, type, amount, rate) VALUES (?, ?, ?, ?, ?, ?) RETURNING id'
  ).bind(order_id, shop_id, staff_id, type, amount, rate).first();
  return c.json({ success: true, id: result?.id });
});

// 门店收益汇总
app.get('/api/commissions/shop/:shop_id', async (c) => {
  const result = await c.env.DB.prepare(`
    SELECT 
      COALESCE(SUM(CASE WHEN settled = 1 THEN amount ELSE 0 END), 0) as settled,
      COALESCE(SUM(CASE WHEN settled = 0 THEN amount ELSE 0 END), 0) as pending,
      COUNT(*) as total_transactions
    FROM commissions WHERE shop_id = ?
  `).bind(c.req.param('shop_id')).first();
  return c.json(result);
});

// 店员收益
app.get('/api/commissions/staff/:staff_id', async (c) => {
  const result = await c.env.DB.prepare(`
    SELECT c.*, o.order_no, o.created_at as order_date
    FROM commissions c
    LEFT JOIN orders o ON c.order_id = o.id
    WHERE c.staff_id = ?
    ORDER BY c.created_at DESC LIMIT 50
  `).bind(c.req.param('staff_id')).all();
  return c.json({ data: result.results });
});

// 结算
app.post('/api/commissions/settle/:shop_id', async (c) => {
  await c.env.DB.prepare(
    'UPDATE commissions SET settled = 1, settled_at = datetime(\'now\') WHERE shop_id = ? AND settled = 0'
  ).bind(c.req.param('shop_id')).run();
  return c.json({ success: true });
});

export default app;
