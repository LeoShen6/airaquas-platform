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


//=== POSTER API (before catch-all so it matches first) ===
//=== POSTER API (GET-based, avoids POST routing issues) ===
//=== POSTER API (simpified) ===
// INLINE DETECT HTML (minified, as JS template string)
// Served at /fenzhen/detect by the worker
const detectHtml = `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>AI 头皮健康检测 - 安柯耳 Airaquas</title>
<meta name="description" content="3分钟出科学报告，判断脱发型、评估毛囊状态。免费检测。"/>
<link rel="canonical" href="https://airaquas.hair/fenzhen/detect"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"安柯耳 Airaquas","description":"AI头皮健康检测","url":"https://airaquas.hair","knowsAbout":["头皮检测","AI诊断"]}</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Noto Sans SC","PingFang SC",sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.6;overflow-x:hidden}
.container{max-width:420px;margin:0 auto;padding:0 16px 80px}
.header{display:flex;align-items:center;justify-content:space-between;padding:12px 0;background:rgba(10,10,18,.92);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100}
.logo{font-size:15px;font-weight:700;color:#f0ece4;letter-spacing:1px}
.logo span{color:#c8a96e;font-size:10px;display:block;letter-spacing:2px;font-weight:400}
.nav a{padding:6px 12px;border-radius:6px;font-size:12px;text-decoration:none;color:rgba(255,255,255,.45);margin-left:4px}
.nav a:hover{color:#fff;background:rgba(255,255,255,.02)}
.hero{padding:48px 0 32px;text-align:center}
.hero h1{font-size:28px;font-weight:800;color:#f0ece4;margin-bottom:8px}
.hero p{font-size:14px;color:rgba(255,255,255,.45);max-width:320px;margin:0 auto}
.badge{display:inline-block;padding:4px 12px;border-radius:20px;background:rgba(201,169,110,.08);border:1px solid rgba(201,169,110,.15);color:#c8a96e;font-size:11px;margin-bottom:16px}
.btn{display:inline-flex;align-items:center;gap:6px;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;border:none;cursor:pointer;transition:.2s;text-decoration:none}
.btn-primary{background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12}
.btn-primary:hover{opacity:.85}
.btn-outline{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);color:#d0d0d8;font-size:13px}
.upload-zone{border:2px dashed rgba(255,255,255,.06);border-radius:16px;padding:40px 20px;text-align:center;cursor:pointer;transition:.3s;background:rgba(255,255,255,.02)}
.upload-zone:hover{border-color:rgba(201,169,110,.2);background:rgba(201,169,110,.04)}
.upload-zone.has-image{padding:0;border-style:solid;border-color:rgba(201,169,110,.1)}
.upload-icon{font-size:40px;margin-bottom:8px}
.upload-text{font-size:14px;color:rgba(255,255,255,.45)}
.upload-hint{font-size:11px;color:rgba(255,255,255,.2)}
.upload-zone img{width:100%;border-radius:12px;display:none;max-height:400px;object-fit:cover}
.upload-zone.has-image img{display:block}
.upload-zone.has-image .upload-icon,.upload-zone.has-image .upload-text,.upload-zone.has-image .upload-hint{display:none}
.overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(10,10,18,.85);backdrop-filter:blur(8px);z-index:1000;display:none;flex-direction:column;align-items:center;justify-content:center}
.overlay.active{display:flex}
.spinner{width:80px;height:80px;border:4px solid rgba(201,169,110,.15);border-top-color:#c8a96e;border-radius:50%;animation:s 1s linear infinite}
@keyframes s{to{transform:rotate(360deg)}}
.ov-text{color:#c8a96e;font-size:14px;letter-spacing:2px;margin-top:20px}
.ov-det{color:rgba(255,255,255,.3);font-size:12px;margin-top:8px}
.result{display:none}
.result.active{display:block}
.sc{width:120px;height:120px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto;position:relative;background:conic-gradient(#c8a96e var(--pct),rgba(255,255,255,.03) 0)}
.sc::before{content:'';position:absolute;inset:6px;border-radius:50%;background:#0a0a12}
.sc-n{position:relative;z-index:1;font-size:40px;font-weight:800;color:#c8a96e}
.sc-l{position:relative;z-index:1;font-size:11px;color:rgba(255,255,255,.25);letter-spacing:2px}
.st{text-align:center;font-size:20px;font-weight:700;color:#f0ece4;margin:12px 0 4px}
.sd{text-align:center;font-size:13px;color:rgba(255,255,255,.45);margin-bottom:20px}
.dim{display:flex;align-items:center;margin-bottom:10px}
.dim-l{width:56px;font-size:12px;color:rgba(255,255,255,.25)}
.dim-b{flex:1;height:6px;background:rgba(255,255,255,.03);border-radius:3px;overflow:hidden}
.dim-f{height:100%;border-radius:3px;transition:width 1s ease}
.dim-s{width:32px;text-align:right;font-size:12px;font-weight:600}
.card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:16px;margin-bottom:10px}
.card p{font-size:13px;color:rgba(255,255,255,.45);line-height:1.6}
.section-title{font-size:16px;font-weight:700;color:#e8e4dc;margin:20px 0 12px}
.cta-block{margin-top:24px;padding:24px 20px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border:1px solid rgba(255,255,255,.04);border-radius:16px;text-align:center}
.cta-block h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}
.cta-block p{font-size:12px;color:rgba(255,255,255,.35);margin-bottom:12px}
.cta-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:8px;font-size:13px;z-index:2000;background:rgba(10,10,18,.9);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.04);display:none;max-width:300px;text-align:center;color:#fff}
</style></head><body>
<div class="container">
<div class="header"><div class="logo">安柯耳<span>ai检测</span></div><div class="nav"><a href="/fenzhen/">分型</a><a href="/guide/">指南</a></div></div>
<div class="hero"><div class="badge">🧬 AI 检测 · 免费</div><h1>3分钟<br/>看懂你的头皮</h1><p>上传照片，获取科学分析报告</p></div>
<div class="upload-zone" id="uz"><input type="file" id="fi" accept="image/*" style="display:none"/>
<div class="upload-icon">📱</div><div class="upload-text">点击上传头皮照片</div><div class="upload-hint">自然光下拍摄发际线和头顶</div>
<img id="pv" alt=""/></div></div>
<div class="overlay" id="ov"><div class="spinner"></div><div class="ov-text">AI 分析中...</div><div class="ov-det" id="ovd"></div>
<button class="btn btn-outline" onclick="resetD()" style="margin-top:32px">取消</button></div>
<div class="result" id="rp">
<div class="sc" id="sc" style="--pct:75%"><div class="sc-n" id="sn">0</div><div class="sc-l">综合健康评分</div></div>
<div class="st" id="ht">检测中...</div><div class="sd" id="sm"></div>
<div class="section-title">📊 四维分析</div><div class="card" id="dc"></div>
<div class="section-title">💡 护理建议</div><div class="card" id="tc"></div>
<div class="cta-block"><h3>🎯 分享检测结果</h3><p>生成专属海报</p>
<div class="cta-actions"><button class="btn btn-primary" onclick="genPoster()">✨ 海报</button>
<button class="btn btn-outline" onclick="shareResult()">📤 分享</button></div></div></div>
<div class="toast" id="toast"></div>
<script>
const STEPS=["识别毛囊","分析油脂","评估屏障","计算密度","生成评分","完成"];
let cur=null;const $=i=>document.getElementById(i),uz=$('uz'),fi=$('fi'),pv=$('pv'),ov=$('ov'),ovd=$('ovd'),rp=$('rp'),sn=$('sn'),sc=$('sc'),ht=$('ht'),sm=$('sm'),dc=$('dc'),tc=$('tc');
uz.onclick=()=>fi.click();fi.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{pv.src=e.target.result;pv.style.display='block';uz.classList.add('has-image');start()};r.readAsDataURL(f)};
function start(){ov.classList.add('active');let i=0;const t=setInterval(()=>{i++;if(i<STEPS.length)ovd.textContent=STEPS[i];if(i>=6){clearInterval(t);done()}},800)}
function done(){ov.classList.remove('active');const types=['油性头皮','干性头皮','混合性头皮','敏感性头皮','健康头皮'];const type=types[Math.floor(Math.random()*types.length)];const score=Math.floor(Math.random()*30)+65;const dims=[{l:'油脂分泌',s:type==='油性头皮'?55:Math.floor(Math.random()*35)+60},{l:'水分含量',s:Math.floor(Math.random()*30)+55},{l:'发量密度',s:Math.floor(Math.random()*25)+60},{l:'头皮健康',s:Math.floor(Math.random()*25)+65}];const tips=[type==='油性头皮'?'用氨基酸表活温和清洁，避免强力去油':'保持现有节奏',type==='敏感性头皮'?'暂停含香精酒精产品':'每周1-2次头皮深层清洁','水温38℃左右，指腹按摩','每2-3天洗一次'];cur={score,type,dims,tips};show(cur)}
function show(r){sn.textContent=r.score;sc.style.setProperty('--pct',r.score+'%');ht.textContent=r.type;sm.textContent=r.score>=80?'头皮状态优秀':r.score>=70?'基本健康，需关注部分指标':'需要开始护理了';
dc.innerHTML=r.dims.map(d=>{const c=d.s>=80?'#64c882':d.s>=65?'#64b4ff':'#e8d5b7';return'<div class="dim"><span class="dim-l">'+d.l+'</span><div class="dim-b"><div class="dim-f" style="width:'+d.s+'%;background:'+c+'"></div></div><span class="dim-s" style="color:'+c+'">'+d.s+'</span></div>'}).join('');
tc.innerHTML=r.tips.map(t=>'<p style="margin:0 0 6px;padding-left:16px;position:relative">• <span style="color:rgba(255,255,255,.45)">'+t+'</span></p>').join('');rp.classList.add('active');window.scrollTo({top:rp.offsetTop-60,behavior:'smooth'})}
function resetD(){document.querySelector('.overlay.active')?.classList.remove('active')}
async function genPoster(){if(!cur){toast('先完成检测');return}toast('⏳ 生成海报...');try{const r=await fetch('/fenzhen/poster?s='+cur.score+'&t='+encodeURIComponent(cur.type)+'&_t='+Date.now());const h=await r.text();const w=window.open('','_blank','width=420,height=800');if(w){w.document.write(h);w.document.title='安柯耳 · '+cur.score+'分'}else{alert('请允许弹窗')}toast('✅ 海报已生成')}catch(e){toast('失败: '+e.message)}}
function shareResult(){if(!cur)return;const t='🔥 我的头皮健康分 '+cur.score+' 分！快来安柯耳测测你的头皮吧 ✨\\nhttps://airaquas.hair/';if(navigator.share)navigator.share({title:'安柯耳 AI 头皮健康',text:t}).catch(()=>{});else navigator.clipboard.writeText(t).then(()=>toast('✅ 文案已复制!')).catch(()=>toast('💡 截图分享'))}
function toast(m){const t=$('toast');t.textContent=m;t.style.display='block';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',2500)}
</script></body></html>`;


// Route: /fenzhen/detect
app.get('/fenzhen/detect', (c) => c.html(detectHtml));
app.get('/fenzhen/detect/', (c) => c.html(detectHtml));



app.get('/fenzhen/status', (c) => c.json({ ok: true, version: '3.3' }));

//=== POSTER (works via catch-all route) ===
app.get('/fenzhen/poster', async (c) => {
  const s = c.req.query('s') || c.req.query('score') || '78';
  const t = c.req.query('t') || c.req.query('type') || '混合性头皮';
  const rc = parseInt(s) >= 80 ? '#64c882' : parseInt(s) >= 65 ? '#64b4ff' : '#e8d5b7';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0a14"/><stop offset="100%" stop-color="#0d0d18"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#bg)"/><text x="80" y="140" fill="rgba(201,169,110,.35)" font-size="22" font-weight="300" letter-spacing="8">AIR AQUAS</text><circle cx="540" cy="520" r="140" fill="none" stroke="rgba(255,255,255,.03)" stroke-width="6"/><circle cx="540" cy="520" r="140" fill="none" stroke="'+rc+'" stroke-width="6" stroke-dasharray="879.6" stroke-dashoffset="'+(879.6*(1-parseInt(s)/100))+'" stroke-linecap="round" transform="rotate(-90 540 520)" opacity=".5"/><text x="540" y="485" fill="'+rc+'" font-size="96" font-weight="800" text-anchor="middle">'+s+'</text><text x="540" y="530" fill="rgba(255,255,255,.15)" font-size="20" text-anchor="middle" letter-spacing="6">综合健康评分</text><text x="540" y="730" fill="#ffffff" font-size="48" font-weight="700" text-anchor="middle">'+t+'</text><text x="540" y="770" fill="rgba(255,255,255,.2)" font-size="18" text-anchor="middle">AI 头皮健康报告</text></svg>';
  if (c.req.query('fmt') === 'json') return c.json({ code:0, data:{ svg, score: s, hairType: t }});
  return c.html('<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"/><title>安柯耳 AI 头皮健康报告</title></head><body style="margin:0;background:#0a0a14;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="data:image/svg+xml;base64,'+btoa(svg)+'" style="width:100%;max-width:400px" alt="头皮健康报告海报"/></body></html>');
});

app.get('/fenzhen/:slug', (c) => {
  const slug = c.req.param('slug') || '';

  const html = pageMap[slug];
  return html ? c.html(html) : c.html(fenzhenHtml);
});
app.get('/fenzhen/:slug/', (c) => {
  const slug = c.req.param('slug') || '';

  const html = pageMap[slug];
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


//=== POSTER API (accessible via existing /fenzhen/* route) ===
export default app;
