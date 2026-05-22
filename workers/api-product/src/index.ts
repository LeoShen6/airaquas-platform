import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database };

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-product' }));

// 产品列表（按品类/标签筛选）
app.get('/api/products', async (c) => {
  const { category, tag, keyword } = c.req.query();
  let sql = 'SELECT p.* FROM products p WHERE p.status = ?';
  const params: any[] = ['active'];

  if (category) { sql += ' AND p.category = ?'; params.push(category); }
  if (keyword) { sql += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  sql += ' ORDER BY p.price ASC';

  const data = await c.env.DB.prepare(sql).bind(...params).all();

  // If filtering by tag, post-filter
  let results = data.results;
  if (tag) {
    const tagged = await c.env.DB.prepare(
      'SELECT product_id FROM product_tags WHERE tag = ?'
    ).bind(tag).all();
    const taggedIds = new Set(tagged.results.map((r: any) => r.product_id));
    results = results.filter((r: any) => taggedIds.has(r.id));
  }

  return c.json({ data: results, total: results.length });
});

// 产品详情
app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  const product = await c.env.DB.prepare(
    'SELECT p.*, GROUP_CONCAT(t.tag, \',\') as tags FROM products p LEFT JOIN product_tags t ON t.product_id = p.id WHERE p.id = ? GROUP BY p.id'
  ).bind(id).first();
  if (!product) return c.json({ error: '产品不存在' }, 404);
  return c.json(product);
});

// 按发质类型推荐产品（用于 AI 诊断结果匹配）
app.get('/api/products/match/:scalp_type', async (c) => {
  const type = c.req.param('scalp_type');
  const data = await c.env.DB.prepare(
    'SELECT p.* FROM products p JOIN product_tags t ON t.product_id = p.id WHERE t.tag = ? AND p.status = ? ORDER BY p.price ASC'
  ).bind(type, 'active').all();
  return c.json({ data: data.results });
});

// 全部标签
app.get('/api/tags', async (c) => {
  const data = await c.env.DB.prepare(
    'SELECT DISTINCT tag FROM product_tags ORDER BY tag'
  ).all();
  return c.json({ data: data.results.map((r: any) => r.tag) });
});

export default app;
