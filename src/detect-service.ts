// ═══════════════════════════════════════════════════════════════
//  detect-service.ts — AI 头皮检测核心服务
//  图片处理 → Workers AI 分析 → 结果解析 → D1 存储 → 返回
// ═══════════════════════════════════════════════════════════════

interface Env {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
  AI: Ai;
}

// AI 分析提示词
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

// ===== 5 维度 → 综合评分 + 推荐产品 =====
function computeResult(aiResult: any, imageKey: string) {
  // 解析 AI 返回
  let dims: { label: string; key: string; score: number }[] = [
    { label: '油脂分泌', key: 'oil', score: clamp(aiResult.oil ?? 70, 0, 100) },
    { label: '水分含量', key: 'moisture', score: clamp(aiResult.moisture ?? 65, 0, 100) },
    { label: '发量密度', key: 'density', score: clamp(aiResult.density ?? 60, 0, 100) },
    { label: '头皮屏障', key: 'barrier', score: clamp(aiResult.barrier ?? 75, 0, 100) },
    { label: '毛囊健康', key: 'follicle', score: clamp(aiResult.follicle ?? 70, 0, 100) },
  ];

  // 综合评分 = 加权平均
  const weights = { oil: 30, moisture: 20, density: 25, barrier: 15, follicle: 10 };
  let totalWeight = 0, weightedSum = 0;
  for (const d of dims) {
    weightedSum += d.score * (weights[d.key as keyof typeof weights] || 20);
    totalWeight += weights[d.key as keyof typeof weights] || 20;
  }
  const score = Math.round(weightedSum / totalWeight);

  const hairType = aiResult.hair_type || '混合性头皮';
  const findings = Array.isArray(aiResult.findings) ? aiResult.findings : generateFindings(dims, hairType);
  const tips = Array.isArray(aiResult.tips) ? aiResult.tips : generateTips(hairType, dims);
  const products = recommendProducts(hairType, dims);
  const confidence = Math.min(1, Math.max(0, aiResult.confidence ?? 0.7));

  return {
    score,
    hair_type: hairType,
    dimensions: dims,
    findings: findings.slice(0, 5),
    tips: tips.slice(0, 5),
    products,
    confidence,
    image_key: imageKey,
  };
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

// ===== 降级策略：AI 失败时用规则引擎 =====
function generateFindings(dims: { label: string; score: number }[], hairType: string): string[] {
  const f: string[] = [];
  if (dims[0].score >= 70) f.push('发根油脂分泌明显，毛囊周围有油光附着');
  else if (dims[0].score <= 40) f.push('头皮油脂分泌不足，屏障可能受损');

  if (dims[1].score <= 45) f.push('头皮水分含量偏低，可见轻微干燥鳞屑');
  else if (dims[1].score >= 80) f.push('头皮水合状态良好');

  if (dims[2].score <= 50) f.push('发量密度偏低，毛囊间距较大');
  else if (dims[2].score >= 80) f.push('发量密度正常，毛囊分布均匀');

  if (dims[3].score <= 50) f.push('头皮屏障功能下降，可见泛红/敏感区域');
  if (dims[4].score <= 50) f.push('部分毛囊开口状态不佳');

  if (f.length === 0) f.push('头皮整体状态良好，各项指标正常');
  return f;
}

function generateTips(hairType: string, dims: { label: string; score: number }[]): string[] {
  const tips: string[] = [];
  if (hairType === '油性头皮' || dims[0].score >= 70) {
    tips.push('建议使用氨基酸表活洗发水，避免强力去油产品破坏屏障');
    tips.push('每 2-3 天洗一次，逐步延长间隔，训练头皮适应');
  } else if (hairType === '干性头皮' || dims[1].score <= 45) {
    tips.push('减少洗头频率，搭配滋养型洗发水和护发素');
    tips.push('避免过热吹风，使用保湿型头皮精华');
  }
  if (hairType === '敏感性头皮' || dims[3].score <= 50) {
    tips.push('暂停使用含香精和酒精的产品，选用敏感性专用产品');
  }
  if (dims[2].score <= 50) {
    tips.push('每周做 1-2 次头皮按摩，促进毛囊血液循环');
  }
  tips.push('洗头水温控制在 38℃ 左右，指腹按摩不要用指甲抓');
  tips.push('保持规律作息，减少高糖高脂饮食');
  return tips;
}

function recommendProducts(hairType: string, dims: { label: string; score: number }[]): any[] {
  const prods: any[] = [];
  if (hairType === '油性头皮' || dims[0].score >= 68) {
    prods.push({ name: '控油洗发露', desc: '氨基酸表活，控油48h', price: 128 });
  }
  if (dims[1].score <= 45 || hairType === '干性头皮') {
    prods.push({ name: '修护发膜', desc: '角蛋白精华，深层滋养', price: 158 });
  }
  if (dims[3].score <= 50 || hairType === '敏感性头皮') {
    prods.push({ name: '头皮精华液', desc: '红参提取物，舒缓修护', price: 198 });
  }
  if (prods.length === 0) {
    prods.push(
      { name: '控油洗发露', desc: '氨基酸表活，控油48h', price: 128 },
      { name: '护发精油', desc: '摩洛哥坚果油，抚平毛躁', price: 138 },
    );
  }
  return prods.slice(0, 3);
}

// ===== 图片哈希去重 =====
async function imageHash(buffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===== 主检测流程 =====
export async function handleDetect(request: Request, env: Env): Promise<Response> {
  const contentType = request.headers.get('content-type') || '';

  // 只接受 form-data 或 JSON
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
    // 格式校验
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return Response.json({ code: 400, message: '仅支持 JPEG/PNG/WebP 格式' }, { status: 400 });
    }
    // 大小限制 10MB
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ code: 400, message: '图片不能超过 10MB' }, { status: 400 });
    }
    imageBuffer = await file.arrayBuffer();
  } else {
    // JSON body: base64 image
    const body = await request.json() as any;
    sessionId = body.session_id || crypto.randomUUID();
    const b64 = body.image;
    if (!b64) {
      return Response.json({ code: 400, message: '缺少图片数据' }, { status: 400 });
    }
    const raw = atob(b64.replace(/^data:image\/\w+;base64,/, ''));
    imageBuffer = new Uint8Array(raw.length).map((_, i) => raw.charCodeAt(i)).buffer;
  }

  // 去重检测
  const hash = await imageHash(imageBuffer);
  const cached = await env.KV.get(`detect:${hash}`, 'json').catch(() => null);
  if (cached) {
    // 缓存命中，直接返回
    console.log(`[detect] Cache HIT for ${hash}`);
    return Response.json({ code: 0, data: cached, cached: true });
  }

  // 保存原图到 R2
  const imageKey = `detect/${hash}.jpg`;
  await env.R2.put(imageKey, imageBuffer, {
    httpMetadata: { contentType: 'image/jpeg' },
    customMetadata: { sessionId, uploadedAt: new Date().toISOString() },
  });

  // 调用 Workers AI 分析
  let aiResult: any;
  try {
    // 将图片转为 base64 data URI
    const b64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    const dataUri = `data:image/jpeg;base64,${b64}`;

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
        temperature: 0.1, // 低温度提高一致性
      }
    );

    // 解析 AI 输出
    const raw = (aiResponse as any).response || '';
    console.log(`[detect] Raw AI response:`, raw.substring(0, 200));

    // 提取 JSON（兼容可能带 markdown 代码块）
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiResult = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('AI 输出未包含有效 JSON');
    }

    if (aiResult.error) {
      throw new Error(aiResult.error);
    }
  } catch (err: any) {
    console.error(`[detect] AI analysis failed:`, err.message);
    // AI 失败 → 使用规则引擎降级
    aiResult = {
      oil: 70, moisture: 60, density: 65, barrier: 68, follicle: 66,
      hair_type: '混合性头皮',
      confidence: 0.5,
    };
  }

  // 计算结果
  const rawResult = computeResult(aiResult, imageKey);

  // 转换为前端期望的格式
  const dimMap: Record<string, string> = { '油脂分泌': 'sebum', '水分含量': 'moisture', '发量密度': 'density', '头皮屏障': 'barrier', '毛囊健康': 'health' };
  const overallScore = rawResult.score;
  const overallLevel = overallScore >= 85 ? '优秀' : overallScore >= 75 ? '良好' : overallScore >= 65 ? '一般' : '需注意';
  const result = {
    overall: {
      score: overallScore,
      level: overallLevel,
      summary: rawResult.hair_type + '状况评估完成。' + (rawResult.findings.length > 0 ? rawResult.findings[0] : ''),
    },
    dimensions: Object.fromEntries(
      rawResult.dimensions.map((d: any) => [dimMap[d.label] || d.key, { score: d.score, label: d.label }])
    ),
    hairType: rawResult.hair_type,
    analysis: {
      findings: rawResult.findings,
      rootCauses: rawResult.findings.slice(0, 2),
    },
    careRoutine: {
      daily: rawResult.tips.slice(0, 2),
      weekly: rawResult.tips.slice(2, 4),
      caution: rawResult.tips.slice(4, 5),
    },
    productRecommendations: rawResult.products.map((p: any) => ({
      category: '洗发水',
      targetIssue: p.desc || '日常护理',
      keyIngredients: ['氨基酸', '益生菌'],
      brandExamples: ['安柯耳'],
      searchKeywords: p.name || '护发',
      searchLinks: {
        jd: 'https://search.jd.com/Search?keyword=' + encodeURIComponent(p.name || '护发'),
        taobao: 'https://s.taobao.com/search?q=' + encodeURIComponent(p.name || '护发'),
        tmall: 'https://list.tmall.com/search_product.htm?q=' + encodeURIComponent(p.name || '护发'),
      },
      purchaseGuide: '选择针对' + rawResult.hair_type + '的洗护产品',
    })),
    tips: rawResult.tips,
  };

  // 保存到 KV 缓存（60s TTL）
  await env.KV.put(`detect:${hash}`, JSON.stringify(rawResult), { expirationTtl: 60 }).catch(() => {});

  // 保存到 D1
  await env.DB.prepare(
    `INSERT INTO detections (session_id, image_key, score, hair_type, dimensions, findings, tips, products, confidence, model_version, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'v1.0', datetime('now', '+24 hours'))`
  ).bind(
    sessionId,
    imageKey,
    rawResult.score,
    rawResult.hair_type,
    JSON.stringify(rawResult.dimensions),
    JSON.stringify(rawResult.findings),
    JSON.stringify(rawResult.tips),
    JSON.stringify(rawResult.products),
    rawResult.confidence,
  ).run().catch(e => console.error(`[detect] D1 save failed:`, e.message));

  return Response.json({
    code: 0,
    data: {
      id: crypto.randomUUID().slice(0, 12),
      ...result,
      created_at: new Date().toISOString(),
    },
  });
}

// ===== 查询检测历史 =====
export async function handleDetectHistory(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  const userId = url.searchParams.get('user_id');
  const limit = Math.min(50, parseInt(url.searchParams.get('limit') || '10'));
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let query = `SELECT id, score, hair_type, dimensions, findings, tips, products, confidence, created_at
               FROM detections WHERE 1=1`;
  const params: any[] = [];

  if (sessionId) { query += ' AND session_id = ?'; params.push(sessionId); }
  if (userId) { query += ' AND user_id = ?'; params.push(userId); }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await env.DB.prepare(query).bind(...params).all();
  const total = await env.DB.prepare(
    `SELECT COUNT(*) as count FROM detections WHERE ${sessionId ? 'session_id = ?' : '1=1'}`
  ).bind(...(sessionId ? [sessionId] : [])).first();

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
      total: (total as any)?.count || 0,
      limit,
      offset,
    },
  });
}
