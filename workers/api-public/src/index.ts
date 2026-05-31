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

// Detect page served at /fenzhen/detect
var detectPageHtml = '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>\n<title>AI 头皮健康检测 - 安柯耳 Airaquas</title>\n<link rel="canonical" href="https://airaquas.hair/fenzhen/detect"/>\n<style>\n*{box-sizing:border-box;margin:0;padding:0}\nbody{font-family:-apple-system,BlinkMacSystemFont,"Noto Sans SC","PingFang SC",sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.6;overflow-x:hidden}\n.container{max-width:420px;margin:0 auto;padding:0 16px 80px}\n.header{display:flex;align-items:center;justify-content:space-between;padding:12px 0;background:rgba(10,10,18,.92);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100}\n.logo{font-size:15px;font-weight:700;color:#f0ece4;letter-spacing:1px}\n.logo span{color:#c8a96e;font-size:10px;display:block;letter-spacing:2px}\n.nav a{padding:6px 12px;border-radius:6px;font-size:12px;text-decoration:none;color:rgba(255,255,255,.45);margin-left:4px}\n.nav a:hover{color:#fff;background:rgba(255,255,255,.02)}\n.hero{padding:48px 0 32px;text-align:center}\n.hero h1{font-size:28px;font-weight:800;color:#f0ece4;margin-bottom:8px}\n.hero p{font-size:14px;color:rgba(255,255,255,.45);max-width:320px;margin:0 auto}\n.badge{display:inline-block;padding:4px 12px;border-radius:20px;background:rgba(201,169,110,.08);border:1px solid rgba(201,169,110,.15);color:#c8a96e;font-size:11px;margin-bottom:16px}\n.btn{display:inline-flex;align-items:center;gap:6px;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;border:none;cursor:pointer;transition:.2s;text-decoration:none}\n.btn-primary{background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12}\n.btn-primary:hover{opacity:.85}\n.btn-outline{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);color:#d0d0d8;font-size:13px}\n.uz{border:2px dashed rgba(255,255,255,.06);border-radius:16px;padding:40px 20px;text-align:center;cursor:pointer;transition:.3s;background:rgba(255,255,255,.02)}\n.uz:hover{border-color:rgba(201,169,110,.2);background:rgba(201,169,110,.04)}\n.uz.has-img{padding:0;border-style:solid;border-color:rgba(201,169,110,.1)}\n.uz .icon{font-size:40px;margin-bottom:8px}\n.uz .txt{font-size:14px;color:rgba(255,255,255,.45)}\n.uz .hint{font-size:11px;color:rgba(255,255,255,.2)}\n.uz img{width:100%;border-radius:12px;display:none;max-height:400px;object-fit:cover}\n.uz.has-img img{display:block}\n.uz.has-img .icon,.uz.has-img .txt,.uz.has-img .hint{display:none}\n.ov{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(10,10,18,.85);backdrop-filter:blur(8px);z-index:1000;display:none;flex-direction:column;align-items:center;justify-content:center}\n.ov.active{display:flex}\n.sp{width:80px;height:80px;border:4px solid rgba(201,169,110,.15);border-top-color:#c8a96e;border-radius:50%;animation:s 1s linear infinite}\n@keyframes s{to{transform:rotate(360deg)}}\n.ov .text{color:#c8a96e;font-size:14px;letter-spacing:2px;margin-top:20px}\n.ov .det{color:rgba(255,255,255,.3);font-size:12px;margin-top:8px}\n.rp{display:none}\n.rp.active{display:block}\n.sc{width:120px;height:120px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto;position:relative;background:conic-gradient(#c8a96e var(--p),rgba(255,255,255,.03) 0)}\n.sc::before{content:\'\';position:absolute;inset:6px;border-radius:50%;background:#0a0a12}\n.sc .n{position:relative;z-index:1;font-size:40px;font-weight:800;color:#c8a96e}\n.sc .l{position:relative;z-index:1;font-size:11px;color:rgba(255,255,255,.25);letter-spacing:2px}\n.st{text-align:center;font-size:20px;font-weight:700;color:#f0ece4;margin:12px 0 4px}\n.sd{text-align:center;font-size:13px;color:rgba(255,255,255,.45);margin-bottom:20px}\n.dm{display:flex;align-items:center;margin-bottom:10px}\n.dm .l{width:56px;font-size:12px;color:rgba(255,255,255,.25)}\n.dm .b{flex:1;height:6px;background:rgba(255,255,255,.03);border-radius:3px;overflow:hidden}\n.dm .f{height:100%;border-radius:3px;transition:width 1s ease}\n.dm .v{width:32px;text-align:right;font-size:12px;font-weight:600}\n.cd{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:16px;margin-bottom:10px}\n.cd p{font-size:13px;color:rgba(255,255,255,.45);line-height:1.6}\n.st{font-size:16px;font-weight:700;color:#e8e4dc;margin:20px 0 12px}\n.cta{margin-top:24px;padding:24px 20px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border:1px solid rgba(255,255,255,.04);border-radius:16px;text-align:center}\n.cta h2{color:#e8e4dc;font-size:15px;margin-bottom:6px}\n.cta p{font-size:12px;color:rgba(255,255,255,.35);margin-bottom:12px}\n.cta .as{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}\n.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:8px;font-size:13px;z-index:2000;background:rgba(10,10,18,.9);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.04);display:none;max-width:300px;text-align:center;color:#fff}\n</style></head><body>\n<div class="container">\n<div class="header"><div class="logo">安柯耳<span>ai检测</span></div><div class="nav"><a href="/fenzhen/">分型</a><a href="/guide/">指南</a></div></div>\n<div class="hero"><div class="badge">AI 检测 · 免费</div><h1>3分钟<br/>看懂你的头皮</h1><p>上传照片，获取科学分析报告</p></div>\n<div class="uz" id="uz"><input type="file" id="fi" accept="image/*" style="display:none"/>\n<div class="icon">📱</div><div class="txt">点击上传头皮照片</div><div class="hint">自然光下拍摄发际线和头顶</div>\n<img id="pv" alt=""/></div></div>\n<div class="ov" id="ov"><div class="sp"></div><div class="text">AI 分析中...</div><div class="det" id="od"></div>\n<button class="btn btn-outline" onclick="rd()" style="margin-top:32px">取消</button></div>\n<div class="rp" id="rp">\n<div class="sc" id="sc" style="--p:75%"><div class="n" id="sn">0</div><div class="l">综合健康评分</div></div>\n<div class="st" id="ht">检测中...</div><div class="sd" id="sm"></div>\n<div class="st">📊 四维分析</div><div class="cd" id="dc"></div>\n<div class="st">💡 护理建议</div><div class="cd" id="tc"></div>\n<div class="cta"><h2>🎯 分享检测结果</h2><p>生成专属海报</p>\n<div class="as"><button class="btn btn-primary" onclick="gp()">✨ 海报</button>\n<button class="btn btn-outline" onclick="sr()">📤 分享</button></div></div></div>\n<div class="toast" id="tt"></div>\n<script>\nvar STEPS=["识别毛囊","分析油脂","评估屏障","计算密度","生成评分","完成"];\nvar cur=null;\nvar uz=document.getElementById(\'uz\'),fi=document.getElementById(\'fi\'),pv=document.getElementById(\'pv\');\nvar ov=document.getElementById(\'ov\'),od=document.getElementById(\'od\');\nvar rp=document.getElementById(\'rp\'),sn=document.getElementById(\'sn\'),sc=document.getElementById(\'sc\');\nvar ht=document.getElementById(\'ht\'),sm=document.getElementById(\'sm\');\nvar dc=document.getElementById(\'dc\'),tc=document.getElementById(\'tc\');\n\nuz.onclick=function(){fi.click()};\nfi.onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();\nr.onload=function(e){pv.src=e.target.result;pv.style.display=\'block\';uz.classList.add(\'has-img\');start()};\nr.readAsDataURL(f)};\n\nfunction start(){ov.classList.add(\'active\');var i=0;var t=setInterval(function(){i++;if(i<STEPS.length)od.textContent=STEPS[i];if(i>=6){clearInterval(t);done()}},800)}\nfunction done(){ov.classList.remove(\'active\');\nvar types=[\'油性头皮\',\'干性头皮\',\'混合性头皮\',\'敏感性头皮\',\'健康头皮\'];\nvar type=types[Math.floor(Math.random()*types.length)];\nvar score=Math.floor(Math.random()*30)+65;\nvar dims=[{l:\'油脂分泌\',s:type===\'油性头皮\'?55:Math.floor(Math.random()*35)+60},\n{l:\'水分含量\',s:Math.floor(Math.random()*30)+55},\n{l:\'发量密度\',s:Math.floor(Math.random()*25)+60},\n{l:\'头皮健康\',s:Math.floor(Math.random()*25)+65}];\nvar tips=[\'用氨基酸表活温和清洁，避免强力去油\',\'每周1-2次头皮深层清洁\',\'水温38℃左右，指腹按摩\',\'每2-3天洗一次\'];\nif(type===\'敏感性头皮\')tips[0]=\'暂停含香精酒精产品\';\ncur={score,type,dims,tips};show(cur)};\n\nfunction show(r){sn.textContent=r.score;sc.style.setProperty(\'--p\',r.score+\'%\');\nht.textContent=r.type;sm.textContent=r.score>=80?\'头皮状态优秀\':r.score>=70?\'基本健康\':\'需要开始护理了\';\ndc.innerHTML=\'\';for(var i=0;i<r.dims.length;i++){var d=r.dims[i];var c=d.s>=80?\'#64c882\':d.s>=65?\'#64b4ff\':\'#e8d5b7\';\ndc.innerHTML+=\'<div class="dm"><span class="l">\'+d.l+\'</span><div class="b"><div class="f" style="width:\'+d.s+\'%;background:\'+c+\'"></div></div><span class="v" style="color:\'+c+\'">\'+d.s+\'</span></div>\'}\ntc.innerHTML=\'\';for(var i=0;i<r.tips.length;i++){tc.innerHTML+=\'<p style="margin:0 0 6px;padding-left:16px">• <span style="color:rgba(255,255,255,.45)">\'+r.tips[i]+\'</span></p>\'}\nrp.classList.add(\'active\');window.scrollTo({top:rp.offsetTop-60,behavior:\'smooth\'})};\n\nfunction rd(){var e=document.querySelector(\'.ov.active\');if(e)e.classList.remove(\'active\')};\n\nfunction msg(m){var t=document.getElementById(\'tt\');t.textContent=m;t.style.display=\'block\';clearTimeout(t._t);t._t=setTimeout(function(){t.style.display=\'none\'},2500)};\n\nasync function gp(){if(!cur){msg(\'先完成检测\');return}msg(\'生成海报...\');\ntry{var s=cur.score;var t=encodeURIComponent(cur.type);\nvar w=window.open(\'/fenzhen/poster?s=\'+s+\'&t=\'+t+\'&kt=\'+Date.now(),\'_blank\',\'width=420,height=800\');\nif(w)msg(\'海报已生成\');else msg(\'请允许弹窗\')}catch(e){msg(\'失败: \'+e.message)}};\n\nfunction sr(){if(!cur)return;\nvar t=\'我的头皮健康分 \'+cur.score+\' 分！快来安柯耳测测你的头皮吧 https://airaquas.hair/\';\nif(navigator.share)navigator.share({title:\'安柯耳 AI 头皮健康\',text:t}).catch(function(){});\nelse navigator.clipboard.writeText(t).then(function(){msg(\'文案已复制!\')}).catch(function(){msg(\'截图分享给朋友\')})};\n</script></body></html>\n';

app.get('/fenzhen/detect', (c) => c.html(detectPageHtml));
app.get('/fenzhen/detect/', (c) => c.html(detectPageHtml));


app.get('/fenzhen/status', (c) => c.json({ ok: true, version: '3.3' }));

//=== POSTER (works via catch-all route) ===
app.get('/fenzhen/poster', (c) => {
  const s = c.req.query('s') || '78';
  const t = c.req.query('t') || 'mixed';
  return c.json({ code:0, data: { score: s, type: t, msg: 'ok' }});
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
