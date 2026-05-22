import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database };

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-diagnosis', version: '2.0' }));

app.post('/api/diagnosis', async (c) => {
  const body = await c.req.json();
  const { user_id, shop_id, answers } = body;
  if (!user_id || !answers) return c.json({ error: '缺少必要信息' }, 400);

  // 规则引擎
  const penalties: Record<string, number> = { oily: 3, dry: 2, sensitive: 4, hair_loss: 5 };
  const typeNames: Record<string, string> = {
    oily: '油性头皮', dry: '干性头皮', sensitive: '敏感性头皮', normal: '健康头皮'
  };
  const typeDesc: Record<string, string> = {
    oily: '皮脂分泌旺盛，建议使用控油类产品，保持头皮清爽',
    dry: '头皮干燥紧绷，建议使用修护滋养类产品',
    sensitive: '头皮屏障受损，建议使用舒缓修复类产品',
    normal: '水油平衡，状态良好，日常养护即可',
  };

  let score = 80, maxType = 'normal', maxVal = 0;
  for (const [k, p] of Object.entries(penalties)) {
    const v = parseInt(answers[k] || '0');
    score -= v * p;
    if (v > maxVal) { maxVal = v; maxType = k === 'hair_loss' ? 'sensitive' : k; }
  }
  if (maxVal < 2) maxType = 'normal';
  score = Math.max(10, Math.min(100, score));

  // 推荐产品
  const productMap: Record<string, string[]> = {
    oily: ['控油洗发水', '头皮平衡精华'],
    dry: ['修护洗发水', '滋养精华液'],
    sensitive: ['舒缓洗发水', '修护精华'],
    normal: ['日常养护洗发水'],
  };

  const scalpType = typeNames[maxType] || '健康头皮';
  const recommendation = typeDesc[maxType] || typeDesc.normal;
  const products = productMap[maxType] || productMap.normal;

  // 存入数据库
  await c.env.DB.prepare(
    'INSERT INTO diagnoses (user_id, shop_id, score, scalp_type, recommendation) VALUES (?, ?, ?, ?, ?)'
  ).bind(
    user_id, shop_id || null, score, scalpType,
    JSON.stringify({ recommendation, products })
  ).run();

  return c.json({
    success: true,
    score,
    scalp_type: scalpType,
    diagnosis: recommendation,
    products,
  });
});

export default app;
