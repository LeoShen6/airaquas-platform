import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database };
const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-inventory' }));

// 门店库存看板
app.get('/api/inventory/:shop_id', async (c) => {
  const { shop_id } = c.req.param();
  const result = await c.env.DB.prepare(`
    SELECT i.*, p.name as product_name, p.category, p.price,
      CASE WHEN i.expire_date <= datetime('now', '+30 days') THEN 1 ELSE 0 END as expiring_soon
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    WHERE i.shop_id = ? AND i.quantity > 0
    ORDER BY i.expire_date ASC
  `).bind(shop_id).all();

  return c.json({ data: result.results });
});

// 低库存预警
app.get('/api/inventory/alerts/:shop_id', async (c) => {
  const threshold = parseInt(c.req.query('threshold') || '10');
  const result = await c.env.DB.prepare(`
    SELECT i.*, p.name as product_name, p.price
    FROM inventory i JOIN products p ON i.product_id = p.id
    WHERE i.shop_id = ? AND i.quantity < ?
    ORDER BY i.quantity ASC
  `).bind(c.req.param('shop_id'), threshold).all();

  return c.json({ data: result.results, threshold });
});

// 临期预警（30天内过期）
app.get('/api/inventory/expiring/:shop_id', async (c) => {
  const days = parseInt(c.req.query('days') || '30');
  const result = await c.env.DB.prepare(`
    SELECT i.*, p.name as product_name, p.price
    FROM inventory i JOIN products p ON i.product_id = p.id
    WHERE i.shop_id = ? AND i.expire_date <= datetime('now', '+' || ? || ' days') AND i.quantity > 0
    ORDER BY i.expire_date ASC
  `).bind(c.req.param('shop_id'), days).all();

  return c.json({ data: result.results });
});

export default app;
