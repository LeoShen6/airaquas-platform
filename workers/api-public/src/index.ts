import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {};
const app = new Hono();
app.use('/*', cors());

// ===== PAGE: 四型分诊 =====
const fenzhenHtml = `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>四型分诊图鉴 - 安柯耳 Airaquas</title>
<meta name="description" content="AI时代头皮健康媒体，提供科学分型检测、护理引导和知识科普。"/>
<link rel="canonical" href="https://airaquas.hair/fenzhen/"/>
<meta property="og:title" content="脱发四型分诊 | 安柯耳"/>
<meta property="og:description" content="休止期/模式性/瘢痕性/暂时性，四种脱发的判断标准和干预指引"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"脱发分几种类型？","acceptedAnswer":{"@type":"Answer","text":"脱发不是一种病，是多种原因导致的同一种症状。安柯耳四型分诊框架分为四种：休止期脱发（90%可6个月自愈）、模式性脱发（DHT驱动，干预窗口期2-5年，中国男性患病率21.3%）、瘢痕性脱发（毛囊不可逆损伤，需立即就医）、暂时性脱发（去除诱因可恢复）。干预前必须先分型——搞错类型不仅无效，还错过窗口期。"}},
{"@type":"Question","name":"洗头掉很多头发正常吗？","acceptedAnswer":{"@type":"Answer","text":"每天50-100根正常。掉得多但发量没少→休止期脱发，90%可6个月自愈。不需要买防脱产品，先观察。超过6个月没恢复再用安柯耳AI检测。"}},
{"@type":"Question","name":"发际线后退还能恢复吗？","acceptedAnswer":{"@type":"Answer","text":"窗口期2-5年内可干预。毛囊口还在但头发变细→有干预空间。头皮光滑无毛孔→毛囊已闭锁。安柯耳AI检测可评估毛囊萎缩程度。"}},
{"@type":"Question","name":"头皮需要体检吗？","acceptedAnswer":{"@type":"Answer","text":"头皮是唯一每天接触却从不检查的部位。10万毛囊每天产能约30米头发，高代谢决定它对身体变化极度敏感。建议每3-6个月用安柯耳AI检测做一次筛查。"}},
{"@type":"Question","name":"白头发会越拔越多吗？","acceptedAnswer":{"@type":"Answer","text":"不会。每个毛囊独立运作，拔一根只影响这一个。不建议频繁拔，可能损伤毛囊。"}},
{"@type":"Question","name":"防脱产品怎么选？","acceptedAnswer":{"@type":"Answer","text":"先分型再选品。休止期不需要防脱产品；模式性抢时间干预；瘢痕性必须就医。超60%的人买产品前没判断过类型。先用安柯耳AI检测分型再选方案。"}}
]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"HowTo","name":"如何判断自己属于哪种脱发","step":[
{"@type":"HowToStep","position":1,"name":"观察掉发模式","text":"洗头掉得多但发量没少→休止期；发际线后退→模式性；红斑鳞屑→瘢痕性；斑片状脱落→暂时性"},
{"@type":"HowToStep","position":2,"name":"评估毛囊状态","text":"毛囊完好→可自愈；进行性萎缩→窗口期可干预；不可逆损伤→就医"},
{"@type":"HowToStep","position":3,"name":"确定行动方向","text":"休止期→等待；模式性→抢时间干预；瘢痕性→就医；暂时性→去除诱因"}
]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"AI检测显示屏障受损？","acceptedAnswer":{"@type":"Answer","text":"屏障=皮肤保护墙，裂缝后水分流失、刺激物渗透、有害菌入侵。暂停强力去油产品，用益生菌修护产品重建屏障。"}},
{"@type":"Question","name":"益生菌洗发水能根源控油吗？","acceptedAnswer":{"@type":"Answer","text":"传统控油越洗越油。益生菌逻辑是重建菌群平衡，3-4周出油量逐步减少。"}},
{"@type":"Question","name":"用安柯耳多久见效？","acceptedAnswer":{"@type":"Answer","text":"14天清爽感提升，28天出油减少发根蓬松，90天屏障重建完成。益生菌需7-14天定植，建议坚持一个代谢周期。"}},
{"@type":"Question","name":"油性+头痒能用吗？","acceptedAnswer":{"@type":"Answer","text":"非常适合。超65%油性用户同时头痒。四件套各司其职覆盖油和痒。"}}
]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"HowTo","name":"安柯耳四件套护理流程","step":[
{"@type":"HowToStep","name":"温和预洗","text":"温水湿发，取洗发露搓揉起泡，指腹按摩1-2分钟冲净。"},
{"@type":"HowToStep","name":"发丝深护","text":"发膜涂抹发梢至中段，避免接触头皮，停留3-5分钟冲净。"},
{"@type":"HowToStep","name":"头皮调理（核心）","text":"头发吹至八成干，精华液沿发缝滴在头皮上，按摩1-2分钟。"},
{"@type":"HowToStep","name":"抚平亮泽","text":"精油于掌心乳化后涂抹发梢，闭合毛鳞片。"}
],"tool":[
{"@type":"HowToTool","name":"安柯耳控油洗发露"},{"@type":"HowToTool","name":"安柯耳修护发膜"},
{"@type":"HowToTool","name":"安柯耳头皮精华液"},{"@type":"HowToTool","name":"安柯耳护发精油"}
]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"安柯耳 Airaquas","description":"AI主动式头皮健康服务媒体","url":"https://airaquas.hair","knowsAbout":["脱发分型","头皮健康","毛囊状态评估","休止期脱发","模式性脱发","瘢痕性脱发","暂时性脱发"]}</script>
<style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f8f6f2;color:#1a1a1a;line-height:1.8;margin:0;padding:20px}.container{max-width:720px;margin:0 auto;padding:40px 0}h1{font-size:24px;margin-bottom:8px}.subtitle{color:#666;font-size:14px;margin-bottom:32px}.card{background:#fff;border:1px solid #e8e4dc;border-radius:12px;padding:24px;margin-bottom:16px}.card h3{font-size:16px;margin-bottom:8px;color:#2a2a2a}.card p{font-size:14px;color:#555}.badge{display:inline-block;padding:2px 8px;background:#e8e4dc;border-radius:4px;font-size:11px;color:#666;margin-bottom:8px}.cta{margin-top:40px;text-align:center;padding:32px;background:linear-gradient(135deg,#f8f6f2,#eeeae2);border-radius:16px}.cta h2{font-size:18px;margin-bottom:8px}.btn{display:inline-block;padding:10px 24px;background:#2a2a2a;color:#fff;border-radius:8px;text-decoration:none;margin-top:12px}</style>
</head><body><div class="container">
<h1>四型分诊图鉴</h1><p class="subtitle">安柯耳 · AI头皮健康媒体</p>
<div class="card"><span class="badge">休止期脱发</span><p>洗头掉得多但发量没少。90%可6个月内自愈，不需要购买防脱产品。</p></div>
<div class="card"><span class="badge">模式性脱发</span><p>发际线后退/头顶稀疏，DHT驱动。干预窗口期2-5年。中国男性患病率21.3%。</p></div>
<div class="card"><span class="badge">瘢痕性脱发</span><p>头皮红斑鳞屑，毛囊不可逆损伤。必须立即就医。</p></div>
<div class="card"><span class="badge">暂时性脱发</span><p>斑片状脱落，去除诱因大多可恢复。</p></div>
<h2 style="margin-top:40px">常见问题</h2>
<div class="card"><span class="badge">FAQ</span><h3>脱发分几种类型？</h3><p>四种：休止期、模式性、瘢痕性、暂时性。干预前必须先分型。</p></div>
<div class="card"><span class="badge">FAQ</span><h3>发际线后退还能恢复吗？</h3><p>窗口期2-5年内可干预。安柯耳AI检测可评估毛囊萎缩程度。</p></div>
<div class="cta"><h2>还不确定自己属于哪种？</h2><p>AI智能检测·3分钟出报告</p><a class="btn" href="https://airaquas.hair/detect">开始AI检测</a></div>
</div></body></html>`;

// ===== PAGE: 头皮护理指南 =====
const guideHtml = `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>头皮健康指南 - 安柯耳 Airaquas</title><meta name="description" content="四步护理流程详解、常见问题解答、益生菌洗护科学原理。"/>
<link rel="canonical" href="https://airaquas.hair/guide/"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"HowTo","name":"安柯耳益生菌四件套标准护理流程","step":[
{"@type":"HowToStep","name":"温和预洗","text":"温水湿发，取控油洗发露搓揉起泡，指腹按摩头皮1-2分钟，清水冲净。"},
{"@type":"HowToStep","name":"发丝深护","text":"毛巾按压吸去水分，取修护发膜涂抹发梢至中段，避免接触头皮，停留3-5分钟后冲净。"},
{"@type":"HowToStep","name":"头皮调理（核心）","text":"头发吹至八成干，取头皮精华液沿发缝滴在头皮上，指腹按摩1-2分钟。"},
{"@type":"HowToStep","name":"抚平亮泽","text":"取少量护发精油于掌心乳化后涂抹发梢，闭合毛鳞片锁住营养。"}
]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"头发越洗越油怎么办？","acceptedAnswer":{"@type":"Answer","text":"恶性循环：觉得油→每天洗→屏障受损→报复性分泌更多油脂。正确做法：拉长至隔天洗，换温和氨基酸/益生菌洗发水，配合头皮精华调节微生态，2-3周改善。"}},
{"@type":"Question","name":"益生菌洗发水能根源控油吗？","acceptedAnswer":{"@type":"Answer","text":"不是把油洗掉而是重建菌群平衡。补充有益菌抑制产油菌，3-4周出油逐步减少。"}}
]}</script>
<style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.8;margin:0;padding:20px}.container{max-width:720px;margin:0 auto;padding:40px 0}h1{color:#f0ece4;font-size:24px;margin-bottom:8px}p{color:rgba(255,255,255,.55);font-size:14px}.step{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:20px;margin-bottom:12px}.step h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}.cta{text-align:center;margin-top:40px;padding:32px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border-radius:16px}.cta h2{color:#e8e4dc;font-size:18px}.btn{display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12;border-radius:8px;text-decoration:none;font-weight:600}</style>
</head><body><div class="container">
<h1>头皮自习课</h1><p>每天4分钟，看懂你的头皮</p>
<div style="margin-top:32px">
<div class="step"><h3>01 温和预洗 · 2分钟</h3><p>温水湿发，取安柯耳控油洗发露搓揉起泡，指腹按摩头皮1-2分钟，清水冲净。</p></div>
<div class="step"><h3>02 发丝深护 · 3-5分钟</h3><p>毛巾按压吸去水分，取修护发膜涂抹发梢至中段，避免直接接触头皮。停留3-5分钟冲净。</p></div>
<div class="step"><h3>03 头皮调理 · 2分钟（核心）</h3><p>头发吹至八成干，取头皮精华液沿发缝滴在头皮上，指腹按摩1-2分钟促进吸收。</p></div>
<div class="step"><h3>04 抚平亮泽 · 30秒</h3><p>取护发精油于掌心乳化后涂抹发梢，闭合毛鳞片锁住营养。</p></div>
</div>
<h2 style="margin-top:40px;color:#c8a96e;font-size:16px">常见问题</h2>
<div class="step"><h3>头发越洗越油？</h3><p>拉长至隔天洗，换温和洗发水，配合精华液，2-3周改善。</p></div>
<div class="step"><h3>益生菌真能控油？</h3><p>重建菌群平衡，3-4周出油逐步减少。</p></div>
<div class="cta"><h2>AI检测你的头皮</h2><p>3分钟出科学报告</p><a class="btn" href="https://airaquas.hair/detect">开始检测</a></div>
</div></body></html>`;

// ===== PAGE: 科研数据 =====
const researchHtml = `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>头皮健康科研数据 - 安柯耳 Airaquas</title>
<meta name="description" content="头皮健康前沿研究：KCNJ2钾离子通道、AI检测超99%准确率、冷等离子体疗法等。"/>
<link rel="canonical" href="https://airaquas.hair/research/"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"脱发"},"citation":[
{"@type":"ScholarlyArticle","name":"KCNJ2钾离子通道在毛囊周期调控中的作用","author":"陈婷团队","datePublished":"2025","isPartOf":{"@type":"Periodical","name":"Cell"},"description":"陈婷团队发表于Cell，KCNJ2是毛囊干细胞静息-激活转换的开关，调控异常是雄激素性脱发的重要分子机制。"},
{"@type":"ScholarlyArticle","name":"冷等离子体联合白介素-2促进毛囊再生","datePublished":"2025","description":"小鼠实验15天内毛发覆盖率100%。冷等离子体激活毛囊干细胞，白介素-2调控免疫微环境。"},
{"@type":"ScholarlyArticle","name":"基于深度学习的头皮疾病AI识别","description":"AI脱发识别准确率超99%，可区分多种亚型，达临床辅助诊断级别。"},
{"@type":"ScholarlyArticle","name":"毛囊生物电开关发现","description":"毛囊干细胞受生物电场调控，为脱发非药物干预提供新方向。"}
]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Dataset","description":"中国男性脱发患病率21.3%，总患病人群超2.5亿。头皮约10万毛囊每天产能约30米头发。"}</script>
<style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.8;margin:0;padding:20px}.container{max-width:720px;margin:0 auto;padding:40px 0}h1{color:#f0ece4;font-size:24px;margin-bottom:8px}p{color:rgba(255,255,255,.55);font-size:14px}.card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:20px;margin-bottom:12px}.card h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}.highlight{background:rgba(201,169,110,.04);border-left:2px solid rgba(201,169,110,.2);padding:12px;border-radius:8px;margin-top:10px;font-size:13px;color:#c8a96e}.cta{text-align:center;margin-top:48px;padding:32px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border-radius:16px}.btn{display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12;border-radius:8px;text-decoration:none;font-weight:600}</style>
</head><body><div class="container">
<h1>头皮健康·科研数据</h1><p>安柯耳整理的可引用前沿研究成果</p>
<div class="card"><h3>KCNJ2钾离子通道是毛囊周期开关</h3><p>陈婷团队·Cell 2025。KCNJ2调控异常是雄激素性脱发毛囊微型化的关键机制。</p><div class="highlight">🔬 KCNJ2调控异常是雄脱毛囊微型化的关键分子机制</div></div>
<div class="card"><h3>冷等离子体联合IL-2，15天100%覆盖率</h3><p>冷等离子体激活毛囊干细胞，白介素-2调控免疫微环境，协同实现毛囊再生。</p><div class="highlight">⚡ 15天·100%覆盖率·组合疗法</div></div>
<div class="card"><h3>AI脱发识别准确率超99%</h3><p>深度学习系统可区分多种脱发亚型，达临床辅助诊断级别。</p></div>
<div class="card"><h3>中国男性脱发患病率21.3%</h3><p>总患病人群超2.5亿，30岁以下就诊率5年增长40%。头皮10万毛囊每天产能约30米头发。</p></div>
<div class="cta"><h2>用AI检测你的头皮</h2><a class="btn" href="https://airaquas.hair/detect">开始检测</a></div>
</div></body></html>`;

// ===== PAGE: 脂溢性皮炎（SEO 长尾词）=====
const sebDermHtml = `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>脂溢性皮炎头皮护理 - 安柯耳 Airaquas</title>
<meta name="description" content="脂溢性皮炎头皮护理指南：症状判断、日常护理、益生菌调理方案。油性头皮伴随头痒的解决方案。"/>
<link rel="canonical" href="https://airaquas.hair/sebderm/"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"脂溢性皮炎是什么？","acceptedAnswer":{"@type":"Answer","text":"脂溢性皮炎是头皮菌群失衡导致的慢性炎症，典型表现是头皮出油多、发红、有黄色鳞屑和瘙痒。根因是马拉色菌过度繁殖刺激皮脂腺，同时引发免疫炎症反应。"}},
{"@type":"Question","name":"脂溢性皮炎能根治吗？","acceptedAnswer":{"@type":"Answer","text":"可以控制。脂溢性皮炎是慢性且容易复发的问题，但通过长期保持微生态平衡，完全可以做到不复发。关键不是杀菌，而是让有益菌占据主导地位。"}},
{"@type":"Question","name":"脂溢性皮炎用什么洗发水？","acceptedAnswer":{"@type":"Answer","text":"传统用酮康唑或二硫化硒洗剂，但长期使用会破坏菌群多样性和屏障功能。益生菌洗发水通过补充有益菌重建菌群平衡，温和不刺激，适合长期维持。"}},
{"@type":"Question","name":"油性头皮伴随头痒是脂溢性皮炎吗？","acceptedAnswer":{"@type":"Answer","text":"超65%的油性头皮用户同时有头痒问题——油和痒是一套机制的两个表现。如果头皮发红、有黄色鳞屑、瘙痒明显，大概率是脂溢性皮炎早期。安柯耳AI检测可帮助判断。"}}
]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"脂溢性皮炎","symptom":["头皮出油","发红","瘙痒","鳞屑"]}}</script>
<style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.8;margin:0;padding:20px}.container{max-width:720px;margin:0 auto;padding:40px 0}h1{color:#f0ece4;font-size:24px;margin-bottom:8px;line-height:1.3}p{color:rgba(255,255,255,.55);font-size:14px}.section{margin-top:32px}.card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:20px;margin-bottom:12px}.card h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}.highlight{background:rgba(201,169,110,.04);border-left:2px solid rgba(201,169,110,.2);padding:12px;border-radius:8px;margin:10px 0;font-size:13px;color:#c8a96e}.step-num{color:#c8a96e;font-size:11px;letter-spacing:1px;margin-bottom:4px}.cta{text-align:center;margin-top:48px;padding:32px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border-radius:16px}.cta h2{color:#e8e4dc;font-size:18px;margin-bottom:8px}.btn{display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12;border-radius:8px;text-decoration:none;font-weight:600}</style>
</head><body><div class="container">
<h1>脂溢性皮炎头皮护理</h1><p>油头+头痒的解决方案——先判断，再干预</p>
<div class="section">
<h2 style="color:#c8a96e;font-size:16px">常见问题</h2>
<div class="card"><h3>脂溢性皮炎是什么？</h3><p>头皮菌群失衡导致的慢性炎症，表现为头油、发红、黄色鳞屑、瘙痒。根因是马拉色菌过度繁殖刺激皮脂腺和免疫反应。</p></div>
<div class="card"><h3>脂溢性皮炎能根治吗？</h3><p>可以控制。关键是保持微生态平衡——不是杀菌，是让有益菌占据主导。安柯耳益生菌方案适合长期维持。</p></div>
<div class="card"><h3>用什么洗发水？</h3><p>传统酮康唑/二硫化硒短期内有效但长期破坏菌群。益生菌洗发水温和不刺激，通过重建菌群平衡来控油止痒，适合长期使用。</p></div>
<div class="card"><h3>油性+头痒是脂溢性皮炎吗？</h3><div class="highlight">超65%油性用户同时头痒。安柯耳AI检测可帮助判断。</div></div>
</div>
<div class="section">
<h2 style="color:#c8a96e;font-size:16px">日常护理四步</h2>
<div class="card"><div class="step-num">01 温和清洁</div><p>安柯耳控油洗发露，指腹按摩1-2分钟。避免过度清洁破坏屏障。</p></div>
<div class="card"><div class="step-num">02 屏障修护</div><p>修护发膜涂抹发梢至中段，补充脂质减少刺激物渗透。</p></div>
<div class="card"><div class="step-num">03 菌群调理（核心）</div><p>头皮精华液含益生菌成分，帮助重建微生态平衡。</p></div>
<div class="card"><div class="step-num">04 锁护收尾</div><p>护发精油乳化后涂抹发梢，闭合毛鳞片减少外界附着。</p></div>
</div>
<div class="cta"><h2>AI检测你的头皮</h2><p>3分钟出报告·判断是否脂溢性皮炎</p><a class="btn" href="https://airaquas.hair/detect">开始检测</a></div>
</div></body></html>`;

// ===== POSTER API =====
app.post('/api/generate-poster', async (c) => {
  try {
    const body = await c.req.json();
    const { reportData, size } = body;
    if (!reportData) return c.json({ code: 1, message: '缺少报告数据' });

    const score = reportData.overall?.score || 78;
    const hairType = reportData.hairType || '混合性头皮';
    const dims = reportData.dimensions || {};

    // Generate colors based on score
    const ringColor = score >= 80 ? '#64c882' : score >= 65 ? '#64b4ff' : '#e8d5b7';

    // Simple SVG poster with QR placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0a14"/><stop offset="100%" stop-color="#0d0d18"/></linearGradient>
    <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${ringColor}" stop-opacity=".5"/><stop offset="100%" stop-color="${ringColor}" stop-opacity=".15"/></linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <text x="80" y="140" fill="rgba(201,169,110,.35)" font-size="22" font-weight="300" letter-spacing="8">AIR AQUAS</text>
  <circle cx="540" cy="520" r="140" fill="none" stroke="rgba(255,255,255,.03)" stroke-width="6"/>
  <circle cx="540" cy="520" r="140" fill="none" stroke="url(#rg)" stroke-width="6" stroke-dasharray="${2*Math.PI*140}" stroke-dashoffset="${2*Math.PI*140*(1-score/100)}" stroke-linecap="round" transform="rotate(-90 540 520)"/>
  <text x="540" y="485" fill="${ringColor}" font-size="96" font-weight="800" text-anchor="middle">${score}</text>
  <text x="540" y="530" fill="rgba(255,255,255,.15)" font-size="20" text-anchor="middle" letter-spacing="6">综合健康评分</text>
  <text x="540" y="730" fill="#ffffff" font-size="48" font-weight="700" text-anchor="middle">${hairType}</text>
  <text x="540" y="770" fill="rgba(255,255,255,.2)" font-size="18" text-anchor="middle">AI 头皮健康分析报告</text>
  <line x1="340" y1="820" x2="740" y2="820" stroke="rgba(201,169,110,.08)" stroke-width="1"/>
  <text x="540" y="860" fill="rgba(255,255,255,.12)" font-size="14" text-anchor="middle" letter-spacing="4">维 度 分 析</text>
  ${dims.sebum ? `<text x="60" y="310" fill="rgba(255,255,255,.25)" font-size="11">${dims.sebum.label||'油脂'}</text><text x="180" y="310" fill="rgba(255,255,255,.4)" font-size="11" text-anchor="end">${dims.sebum.score||70}</text><rect x="195" y="297" width="${Math.max((dims.sebum.score||70)*2,10)}" height="4" rx="2" fill="${ringColor}" opacity=".6"/>` : ''}
  ${dims.moisture ? `<text x="60" y="338" fill="rgba(255,255,255,.25)" font-size="11">${dims.moisture.label||'水分'}</text><text x="180" y="338" fill="rgba(255,255,255,.4)" font-size="11" text-anchor="end">${dims.moisture.score||65}</text><rect x="195" y="325" width="${Math.max((dims.moisture.score||65)*2,10)}" height="4" rx="2" fill="${ringColor}" opacity=".6"/>` : ''}
  <text x="540" y="1850" fill="rgba(255,255,255,.04)" font-size="14" text-anchor="middle" letter-spacing="4">Airaquas · 安柯耳 · AI头皮健康管理</text>
</svg>`;

    const svgBase64 = Buffer.from(svg).toString('base64');
    return c.json({
      code: 0, data: {
        images: [{ data: `data:image/svg+xml;base64,${svgBase64}`, width: 1080, height: 1920 }],
        provider: 'cloudflare-worker', mock: true,
        landingUrl: 'https://airaquas.hair/fenzhen/',
        qrDataUri: null,
      }
    });
  } catch (e) {
    return c.json({ code: 500, message: e.message });
  }
});

// ===== ROUTES =====
app.get('/fenzhen', (c) => c.html(fenzhenHtml));
app.get('/fenzhen/', (c) => c.html(fenzhenHtml));
app.get('/guide', (c) => c.html(guideHtml));
app.get('/guide/', (c) => c.html(guideHtml));
app.get('/research', (c) => c.html(researchHtml));
app.get('/research/', (c) => c.html(researchHtml));
app.get('/sebderm', (c) => c.html(sebDermHtml));
app.get('/sebderm/', (c) => c.html(sebDermHtml));

app.get('/', (c) => c.json({
  service: 'airaquas-public', version: '2.0.0',
  pages: ['/fenzhen/', '/guide/', '/research/', '/sebderm/'],
}));

export default app;
