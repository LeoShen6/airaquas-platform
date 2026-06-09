// ═══════════════════════════════════════════════════════════════
//  detect-service.ts — AI 头皮检测核心服务
//  支持双 Provider：Workers AI (default) / DashScope Qwen-VL (阿里云百炼)
//  图片处理 → AI 分析(主) → AI 分析(备) → 规则引擎 → D1 存储
// ═══════════════════════════════════════════════════════════════

interface Env {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
  AI: Ai;
  AI_PROVIDER?: string;         // "workers-ai" | "dashscope"
  DASHSCOPE_API_KEY?: string;   // 阿里云百炼 API Key
}

// ===== AI 分析提示词 =====
const SYSTEM_PROMPT = `你是一位专业的头皮健康分析师。分析用户上传的头皮照片，返回严格的 JSON 格式评估结果。

评估 5 个维度（每项 0-100）：
1. 油脂分泌 (oil)：头皮油脂分泌程度，越油数值越高
2. 水分含量 (moisture)：头皮水分保持能力，越干数值越低  
3. 发量密度 (density)：毛囊密度和头发覆盖率
4. 头皮屏障 (barrier)：头皮健康状态（红斑/炎症/敏感度）
5. 毛囊健康 (follicle)：毛囊开口和发根状态

返回格式（严格 JSON，不要 markdown 代码块）：
{"oil":75,"moisture":60,"density":55,"barrier":80,"follicle":70,"hair_type":"油性头皮","findings":["发现1","发现2"],"tips":["建议1","建议2"]}

hair_type 取值: 油性头皮 | 干性头皮 | 混合性头皮 | 敏感性头皮 | 健康头皮
confidence 取值: 0.0-1.0

如果无法分析（不是头皮照片），返回 {"error":"无法识别为头皮照片","confidence":0}`;

// ===== DashScope Qwen-VL API (阿里云百炼) =====
const DASHSCOPE_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

async function callDashScope(imageBase64: string, apiKey: string): Promise<any> {
  const body = {
    model: 'qwen-vl-plus',
    input: {
      messages: [{
        role: 'user',
        content: [
          { image: `data:image/jpeg;base64,${imageBase64}` },
          { text: '请分析这张头皮照片，只返回 JSON 格式评估结果：\n{"oil":0-100,"moisture":0-100,"density":0-100,"barrier":0-100,"follicle":0-100,"hair_type":"类型","findings":["发现"],"tips":["建议"]}' },
        ],
      }],
    },
    parameters: { temperature: 0.1, max_tokens: 512 },
  };

  const resp = await fetch(DASHSCOPE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`DashScope HTTP ${resp.status}: ${text.substring(0, 200)}`);
  }

  const data: any = await resp.json();
  const output = data.output;
  if (!output?.choices?.length) throw new Error('DashScope 无返回结果');

  const content = output.choices[0]?.message?.content || '';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('DashScope 返回非 JSON');
  return JSON.parse(jsonMatch[0]);
}

// ===== Workers AI (LLaMA Vision) =====
async function callWorkersAI(imageBase64: string, env: Env): Promise<any> {
  const dataUri = `data:image/jpeg;base64,${imageBase64}`;
  const aiResponse = await env.AI.run(
    '@cf/meta/llama-3.2-11b-vision-instruct',
    {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: dataUri } },
            { type: 'text', text: '请分析这张头皮照片，返回 JSON 格式的评估结果。' },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0.1,
    },
    { signal: AbortSignal.timeout(30000) }
  );

  const raw = (aiResponse as any).response || '';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Workers AI 输出未包含有效 JSON');
  const parsed = JSON.parse(jsonMatch[0]);
  if (parsed.error) throw new Error(parsed.error);
  return parsed;
}

// ===== 规则引擎（兜底） =====
function fallbackResult(): any {
  return {
    oil: 70, moisture: 60, density: 65, barrier: 68, follicle: 66,
    hair_type: '混合性头皮',
    findings: ['建议到店进行专业头皮检测'],
    tips: ['用氨基酸表活温和清洁', '每2-3天洗一次', '保持规律作息'],
  };
}

// ===== 5 维度 → 综合评分 + 推荐产品 =====
function computeResult(aiResult: any, imageKey: string) {
  const dims = [
    { label: '油脂分泌', key: 'oil', score: clamp(aiResult.oil ?? 70, 0, 100) },
    { label: '水分含量', key: 'moisture', score: clamp(aiResult.moisture ?? 65, 0, 100) },
    { label: '发量密度', key: 'density', score: clamp(aiResult.density ?? 60, 0, 100) },
    { label: '头皮屏障', key: 'barrier', score: clamp(aiResult.barrier ?? 75, 0, 100) },
    { label: '毛囊健康', key: 'follicle', score: clamp(aiResult.follicle ?? 70, 0, 100) },
  ];

  // 综合评分 = 加权平均
  const weights = { oil: 30, moisture: 20, density: 25, barrier: 15, follicle: 10 };
  let weightedSum = 0, totalW = 0;
  for (const d of dims) {
    weightedSum += d.score * (weights[d.key as keyof typeof weights] || 20);
    totalW += weights[d.key as keyof typeof weights] || 20;
  }

  return {
    score: Math.round(weightedSum / totalW),
    hair_type: aiResult.hair_type || '混合性头皮',
    dimensions: dims,
    findings: (Array.isArray(aiResult.findings) ? aiResult.findings : generateFindings(dims)).slice(0, 5),
    tips: (Array.isArray(aiResult.tips) ? aiResult.tips : generateTips(aiResult.hair_type, dims)).slice(0, 5),
    products: recommendProducts(aiResult.hair_type || '混合性头皮', dims).slice(0, 3),
    confidence: Math.min(1, Math.max(0, aiResult.confidence ?? 0.7)),
    image_key: imageKey,
  };
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function generateFindings(dims: { key: string; score: number }[]): string[] {
  const f: string[] = [];
  if (dims[0].score >= 70) f.push('发根油脂分泌明显，毛囊周围有油光附着');
  else if (dims[0].score <= 40) f.push('头皮油脂分泌不足，屏障可能受损');
  if (dims[1].score <= 45) f.push('头皮水分含量偏低，可见轻微干燥鳞屑');
  if (dims[2].score <= 50) f.push('发量密度偏低，毛囊间距较大');
  if (dims[3].score <= 50) f.push('头皮屏障功能下降，可见泛红或敏感区域');
  if (dims[4].score <= 50) f.push('部分毛囊开口状态不佳');
  if (!f.length) f.push('头皮整体状态良好');
  return f;
}

function generateTips(hairType: string, dims: { key: string; score: number }[]): string[] {
  const tips: string[] = [];
  if (hairType === '油性头皮' || dims[0].score >= 70) {
    tips.push('建议使用氨基酸表活洗发水，避免强力去油产品破坏屏障');
    tips.push('每 2-3 天洗一次，逐步延长间隔，训练头皮适应');
  }
  if (hairType === '敏感性头皮' || dims[3].score <= 50) {
    tips.push('暂停使用含香精和酒精的产品，选用敏感性专用产品');
  }
  tips.push('洗头水温控制在 38℃ 左右，指腹按摩不要用指甲抓');
  tips.push('保持规律作息，减少高糖高脂饮食');
  return tips;
}

function recommendProducts(hairType: string, dims: { key: string; score: number }[]): any[] {
  const p: any[] = [];
  if (hairType === '油性头皮' || dims[0].score >= 68) p.push({ name: '控油洗发露', desc: '氨基酸表活，控油48h', price: 128 });
  if (dims[1].score <= 45 || hairType === '干性头皮') p.push({ name: '修护发膜', desc: '角蛋白精华，深层滋养', price: 158 });
  if (dims[3].score <= 50 || hairType === '敏感性头皮') p.push({ name: '头皮精华液', desc: '红参提取物，舒缓修护', price: 198 });
  if (!p.length) p.push({ name: '控油洗发露', desc: '氨基酸表活', price: 128 }, { name: '护发精油', desc: '摩洛哥坚果油', price: 138 });
  return p;
}

// ===== 图片哈希去重 =====
async function imageHash(buffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===== 选择 AI Provider =====
async function callAiProvider(imageBase64: string, env: Env): Promise<any> {
  const provider = env.AI_PROVIDER || 'workers-ai';
  const errors: string[] = [];

  // 主 provider
  try {
    if (provider === 'dashscope' && env.DASHSCOPE_API_KEY) {
      console.log(`[detect] Using DashScope Qwen-VL (primary)`);
      return await callDashScope(imageBase64, env.DASHSCOPE_API_KEY);
    } else {
      console.log(`[detect] Using Workers AI (primary)`);
      return await callWorkersAI(imageBase64, env);
    }
  } catch (e: any) {
    errors.push(`[${provider}] ${e.message}`);
    console.error(`[detect] Primary AI (${provider}) failed:`, e.message);
  }

  // 备用 provider（DashScope ⇄ Workers AI 互换）
  const fallbackProvider = provider === 'dashscope' ? 'workers-ai' : 'dashscope';
  const hasFallbackKey = fallbackProvider === 'dashscope' ? !!env.DASHSCOPE_API_KEY : true;

  if (hasFallbackKey) {
    try {
      console.log(`[detect] Falling back to ${fallbackProvider}`);
      if (fallbackProvider === 'dashscope') {
        return await callDashScope(imageBase64, env.DASHSCOPE_API_KEY!);
      } else {
        return await callWorkersAI(imageBase64, env);
      }
    } catch (e: any) {
      errors.push(`[${fallbackProvider}] ${e.message}`);
      console.error(`[detect] Fallback AI (${fallbackProvider}) also failed:`, e.message);
    }
  }

  // 全部失败 → 规则引擎兜底
  console.error(`[detect] All AI providers failed:`, errors.join('; '));
  return null;
}

// ===== 主检测流程 =====
export async function handleDetect(request: Request, env: Env): Promise<Response> {
  const contentType = request.headers.get('content-type') || '';

  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/json')) {
    return Response.json({ code: 400, message: '请上传图片文件或 JSON' }, { status: 400 });
  }

  let imageBuffer: ArrayBuffer;
  let sessionId: string;

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    const file = form.get('image');
    sessionId = (form.get('session_id') as string) || crypto.randomUUID();
    if (!file || !(file instanceof File)) {
      return Response.json({ code: 400, message: '缺少图片文件' }, { status: 400 });
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return Response.json({ code: 400, message: '仅支持 JPEG/PNG/WebP 格式' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ code: 400, message: '图片不能超过 10MB' }, { status: 400 });
    }
    imageBuffer = await file.arrayBuffer();
  } else {
    const body = await request.json() as any;
    sessionId = body.session_id || crypto.randomUUID();
    const b64 = body.image;
    if (!b64) return Response.json({ code: 400, message: '缺少图片数据' }, { status: 400 });
    const raw = atob(b64.replace(/^data:image\/\w+;base64,/, ''));
    imageBuffer = new Uint8Array(raw.length).map((_, i) => raw.charCodeAt(i)).buffer;
  }

  // 去重检测
  const hash = await imageHash(imageBuffer);
  const cached = await env.KV.get(`detect:${hash}`, 'json').catch(() => null);
  if (cached) {
    console.log(`[detect] Cache HIT for ${hash}`);
    return Response.json({ code: 0, data: cached, cached: true });
  }

  // 保存原图到 R2
  const imageKey = `detect/${hash}.jpg`;
  await env.R2.put(imageKey, imageBuffer, {
    httpMetadata: { contentType: 'image/jpeg' },
    customMetadata: { sessionId, uploadedAt: new Date().toISOString() },
  }).catch((e) => console.error(`[detect] R2 save failed:`, e.message));

  // AI 分析
  const b64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
  const provider = env.AI_PROVIDER || 'workers-ai';
  let aiResult = await callAiProvider(b64, env);

  // 规则引擎兜底
  if (!aiResult) {
    aiResult = fallbackResult();
  }

  const result = computeResult(aiResult, imageKey);

  // KV 缓存 (5min — 重复图片免走 AI 全链路)
  await env.KV.put(`detect:${hash}`, JSON.stringify(result), { expirationTtl: 300 }).catch(() => {});

  // D1 存储（含 provider 字段追踪来源）
  await env.DB.prepare(
    `INSERT INTO detections (session_id, image_key, score, hair_type, dimensions, findings, tips, products, confidence, model_version, provider, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'v1.0', ?, datetime('now', '+24 hours'))`
  ).bind(
    sessionId, imageKey, result.score, result.hair_type,
    JSON.stringify(result.dimensions), JSON.stringify(result.findings),
    JSON.stringify(result.tips), JSON.stringify(result.products),
    result.confidence, provider,
  ).run().catch(e => console.error(`[detect] D1 save failed:`, e.message));

  return Response.json({
    code: 0,
    data: { id: crypto.randomUUID().slice(0, 12), ...result, created_at: new Date().toISOString() },
  });
}

// ===== 查询检测历史 =====
export async function handleDetectHistory(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  const userId = url.searchParams.get('user_id');
  const limit = Math.min(50, parseInt(url.searchParams.get('limit') || '10'));
  const offset = parseInt(url.searchParams.get('offset') || '0');

  try {
    let query = 'SELECT id, score, hair_type, dimensions, findings, tips, products, confidence, provider, created_at FROM detections WHERE 1=1';
    const params: any[] = [];
    if (sessionId) { query += ' AND session_id = ?'; params.push(sessionId); }
    if (userId) { query += ' AND user_id = ?'; params.push(userId); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await env.DB.prepare(query).bind(...params).all();
    
    // Count query — handle both with/without filters
    let countQuery = 'SELECT COUNT(*) as count FROM detections';
    const countParams: any[] = [];
    const conditions: string[] = [];
    if (sessionId) { conditions.push('session_id = ?'); countParams.push(sessionId); }
    if (userId) { conditions.push('user_id = ?'); countParams.push(userId); }
    if (conditions.length) countQuery += ' WHERE ' + conditions.join(' AND ');
    
    const total = await env.DB.prepare(countQuery).bind(...countParams).first();

    return Response.json({
      code: 0,
      data: {
        items: result.results.map((r: any) => ({
          ...r,
          dimensions: JSON.parse(r.dimensions || '[]'),
          findings: JSON.parse(r.findings || '[]'),
          tips: JSON.parse(r.tips || '[]'),
          products: JSON.parse(r.products || '[]'),
        })),
        total: (total as any)?.count || 0, limit, offset,
      },
    });
  } catch (e: any) {
    console.error('[detect/history] DB error:', e.message);
    // Table might not exist yet — return empty results gracefully
    return Response.json({
      code: 0,
      data: { items: [], total: 0, limit, offset },
      warning: '检测历史暂不可用：' + e.message,
    });
  }
}
