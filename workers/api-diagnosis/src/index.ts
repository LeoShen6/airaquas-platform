import { Hono } from 'hono';
import { cors } from 'hono/cors';

type AIResult = { response?: string };
type Bindings = {
  DB: D1Database;
  AI: { run: (model: string, opts: Record<string, unknown>) => Promise<AIResult> };
};

const MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', async (c) => {
  try {
    const r = await c.env.AI.run(MODEL, {
      messages: [{ role: 'user', content: 'say hi' }],
      max_tokens: 5,
    });
    return c.json({ service: 'airaquas-diagnosis', version: '4.0', ai_ready: true, model: MODEL });
  } catch (e: any) {
    return c.json({ service: 'airaquas-diagnosis', version: '4.0', ai_ready: false, error: String(e.message || e) });
  }
});

// Extract JSON from AI response (handles markdown code blocks)
function parseAI(text: string): any {
  if (!text) return null;
  // Try markdown code block first
  const block = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (block) return safeParse(block[1]);
  // Try plain JSON
  const plain = text.match(/\{[\s\S]*?\}/);
  if (plain) return safeParse(plain[0]);
  return null;
}

function safeParse(s: string): any {
  try { return JSON.parse(s); } catch { return null; }
}

// Rule engine fallback
function fallbackEngine(answers: Record<string, string>) {
  const dec = { oily: 3, dry: 2, sensitive: 4, hair_loss: 5 };
  const names = { oily: '油性头皮', dry: '干性头皮', sensitive: '敏感性头皮', normal: '健康头皮' };
  const descs = { oily: '皮脂分泌旺盛，建议控油清爽型产品，保持头皮洁净。', dry: '头皮干燥紧绷，建议修护滋养型产品，注重补水。', sensitive: '头皮屏障脆弱，建议舒缓修复型产品，减少刺激。', normal: '头皮水油平衡，状态健康，日常养护即可。' };
  const prods = { oily: ['控油洗发水', '头皮平衡精华'], dry: ['修护洗发水', '滋养精华液'], sensitive: ['舒缓洗发水', '修护精华'], normal: ['日常养护洗发水'] };
  let score = 80, mt = 'normal', mv = 0;
  for (const [k, p] of Object.entries(dec)) { const v = parseInt(answers[k] || '0'); score -= v * p; if (v > mv) { mv = v; mt = k === 'hair_loss' ? 'sensitive' : k; } }
  if (mv < 2) mt = 'normal';
  score = Math.max(10, Math.min(100, score));
  return { score, type: names[mt], diagnosis: descs[mt], products: prods[mt], advice: '建议定期到院做专业头皮检测' };
}

// AI diagnosis
async function callAI(answers: Record<string, string>, env: Bindings): Promise<any> {
  const msg = `你是一位专业的中文头皮健康顾问。请根据以下数据生成诊断报告（仅回复JSON）：\n\n出油${answers.oily||0}/4, 干燥${answers.dry||0}/4, 敏感${answers.sensitive||0}/4, 脱发${answers.hair_loss||0}/4\n\nJSON: {"score":0-100,"type":"油性|干性|敏感|混合|健康","diag":"中文诊断描述","advice":"中文护理建议","prods":["中文产品名1","中文产品名2","中文产品名3"]}`;

  const r = await env.AI.run(MODEL, {
    messages: [{ role: 'user', content: msg }],
    max_tokens: 300,
    temperature: 0.3,
  });

  const d = parseAI(r.response || '');
  if (!d || d.score === undefined) return null;

  const validTypes = ['油性头皮','干性头皮','敏感性头皮','混合性头皮','健康头皮'];
  const t = validTypes.includes(d.type) ? d.type : '混合性头皮';

  return {
    score: Math.max(10, Math.min(100, Number(d.score) || 60)),
    type: t,
    diagnosis: d.diag || d.d || '',
    advice: d.advice || d.a || '建议到院进行专业头皮检测',
    products: d.prods || d.p || ['日常养护洗发水'],
  };
}

app.post('/api/diagnosis', async (c) => {
  const { user_id, shop_id, answers } = await c.req.json();
  if (!user_id || !answers) return c.json({ error: '缺少必要信息' }, 400);

  // Try AI first
  let result = null;
  try { result = await callAI(answers, c.env); } catch {}

  // Fallback to rule engine
  const res = result || fallbackEngine(answers);

  // Save to D1
  try {
    await c.env.DB.prepare(
      'INSERT INTO diagnoses (user_id,shop_id,score,scalp_type,recommendation) VALUES (?,?,?,?,?)'
    ).bind(user_id, shop_id || null, res.score, res.type, JSON.stringify(res)).run();
  } catch {}

  return c.json({
    success: true,
    score: res.score,
    scalp_type: res.type,
    diagnosis: res.diagnosis,
    advice: res.advice,
    products: res.products,
    ai_generated: !!result,
  });
});

export default app;
