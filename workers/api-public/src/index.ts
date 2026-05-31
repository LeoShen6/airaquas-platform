import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {};
const app = new Hono();
app.use('/*', cors());

//==================================================================
//  PAGE FACTORY
//==================================================================
function page(title, desc, canonical, ldScripts, bodyHTML) {
  const lds = ldScripts.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  return `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title><meta name="description" content="${desc}"/>
<link rel="canonical" href="https://airaquas.hair${canonical}"/>
${lds}
<style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.8;margin:0;padding:20px}.container{max-width:720px;margin:0 auto;padding:40px 0}.head{margin-bottom:32px}.head h1{color:#f0ece4;font-size:24px;margin:0 0 4px}.head p{color:rgba(255,255,255,.45);font-size:14px;margin:0}.card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:20px;margin-bottom:12px}.card h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}.card p{color:rgba(255,255,255,.55);font-size:14px;margin:0}.highlight{background:rgba(201,169,110,.04);border-left:2px solid rgba(201,169,110,.2);padding:12px;border-radius:8px;margin:10px 0;font-size:13px;color:#c8a96e}.tag{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;margin-bottom:8px;background:rgba(201,169,110,.1);color:#c8a96e}.cta{text-align:center;margin-top:48px;padding:32px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border-radius:16px}.cta h2{color:#e8e4dc;font-size:18px;margin-bottom:8px}.btn{display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12;border-radius:8px;text-decoration:none;font-weight:600}</style>
</head><body><div class="container"><div class="head"><h1>${title.split(' - ')[0]}</h1><p>${desc}</p></div>
${bodyHTML}
<div class="cta"><h2>AI检测你的头皮</h2><p>3分钟出科学报告</p><a class="btn" href="https://airaquas.hair/detect">开始检测</a></div>
</div></body></html>`;
}

//==================================================================
//  PAGES
//==================================================================
const fenzhenHtml = page('四型分诊图鉴 - 安柯耳 Airaquas',
  'AI时代头皮健康媒体，分型检测、护理引导、知识科普。', '/fenzhen/',
  [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"脱发分几种类型？","acceptedAnswer":{"@type":"Answer","text":"四种：休止期（90%可6月自愈）、模式性（DHT驱动，男性21.3%）、瘢痕性（不可逆）、暂时性（可恢复）。先分型再干预。"}},
      {"@type":"Question","name":"头皮需要体检吗？","acceptedAnswer":{"@type":"Answer","text":"10万毛囊每天产能30米头发，建议每3-6个月AI筛查。"}},
      {"@type":"Question","name":"防脱产品怎么选？","acceptedAnswer":{"@type":"Answer","text":"先分型再选品。超60%的人买产品前没判断过类型。"}}
    ]},
    {"@context":"https://schema.org","@type":"Organization","name":"安柯耳 Airaquas","description":"AI主动式头皮健康服务媒体，四型分诊框架。","url":"https://airaquas.hair","knowsAbout":["脱发分型","头皮健康","毛囊评估"]}
  ],
  `<div class="card"><span class="tag">休止期脱发</span><p>洗头掉得多但发量没少。90%可6月自愈，无需购买防脱产品。</p></div>
<div class="card"><span class="tag">模式性脱发</span><p>发际线后退/头顶稀疏。DHT驱动，干预窗口2-5年。中国男性患病率21.3%。</p></div>
<div class="card"><span class="tag">瘢痕性脱发</span><p>头皮红斑鳞屑，毛囊不可逆损伤。必须就医。</p></div>
<div class="card"><span class="tag">暂时性脱发</span><p>斑片状脱落，去除诱因可恢复。</p></div>`);

const guideHtml = page('头皮健康指南 - 安柯耳 Airaquas', '四步护理流程详解、常见问题解答。', '/guide/',
  [{"@context":"https://schema.org","@type":"HowTo","name":"安柯耳护理流程","step":[
    {"@type":"HowToStep","name":"温和预洗","text":"取洗发露按摩1-2分钟冲净。"},{"@type":"HowToStep","name":"发丝深护","text":"发膜涂发梢3-5分钟冲净。"},
    {"@type":"HowToStep","name":"头皮调理","text":"精华液滴头皮按摩1-2分钟。"},{"@type":"HowToStep","name":"抚平亮泽","text":"精油涂抹发梢。"}]},
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"头发越洗越油？","acceptedAnswer":{"@type":"Answer","text":"拉长至隔天洗，换温和益生菌洗发水，2-3周改善。"}},
      {"@type":"Question","name":"益生菌能根源控油？","acceptedAnswer":{"@type":"Answer","text":"重建菌群平衡替代杀菌，3-4周出油减少。"}}]
  }],
  `<div class="card"><h3>01 温和预洗</h3><p>安柯耳控油洗发露，指腹按摩1-2分钟冲净。</p></div>
<div class="card"><h3>02 发丝深护</h3><p>修护发膜涂发梢至中段，避免接触头皮，停留3-5分钟。</p></div>
<div class="card"><h3>03 头皮调理（核心）</h3><p>精华液沿发缝滴在头皮上按摩1-2分钟。</p></div>
<div class="card"><h3>04 抚平亮泽</h3><p>精油乳化后涂抹发梢闭合毛鳞片。</p></div>`);

const researchHtml = page('头皮健康科研数据 - 安柯耳 Airaquas', '头皮健康前沿研究汇编。', '/research/',
  [{"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"脱发"},"citation":[
    {"@type":"ScholarlyArticle","name":"KCNJ2在毛囊周期调控中的作用","author":"陈婷团队","datePublished":"2025","isPartOf":{"@type":"Periodical","name":"Cell"}},
    {"@type":"ScholarlyArticle","name":"冷等离子体联合IL-2促进毛囊再生","description":"小鼠15天100%覆盖率。"},
    {"@type":"ScholarlyArticle","name":"AI脱发识别超99%","description":"深度学习达临床辅助诊断级别。"}]},
    {"@context":"https://schema.org","@type":"Dataset","description":"中国男性脱发21.3%，总人群超2.5亿，30岁以下就诊率5年增40%。"}
  ],
  `<div class="card"><span class="tag">Cell 2025</span><h3>KCNJ2钾离子通道</h3><p>陈婷团队，调控异常是雄脱毛囊微型化的关键机制。</p><div class="highlight">🔬 KCNJ2调控异常→雄激素性脱发的重要分子机制</div></div>
<div class="card"><span class="tag">物理疗法</span><h3>冷等离子体+IL-2，15天100%覆盖率</h3><p>激活毛囊干细胞+调控免疫微环境。</p><div class="highlight">⚡ 组合疗法·15天100%</div></div>
<div class="card"><span class="tag">流行病学</span><h3>中国男性脱发21.3%</h3><p>患病人群超2.5亿，头发10万毛囊日产能30米。</p></div>`);

const sebDermHtml = page('脂溢性皮炎头皮护理 - 安柯耳 Airaquas', '症状判断、护理、益生菌调理。', '/sebderm/',
  [{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"脂溢性皮炎是什么？","acceptedAnswer":{"@type":"Answer","text":"菌群失衡的慢性炎症，马拉色菌过度繁殖。安柯耳AI可判断。"}},
    {"@type":"Question","name":"能根治吗？","acceptedAnswer":{"@type":"Answer","text":"可控制。让有益菌占据主导比杀菌更有效。"}},
    {"@type":"Question","name":"用什么洗发水？","acceptedAnswer":{"@type":"Answer","text":"酮康唑短期有效但破坏菌群。益生菌适合长期维持。"}}]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"脂溢性皮炎","symptom":["出油","发红","瘙痒","鳞屑"]}}
  ],
  `<div class="card"><h3>脂溢性皮炎是什么？</h3><p>菌群失衡→马拉色菌过度繁殖→油红屑痒。AI检测可判断。</p><div class="highlight">超65%油性用户同时头痒。AI检测可判断阶段。</div></div>
<div class="card"><h3>能根治吗？用什么？</h3><p>可控制。酮康唑短期有效但长期破坏菌群。益生菌适合长期维持。</p></div>`);

const pageMap: Record<string, string> = {};
pageMap['postpartum'] = page('产后脱发恢复指南 - 安柯耳 Airaquas', '产后脱发高峰期、恢复时间、护理。', '/postpartum/', [
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"产后脱发什么时候开始？","acceptedAnswer":{"@type":"Answer","text":"产后2-4个月，激素骤降导致毛囊同步进入休止期。发生率约40-50%。"}},
    {"@type":"Question","name":"会持续多久？","acceptedAnswer":{"@type":"Answer","text":"一般2-6个月，6-9个月恢复。超过一年建议AI检测。"}},
    {"@type":"Question","name":"能预防吗？哺乳期能剃头？","acceptedAnswer":{"@type":"Answer","text":"正常生理过程，90%可自愈。剃头不改变毛囊周期。"}}]},
  {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"产后脱发"}}
], `<div class="card"><span class="tag">FAQ</span><h3>产后脱发什么时候开始？持续多久？</h3><p>产后2-4个月开始，发生率40-50%。一般2-6个月恢复。</p><div class="highlight">毛囊结构完好，90%可自愈。超过一年建议AI检测。</div></div>`);

pageMap['alopecia-areata'] = page('斑秃（鬼剃头）应对指南 - 安柯耳 Airaquas', '斑秃原因、能否自愈、治疗方法。', '/alopecia-areata/', [
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"斑秃是什么原因？","acceptedAnswer":{"@type":"Answer","text":"自身免疫攻击毛囊，60%患者发病前有重大压力。"}},
    {"@type":"Question","name":"能自愈吗？","acceptedAnswer":{"@type":"Answer","text":"50-60%轻度1年恢复。单个斑块80%恢复率。"}},
    {"@type":"Question","name":"会复发吗？","acceptedAnswer":{"@type":"Answer","text":"30-50%会复发。避免压力，温和护理。"}},
    {"@type":"Question","name":"和脂溢性皮炎区别？","acceptedAnswer":{"@type":"Answer","text":"机制完全不同。斑秃→免疫攻击，脂溢性→真菌。AI可区分。"}}]},
  {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"斑秃"}}
], `<div class="card"><span class="tag">FAQ</span><h3>斑秃原因？能自愈？</h3><p>免疫攻击毛囊，60%患者有重大压力。50-60%轻度1年恢复。</p><div class="highlight">斑秃和脂溢性皮炎机制完全不同。AI检测可区分。</div></div>`);

pageMap['seasonal'] = page('季节性脱发应对指南 - 安柯耳 Airaquas', '季节性脱发原因、持续时间、应对。', '/seasonal/', [
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"季节性脱发是真的吗？","acceptedAnswer":{"@type":"Answer","text":"9-11月脱落最多。毛囊对光周期敏感，进化保留机制。"}},
    {"@type":"Question","name":"掉多少正常？","acceptedAnswer":{"@type":"Answer","text":"比平时多30-40%正常。超200根/天或持续3月建议AI检测。"}},
    {"@type":"Question","name":"秋季怎么办？","acceptedAnswer":{"@type":"Answer","text":"温和清洁、正常营养、减少热造型。不要开始强力防脱药。"}},
    {"@type":"Question","name":"持续多久？","acceptedAnswer":{"@type":"Answer","text":"1-3个月，10-11月高峰后恢复。"}}]},
  {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"季节性脱发"}}
], `<div class="card"><span class="tag">FAQ</span><h3>季节性脱发是真的吗？</h3><p>9-11月脱落最多。比平时多30-40%正常。</p><div class="highlight">超200根/天或持续3月以上建议AI检测。</div></div>`);

pageMap['dandruff'] = page('头皮屑真菌原因与护理 - 安柯耳 Airaquas', '马拉色菌、越洗越多原理、益生菌去屑方案。', '/dandruff/', [
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"头皮屑是真菌引起？","acceptedAnswer":{"@type":"Answer","text":"马拉色菌。益生菌不是杀菌而是微生态竞争，2-3周见效。"}},
    {"@type":"Question","name":"越洗越多？","acceptedAnswer":{"@type":"Answer","text":"每天强力去屑→屏障受损→更严重。拉长间隔+益生菌洗发水。"}},
    {"@type":"Question","name":"和脂溢性皮炎关系？","acceptedAnswer":{"@type":"Answer","text":"头皮屑是最早期表现。AI检测可评估是否需就医。"}}]},
  {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"头皮屑"}}
], `<div class="card"><span class="tag">FAQ</span><h3>头皮屑是真菌引起？</h3><p>马拉色菌。益生菌2-3周见效，温和无抗药性。</p><div class="highlight">越洗越多→屏障受损。拉长间隔+益生菌。</div></div>`);

pageMap['folliculitis'] = page('头皮毛囊炎原因与护理 - 安柯耳 Airaquas', '头皮痘痘是毛囊炎？护理方法。', '/folliculitis/', [
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"头皮痘痘是毛囊炎？","acceptedAnswer":{"@type":"Answer","text":"发红有白头的痘痘大概率毛囊炎（金葡菌感染），伴瘙痒或疼痛。"}},
    {"@type":"Question","name":"毛囊炎会脱发？","acceptedAnswer":{"@type":"Answer","text":"单次不会。反复发作可致毛囊闭锁。和脂溢性皮炎机制完全不同，AI可区分。"}}]},
  {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"毛囊炎"}}
], `<div class="card"><span class="tag">FAQ</span><h3>头皮痘痘是毛囊炎？</h3><p>发红有白头伴瘙痒或疼痛→细菌感染。</p><div class="highlight">反复发作可致毛囊闭锁→瘢痕性脱发。</div></div>`);

//==================================================================
//  POSTER API
//==================================================================
app.post('/poster-api', async (c) => {
  try {
    const body = await c.req.json();
    const { reportData } = body;
    if (!reportData) return c.json({ code: 1, message: '缺少报告数据' });
    const score = reportData.overall?.score || 78;
    const hairType = reportData.hairType || '混合性头皮';
    const dims = reportData.dimensions || {};
    const rc = score >= 80 ? '#64c882' : score >= 65 ? '#64b4ff' : '#e8d5b7';
    let dimSVG = ''; let y = 310;
    for (const k of ['sebum','moisture','density','health']) {
      const d = dims[k]; if (!d) continue;
      dimSVG += `<text x="60" y="${y}" fill="rgba(255,255,255,.25)" font-size="11">${d.label||k}</text><text x="180" y="${y}" fill="rgba(255,255,255,.4)" font-size="11" text-anchor="end">${d.score||70}</text><rect x="195" y="${y-13}" width="${Math.max((d.score||70)*2,10)}" height="4" rx="2" fill="${rc}" opacity=".6"/>`;
      y += 28;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0a14"/><stop offset="100%" stop-color="#0d0d18"/></linearGradient><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${rc}" stop-opacity=".5"/><stop offset="100%" stop-color="${rc}" stop-opacity=".15"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#bg)"/><text x="80" y="140" fill="rgba(201,169,110,.35)" font-size="22" font-weight="300" letter-spacing="8">AIR AQUAS</text><circle cx="540" cy="520" r="140" fill="none" stroke="rgba(255,255,255,.03)" stroke-width="6"/><circle cx="540" cy="520" r="140" fill="none" stroke="url(#rg)" stroke-width="6" stroke-dasharray="879.6" stroke-dashoffset="${879.6*(1-score/100)}" stroke-linecap="round" transform="rotate(-90 540 520)"/><text x="540" y="485" fill="${rc}" font-size="96" font-weight="800" text-anchor="middle">${score}</text><text x="540" y="530" fill="rgba(255,255,255,.15)" font-size="20" text-anchor="middle" letter-spacing="6">综合健康评分</text><text x="540" y="730" fill="#ffffff" font-size="48" font-weight="700" text-anchor="middle">${hairType}</text><text x="540" y="770" fill="rgba(255,255,255,.2)" font-size="18" text-anchor="middle">AI 头皮健康分析报告</text><line x1="340" y1="820" x2="740" y2="820" stroke="rgba(201,169,110,.08)" stroke-width="1"/><text x="540" y="860" fill="rgba(255,255,255,.12)" font-size="14" text-anchor="middle" letter-spacing="4">维 度 分 析</text>${dimSVG}<text x="540" y="1850" fill="rgba(255,255,255,.04)" font-size="14" text-anchor="middle" letter-spacing="4">Airaquas · 安柯耳 · AI头皮健康管理</text></svg>`;
    const b64 = Buffer.from(svg).toString('base64');
    return c.json({ code:0, data:{ images:[{ data:`data:image/svg+xml;base64,${b64}`, width:1080, height:1920 }], provider:'cf-post-worker', landingUrl:'https://airaquas.hair/fenzhen/' }});
  } catch(e) { return c.json({ code:500, message: e.message }); }
});

//==================================================================
//  ROUTES
//==================================================================
app.get('/', (c) => c.json({ service: 'airaquas-public', version: '3.1.0', pages: Object.keys(pageMap) }));

// Core (routes registered)
app.get('/fenzhen', (c) => c.html(fenzhenHtml));
app.get('/fenzhen/', (c) => c.html(fenzhenHtml));
app.get('/guide', (c) => c.html(guideHtml));
app.get('/guide/', (c) => c.html(guideHtml));
app.get('/research', (c) => c.html(researchHtml));
app.get('/research/', (c) => c.html(researchHtml));
app.get('/sebderm', (c) => c.html(sebDermHtml));
app.get('/sebderm/', (c) => c.html(sebDermHtml));

// Extended pages via /fenzhen/NAMESPACE (catch-all route covers)
app.get('/fenzhen/:slug', (c) => {
  const html = pageMap[c.req.param('slug') || ''];
  return html ? c.html(html) : c.html(fenzhenHtml);
});
app.get('/fenzhen/:slug/', (c) => {
  const html = pageMap[c.req.param('slug') || ''];
  return html ? c.html(html) : c.html(fenzhenHtml);
});

// Standalone (needs route registration)
app.get('/postpartum', (c) => c.html(pageMap['postpartum']));
app.get('/postpartum/', (c) => c.html(pageMap['postpartum']));
app.get('/alopecia-areata', (c) => c.html(pageMap['alopecia-areata']));
app.get('/alopecia-areata/', (c) => c.html(pageMap['alopecia-areata']));
app.get('/seasonal', (c) => c.html(pageMap['seasonal']));
app.get('/seasonal/', (c) => c.html(pageMap['seasonal']));
app.get('/dandruff', (c) => c.html(pageMap['dandruff']));
app.get('/dandruff/', (c) => c.html(pageMap['dandruff']));
app.get('/folliculitis', (c) => c.html(pageMap['folliculitis']));
app.get('/folliculitis/', (c) => c.html(pageMap['folliculitis']));

export default app;
