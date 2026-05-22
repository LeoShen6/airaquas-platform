import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database; R2: R2Bucket };
const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-marketing' }));

// 获取营销素材列表
app.get('/api/marketing/assets', async (c) => {
  const { type, page = '1', limit = '20' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let query = 'SELECT * FROM marketing_assets WHERE 1=1';
  const params: any[] = [];
  if (type) { query += ' AND type = ?'; params.push(type); }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const result = await c.env.DB.prepare(query).bind(...params).all();
  return c.json({ data: result.results, page: parseInt(page) });
});

// 创建营销素材
app.post('/api/marketing/assets', async (c) => {
  const body = await c.req.json();
  const result = await c.env.DB.prepare(
    'INSERT INTO marketing_assets (title, type, content, image_url, tags) VALUES (?, ?, ?, ?, ?) RETURNING id'
  ).bind(body.title, body.type, body.content, body.image_url, JSON.stringify(body.tags || [])).first();
  return c.json({ success: true, id: result?.id });
});

// 生成促销文案（AIGC 模板）
app.post('/api/marketing/generate', async (c) => {
  const { type, product_name, shop_name } = await c.req.json();
  const templates = {
    'poster': `🌟 ${shop_name} 限时特惠！\n${product_name}火热销售中\n到店体验，专业头皮检测免费做！`,
    'copy': `💇 告别头皮烦恼！${product_name}，${shop_name}专业推荐\n✅ 温和配方 ✅ 效果显著\n👇 扫码预约免费检测`,
    'coupon': `🎉 ${shop_name}新客专享\n${product_name} 立减优惠\n限时领取，手慢无！`,
  };
  const content = templates[type] || templates.poster;
  return c.json({ content, type, generated_at: new Date().toISOString() });
});

export default app;
