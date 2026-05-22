import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database };
const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-report' }));

// 总览仪表盘
app.get('/api/report/dashboard', async (c) => {
  const shopId = c.req.query('shop_id');
  const shopFilter = shopId ? 'WHERE shop_id = ?' : '';
  const params: any[] = shopId ? [shopId] : [];

  const totalUsers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
  const totalShops = await c.env.DB.prepare('SELECT COUNT(*) as count FROM shops').first();

  const q1 = `SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM orders ${shopFilter}`;
  const totalOrders = await c.env.DB.prepare(q1).bind(...params).first();

  const q2 = `SELECT COALESCE(SUM(amount),0) as pending FROM commissions WHERE settled = 0 ${shopId ? 'AND shop_id = ?' : ''}`;
  const pendingCommissions = await c.env.DB.prepare(q2).bind(...params).first();

  return c.json({
    total_users: totalOrders?.count || 0,
    total_shops: totalShops?.count || 0,
    total_orders: totalOrders?.count || 0,
    revenue: totalOrders?.revenue || 0,
    pending_commissions: pendingCommissions?.pending || 0,
  });
});

// 每日运营报表
app.get('/api/report/daily', async (c) => {
  const days = parseInt(c.req.query('days') || '7');
  const shopId = c.req.query('shop_id');

  let filter = `created_at >= datetime('now', '-' || ? || ' days')`;
  let params: any[] = [days];
  if (shopId) { filter += ' AND shop_id = ?'; params.push(shopId); }

  const orders = await c.env.DB.prepare(
    `SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total) as revenue FROM orders WHERE ${filter} GROUP BY DATE(created_at) ORDER BY date`
  ).bind(...params).all();

  const diagnoses = await c.env.DB.prepare(
    `SELECT DATE(created_at) as date, COUNT(*) as count FROM diagnoses WHERE ${filter} GROUP BY DATE(created_at) ORDER BY date`
  ).bind(...params).all();

  return c.json({ orders: orders.results, diagnoses: diagnoses.results });
});

// 门店销售排行
app.get('/api/report/shop-ranking', async (c) => {
  const result = await c.env.DB.prepare(`
    SELECT s.name, s.id, COUNT(o.id) as orders, COALESCE(SUM(o.total),0) as revenue
    FROM shops s LEFT JOIN orders o ON s.id = o.shop_id
    GROUP BY s.id ORDER BY revenue DESC LIMIT 10
  `).all();
  return c.json({ data: result.results });
});

// 商品销售排行
app.get('/api/report/product-ranking', async (c) => {
  const result = await c.env.DB.prepare(`
    SELECT p.name, p.category, SUM(oi.quantity) as sold, SUM(oi.subtotal) as revenue
    FROM order_items oi JOIN products p ON oi.product_id = p.id
    GROUP BY p.id ORDER BY sold DESC LIMIT 10
  `).all();
  return c.json({ data: result.results });
});

export default app;
