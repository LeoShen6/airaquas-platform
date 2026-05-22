import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database; R2: R2Bucket };
const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-diagnosis' }));

const SCALP_TYPES = {
  'oily': { name: '油性头皮', desc: '皮脂分泌旺盛，易有头屑', products: ['控油洗发水', '头皮平衡精华'] },
  'dry': { name: '干性头皮', desc: '头皮干燥紧绷，易敏感', products: ['修护洗发水', '滋养精华'] },
  'sensitive': { name: '敏感性头皮', desc: '头皮屏障受损，易发红刺痒', products: ['舒缓洗发水', '修护精华'] },
  'normal': { name: '健康头皮', desc: '水油平衡，状态良好', products: ['日常养护洗发水'] },
  'hair-loss': { name: '脱发倾向', desc: '毛囊活力下降', products: ['防脱洗发水', '育发精华', '头皮按摩精华'] },
};

// 提交诊断问卷
app.post('/api/diagnosis', async (c) => {
  const { user_id, shop_id, answers } = await c.req.json();
  if (!user_id || !answers) return c.json({ error: '缺少必要信息' }, 400);

  // 简易规则引擎
  let score = 80;
  let oily = 0, dry = 0, sensitive = 0, hairLoss = 0;

  if (answers.oily) { oily = parseInt(answers.oily); score -= oily * 3; }
  if (answers.dry) { dry = parseInt(answers.dry); score -= dry * 2; }
  if (answers.sensitive) { sensitive = parseInt(answers.sensitive); score -= sensitive * 4; }
  if (answers.hair_loss) { hairLoss = parseInt(answers.hair_loss); score -= hairLoss * 5; }
  score = Math.max(10, Math.min(100, score));

  let scalpType = 'normal';
  const scores = [
    { type: 'oily', val: oily },
    { type: 'dry', val: dry },
    { type: 'sensitive', val: sensitive },
    { type: 'hair-loss', val: hairLoss },
  ];
  const max = scores.reduce((a, b) => a.val > b.val ? a : b);
  if (max.val >= 3) scalpType = max.type;

  const info = SCALP_TYPES[scalpType] || SCALP_TYPES.normal;
  const recommendation = `您的头皮状况为：${info.name}。${info.desc}。建议使用：${info.products.join('、')}`;

  // 存储诊断记录
  const result = await c.env.DB.prepare(
    'INSERT INTO diagnoses (user_id, shop_id, score, scalp_type, recommendation, questionnaire) VALUES (?, ?, ?, ?, ?, ?) RETURNING id'
  ).bind(user_id, shop_id || null, score, scalpType, recommendation, JSON.stringify(answers)).first();

  return c.json({
    success: true, id: result?.id, score, scalp_type: scalpType,
    diagnosis: info, recommendation,
  });
});

// 获取诊断历史
app.get('/api/diagnosis/user/:user_id', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT * FROM diagnoses WHERE user_id = ? ORDER BY created_at DESC LIMIT 10'
  ).bind(c.req.param('user_id')).all();
  return c.json({ data: result.results });
});

// 获取诊断详情
app.get('/api/diagnosis/:id', async (c) => {
  const d = await c.env.DB.prepare('SELECT * FROM diagnoses WHERE id = ?').bind(c.req.param('id')).first();
  return d ? c.json(d) : c.json({ error: '诊断记录不存在' }, 404);
});

export default app;
// CI trigger
