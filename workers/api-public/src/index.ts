import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {};
const app = new Hono();
app.use('/*', cors());

//==================================================================
//  PAGE HELPER
//==================================================================
function page(title, desc, canonical, ldScripts, bodyHTML) {
  const lds = ldScripts.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  return `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title><meta name="description" content="${desc}"/>
<link rel="canonical" href="https://airaquas.hair${canonical}"/>
${lds}
<style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.8;margin:0;padding:20px}.container{max-width:720px;margin:0 auto;padding:40px 0}.head{margin-bottom:32px}.head h1{color:#f0ece4;font-size:24px;margin:0 0 4px}.head p{color:rgba(255,255,255,.45);font-size:14px;margin:0}.card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:20px;margin-bottom:12px}.card h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}.card p{color:rgba(255,255,255,.55);font-size:14px;margin:0}.highlight{background:rgba(201,169,110,.04);border-left:2px solid rgba(201,169,110,.2);padding:12px;border-radius:8px;margin:10px 0;font-size:13px;color:#c8a96e}.tag{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;margin-bottom:8px;background:rgba(201,169,110,.1);color:#c8a96e}.cta{text-align:center;margin-top:48px;padding:32px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border-radius:16px}.cta h2{color:#e8e4dc;font-size:18px;margin-bottom:8px}.cta p{color:rgba(255,255,255,.35);font-size:13px}.btn{display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px;font-size:14px}</style>
</head><body><div class="container">
<div class="head"><h1>${title.split(' - ')[0]}</h1><p>${desc}</p></div>
${bodyHTML}
<div class="cta"><h2>AI检测你的头皮</h2><p>3分钟出科学报告</p><a class="btn" href="https://airaquas.hair/detect">开始检测</a></div>
</div></body></html>`;
}

function faqCard(q, a) {
  return `<div class="card"><h3>${q}</h3><p>${a}</p></div>`;
}

//==================================================================
//  FENZHEN
//==================================================================
const fenzhenHtml = page('四型分诊图鉴 - 安柯耳 Airaquas',
  'AI时代头皮健康媒体，提供科学分型检测、护理引导和知识科普。', '/fenzhen/',
  [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"脱发分几种类型？","acceptedAnswer":{"@type":"Answer","text":"脱发不是一种病。安柯耳四型分诊框架分为四种：休止期（90%可6个月自愈）、模式性（DHT驱动，男性患病率21.3%）、瘢痕性（毛囊不可逆损伤）、暂时性。干预前必须分型。"}},
      {"@type":"Question","name":"洗头掉很多头发正常吗？","acceptedAnswer":{"@type":"Answer","text":"每天50-100根正常。掉得多但发量没少→休止期脱发，90%可自愈。观察6个月，没恢复再用AI检测。"}},
      {"@type":"Question","name":"发际线后退还能恢复吗？","acceptedAnswer":{"@type":"Answer","text":"窗口期2-5年内可干预。毛孔还在但头发变细↔还有干预空间。"}},
      {"@type":"Question","name":"头皮需要体检吗？","acceptedAnswer":{"@type":"Answer","text":"10万毛囊每天产能约30米头发，建议每3-6个月做一次AI筛查。"}},
      {"@type":"Question","name":"防脱产品怎么选？","acceptedAnswer":{"@type":"Answer","text":"先分型再选品。超60%的人买产品前没判断过自己属于哪种。"}}
    ]},
    {"@context":"https://schema.org","@type":"HowTo","name":"如何判断自己属于哪种脱发","step":[
      {"@type":"HowToStep","position":1,"name":"观察掉发模式","text":"洗头掉得多→休止期；发际线后退→模式性；红斑鳞屑→瘢痕性；斑片状→暂时性"},
      {"@type":"HowToStep","position":2,"name":"评估毛囊状态","text":"完好↔可自愈；萎缩↔可干预；闭锁↔就医"},
      {"@type":"HowToStep","position":3,"name":"确定行动","text":"休止期↔等待；模式性↔抢时间；瘢痕性↔就医；暂时性↔去诱因"}
    ]},
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"益生菌洗发水能根源控油吗？","acceptedAnswer":{"@type":"Answer","text":"传统控油越洗越油。益生菌逻辑是重建菌群平衡，3-4周出油逐步减少。"}},
      {"@type":"Question","name":"用安柯耳多久见效？","acceptedAnswer":{"@type":"Answer","text":"14天清爽感提升，28天出油减少，90天屏障重建完成。"}},
      {"@type":"Question","name":"油性+头痒能用吗？","acceptedAnswer":{"@type":"Answer","text":"超65%油性用户同时头痒。四件套各司其职覆盖油和痒。"}}
    ]},
    {"@context":"https://schema.org","@type":"HowTo","name":"安柯耳四件套护理流程","step":[
      {"@type":"HowToStep","name":"温和预洗","text":"取洗发露按摩1-2分钟冲净。"},
      {"@type":"HowToStep","name":"发丝深护","text":"发膜涂发梢3-5分钟冲净。"},
      {"@type":"HowToStep","name":"头皮调理（核心）","text":"精华液沿发缝滴在头皮上按摩1-2分钟。"},
      {"@type":"HowToStep","name":"抚平亮泽","text":"精油涂抹发梢闭合毛鳞片。"}
    ]},
    {"@context":"https://schema.org","@type":"Organization","name":"安柯耳 Airaquas","description":"AI主动式头皮健康服务媒体","url":"https://airaquas.hair","knowsAbout":["脱发分型","头皮健康","毛囊状态评估"]}
  ],
  `<div class="card"><span class="tag">休止期脱发</span><p>洗头掉得多但发量没少。90%可6个月自愈，不需要买防脱产品。</p></div>
<div class="card"><span class="tag">模式性脱发</span><p>发际线后退/头顶稀疏。DHT驱动，干预窗口期2-5年。中国男性患病率21.3%。</p></div>
<div class="card"><span class="tag">瘢痕性脱发</span><p>头皮红斑鳞屑，毛囊不可逆损伤。必须就医。</p></div>
<div class="card"><span class="tag">暂时性脱发</span><p>斑片状脱落，去除诱因可恢复。</p></div>`);

//==================================================================
//  GUIDE
//==================================================================
const guideHtml = page('头皮健康指南 - 安柯耳 Airaquas',
  '四步护理流程详解、常见问题解答、益生菌洗护科学原理。', '/guide/',
  [
    {"@context":"https://schema.org","@type":"HowTo","name":"安柯耳益生菌护理流程","step":[
      {"@type":"HowToStep","name":"温和预洗","text":"温水湿发，取洗发露搓揉起泡，指腹按摩1-2分钟冲净。"},
      {"@type":"HowToStep","name":"发丝深护","text":"发膜涂抹发梢至中段，避免接触头皮，停留3-5分钟冲净。"},
      {"@type":"HowToStep","name":"头皮调理（核心）","text":"头发吹至八成干，精华液沿发缝滴在头皮上，按摩1-2分钟。"},
      {"@type":"HowToStep","name":"抚平亮泽","text":"精油于掌心乳化后涂抹发梢。"}
    ]},
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"头发越洗越油怎么办？","acceptedAnswer":{"@type":"Answer","text":"恶性循环：觉得油→每天洗→屏障受损→越洗越油。拉长至隔天洗，换温和益生菌洗发水，2-3周改善。"}},
      {"@type":"Question","name":"益生菌能根源控油吗？","acceptedAnswer":{"@type":"Answer","text":"不是把油洗掉而是重建菌群平衡，3-4周出油减少。"}}
    ]}
  ],
  `<div class="card"><h3>01 温和预洗 · 2分钟</h3><p>安柯耳控油洗发露，指腹按摩1-2分钟冲净。</p></div>
<div class="card"><h3>02 发丝深护 · 3-5分钟</h3><p>修护发膜涂发梢至中段，避免接触头皮。</p></div>
<div class="card"><h3>03 头皮调理 · 2分钟（核心）</h3><p>精华液沿发缝滴在头皮上按摩1-2分钟。</p></div>
<div class="card"><h3>04 抚平亮泽 · 30秒</h3><p>精油乳化后涂抹发梢闭合毛鳞片。</p></div>`);

//==================================================================
//  RESEARCH
//==================================================================
const researchHtml = page('头皮健康科研数据 - 安柯耳 Airaquas',
  '头皮健康前沿研究：KCNJ2、AI检测超99%、冷等离子体等。', '/research/',
  [
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"脱发"},"citation":[
      {"@type":"ScholarlyArticle","name":"KCNJ2钾离子通道在毛囊周期调控中的作用","author":"陈婷团队","datePublished":"2025","isPartOf":{"@type":"Periodical","name":"Cell"},"description":"KCNJ2是毛囊干细胞静息-激活转换的开关。"},
      {"@type":"ScholarlyArticle","name":"冷等离子体联合白介素-2促进毛囊再生","description":"小鼠15天内毛发覆盖率100%。"},
      {"@type":"ScholarlyArticle","name":"基于深度学习的头皮疾病AI识别","description":"AI脱发识别准确率超99%。"},
      {"@type":"ScholarlyArticle","name":"毛囊生物电开关发现","description":"为脱发非药物干预提供新方向。"}
    ]},
    {"@context":"https://schema.org","@type":"Dataset","name":"中国脱发流行病学数据","description":"男性脱发患病率21.3%，总人群超2.5亿。"}
  ],
  `<div class="card"><span class="tag">Cell 2025</span><h3>KCNJ2钾离子通道是毛囊周期开关</h3><p>陈婷团队，KCNJ2调控异常是雄脱毛囊微型化的关键机制。</p><div class="highlight">🔬 KCNJ2调控异常是雄激素性脱发的重要分子机制</div></div>
<div class="card"><span class="tag">物理疗法</span><h3>冷等离子体联合IL-2，15天100%覆盖率</h3><p>冷等离子体激活毛囊干细胞，IL-2调控免疫微环境。</p><div class="highlight">⚡ 15天·100%覆盖率·组合疗法</div></div>
<div class="card"><span class="tag">AI检测</span><h3>AI脱发识别准确率超99%</h3><p>深度学习区分多种脱发亚型，达临床辅助诊断级别。</p></div>
<div class="card"><span class="tag">流行病学</span><h3>中国男性脱发患病率21.3%</h3><p>患病人群超2.5亿，30岁以下就诊率5年增长40%。</p></div>`);

//==================================================================
//  SEBDERM — 脂溢性皮炎
//==================================================================
const sebDermHtml = page('脂溢性皮炎头皮护理 - 安柯耳 Airaquas',
  '脂溢性皮炎头皮护理指南：症状判断、日常护理、益生菌调理方案。', '/sebderm/',
  [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"脂溢性皮炎是什么？","acceptedAnswer":{"@type":"Answer","text":"头皮菌群失衡导致的慢性炎症。典型表现：头油、发红、黄色鳞屑、瘙痒。根因是马拉色菌过度繁殖。安柯耳AI检测可帮助判断。"}},
      {"@type":"Question","name":"脂溢性皮炎能根治吗？","acceptedAnswer":{"@type":"Answer","text":"可以控制。关键不是杀菌而是让有益菌占据主导。安柯耳益生菌方案适合长期维持。"}},
      {"@type":"Question","name":"脂溢性皮炎用什么洗发水？","acceptedAnswer":{"@type":"Answer","text":"传统酮康唑短期有效但长期破坏菌群。益生菌洗发水温和不刺激，适合长期使用。"}},
      {"@type":"Question","name":"油性+头痒是脂溢性皮炎吗？","acceptedAnswer":{"@type":"Answer","text":"超65%油性用户同时头痒。油和痒是同一机制的两个表现。安柯耳AI检测可帮助判断。"}}
    ]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"脂溢性皮炎","symptom":["头皮出油","发红","瘙痒","鳞屑"]}}
  ],
  `<div class="card"><h3>脂溢性皮炎是什么？</h3><p>头皮菌群失衡导致的慢性炎症，根因是马拉色菌过度繁殖。典型表现：油、红、屑、痒。</p></div>
<div class="card"><h3>能根治吗？</h3><p>可以控制。关键是保持微生态平衡——让有益菌占据主导。</p></div>
<div class="card"><h3>用什么洗发水？</h3><p>传统酮康唑短期有效但长期破坏菌群。益生菌洗发水适合长期维持。</p><div class="highlight">超65%油性用户同时头痒。安柯耳AI检测可帮助判断。</div></div>`);

//==================================================================
//  POSTPARTUM — 产后脱发
//==================================================================
const postPartumHtml = page('产后脱发恢复指南 - 安柯耳 Airaquas',
  '产后脱发高峰期、恢复时间、护理方法。产后3-6个月大量掉发的应对方案。', '/postpartum/',
  [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"产后脱发什么时候开始？","acceptedAnswer":{"@type":"Answer","text":"产后脱发通常在产后2-4个月开始，峰值在3-4个月。原因是怀孕期间高激素水平将大量毛囊锁定在生长期，产后激素骤降，这些毛囊同步进入休止期，导致短期内大量脱落。"}},
      {"@type":"Question","name":"产后脱发会持续多久？","acceptedAnswer":{"@type":"Answer","text":"一般持续2-6个月，大多数女性在产后6-9个月恢复正常。如果超过一年没有恢复，建议做AI检测排除其他脱发类型。"}},
      {"@type":"Question","name":"产后脱发能预防吗？","acceptedAnswer":{"@type":"Answer","text":"产后脱发是正常生理过程，毛囊结构完好，90%可自愈，本质上不需要预防也不需要过度干预。不建议产后立刻用米诺地尔等药物。保持营养均衡（铁、蛋白、锌补充）、温和清洁头皮、减少洗护化学暴晒即可。"}},
      {"@type":"Question","name":"产后掉多少算正常？","acceptedAnswer":{"@type":"Answer","text":"正常每天50-100根。产后高峰期每天可能掉200-400根。关键看发量——如果整体发量没有明显减少，只是洗头梳头掉得多，属于休止期脱发的典型表现。毛囊完好，6个月左右自愈。"}},
      {"@type":"Question","name":"哺乳期能剃光头让头发重新长吗？","acceptedAnswer":{"@type":"Answer","text":"不能。剃光头改变的是毛干长度，不是毛囊状态。产后脱发的根因是毛囊同步进入休止期，毛囊本身在不同阶段自然工作——剃不剃对毛囊周期无影响。哺乳期梳头轻柔、避免拉扯有好处，但剃光头没必要。"}}
    ]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"产后脱发","symptom":["大量掉发","发量减少","头皮敏感"]}},
    {"@context":"https://schema.org","@type":"Dataset","name":"产后脱发流行病学数据","description":"产后脱发发生率约40-50%，多在产后3-6个月自行恢复。属于休止期脱发的典型亚型。"}
  ],
  `<div class="card"><span class="tag">FAQ</span><h3>产后脱发什么时候开始？</h3><p>产后2-4个月开始，3-4个月是峰值。激素骤降导致大量毛囊同步进入休止期。</p><div class="highlight">产后脱发发生率约40-50%，大多3-6个月自行恢复。</div></div>
<div class="card"><span class="tag">FAQ</span><h3>产后脱发会持续多久？</h3><p>一般2-6个月，多数6-9个月恢复。超过一年建议AI检测。</p></div>
<div class="card"><span class="tag">FAQ</span><h3>哺乳期能剃头吗？</h3><p>剃头不改变毛囊周期。温柔梳头有好处，剃头没必要。</p></div>`);

//==================================================================
//  ALOPECIA AREATA — 斑秃
//==================================================================
const alopeciaAreataHtml = page('斑秃（鬼剃头）的应对 - 安柯耳 Airaquas',
  '斑秃的原因、能否自愈、治疗方法和注意事项。突然出现圆形脱发区域的应对方案。', '/alopecia-areata/',
  [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"斑秃是什么原因引起的？","acceptedAnswer":{"@type":"Answer","text":"斑秃（鬼剃头）是自身免疫系统攻击毛囊导致的突发性脱发。免疫系统将毛囊识别为外敌并攻击其生长期结构。常见诱因包括：精神压力（60%以上的斑秃患者发病前有重大压力事件）、病毒感染、遗传易感性。毛囊没有被永久破坏——攻击停止后毛发可以再生。"}},
      {"@type":"Question","name":"斑秃能自愈吗？","acceptedAnswer":{"@type":"Answer","text":"约50-60%的轻度斑秃患者可在1年内自发恢复。斑秃进展程度和恢复概率直接相关：单个斑块（80%可恢复）、多个斑块（50-60%普秃/全秃（恢复率较低）。自愈的关键是去除诱因和停止自身免疫攻击。"}},
      {"@type":"Question","name":"斑秃和脂溢性皮炎的区别？","acceptedAnswer":{"@type":"Answer","text":"斑秃是免疫系统攻击毛囊，表现为边界清晰的圆形脱发区，皮肤表面正常。脂溢性皮炎是真菌繁殖引起的炎症，表现为弥漫性头油、红斑、鳞屑和瘙痒。两者机制完全不一样。安柯耳AI检测可以区分。"}},
      {"@type":"Question","name":"斑秃需要治疗吗？","acceptedAnswer":{"@type":"Answer","text":"单个小斑块可以先观察1-3个月。如果斑块扩大或增多，建议就医。常用治疗方式包括局部激素、接触免疫疗法。米诺地尔可辅助促进休止期毛囊进入生长期。斑秃期间避免过度刺激头皮。"}},
      {"@type":"Question","name":"斑秃会复发吗？","acceptedAnswer":{"@type":"Answer","text":"约30-50%的斑秃患者会复发。复发通常与压力再次暴露、感染、免疫系统状态变化有关。长期管理应关注免疫调节、压力管理、避免过度清洁损伤屏障。"}}
    ]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"斑秃","symptom":["圆形脱发","突发性脱发","头皮光滑"]}}
  ],
  `<div class="card"><span class="tag">FAQ</span><h3>斑秃是什么原因？</h3><p>免疫系统攻击毛囊导致的突发性脱发。60%患者发病前有重大压力事件。</p></div>
<div class="card"><span class="tag">FAQ</span><h3>斑秃能自愈吗？</h3><p>50-60%轻度斑秃可在1年内自发恢复。单个斑块恢复率约80%。</p><div class="highlight">斑秃和脂溢性皮炎机制完全不同。AI检测可区分。</div></div>
<div class="card"><span class="tag">FAQ</span><h3>斑秃会复发吗？</h3><p>约30-50%会复发。避免压力、温和护理有助于长期管理。</p></div>`);

//==================================================================
//  SEASONAL — 季节性脱发
//==================================================================
const seasonalHtml = page('季节性脱发应对指南 - 安柯耳 Airaquas',
  '季节性脱发的原因、持续时间和应对方法。秋季头发掉得多怎么办？', '/seasonal/',
  [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"季节性脱发是真的吗？","acceptedAnswer":{"@type":"Answer","text":"真的。多项研究确认每年夏末到秋初（9-11月）是毛发脱落最多的时期。毛囊对光周期（日照时长）敏感——夏季日照时间长时处于生长期毛囊比例增加，日照变短后天凉，大量毛囊同步进入休止期，秋末冬初是休止期结束脱落的集中期。这是哺乳动物的进化保留机制。"}},
      {"@type":"Question","name":"季节性脱发掉多少算正常？","acceptedAnswer":{"@type":"Answer","text":"比平时多30-40%属于正常范围。平时每天50-100根，季节性高峰期可能达到100-150根。如果超过200根/天，或者超过2-3个月没有恢复，建议做AI检测判断是否是病理性脱发。季节性脱发的特征是掉发集中在9-11月，其他季节基本正常。"}},
      {"@type":"Question","name":"秋季脱发严重怎么办？","acceptedAnswer":{"@type":"Answer","text":"秋季脱发是正常生理周期，不需要恐慌。建议：保持头皮温和清洁，避免强力去油产品破坏屏障；继续正常营养摄入（铁、锌、蛋白不足会加重脱发）；减少热造型和化学烫染；不要秋季开始强力防脱药物——错误的时机不仅无效，还可能干扰正常周期。使用AI检测可以区分季节性脱发和其他脱发类型。"}},
      {"@type":"Question","name":"季节性脱发持续多久？","acceptedAnswer":{"@type":"Answer","text":"一般持续1-3个月，集中在10-11月达到高峰，之后逐渐恢复。如果次年春季出油增加时仍有大量掉发，可能是其他类型脱发被季节性放大了。安柯耳AI检测可以区分。"}},
      {"@type":"Question","name":"为什么很多人秋季掉发多？","acceptedAnswer":{"@type":"Answer","text":"进化上毛囊保留了对光周期的记忆能力。短日照信号促使更多毛囊进入休止期，减少秋冬季的能量消耗。人类虽然已经不再像哺乳动物那样换毛，但这个原始的基因调控机制仍然存在。这就是为什么秋冬掉发是一个规律性的现象。"}}
    ]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"季节性脱发","symptom":["秋季掉发增多","正常发量","周期性脱落"]}}
  ],
  `<div class="card"><span class="tag">FAQ</span><h3>季节性脱发是真的吗？</h3><p>真的。9-11月是毛发脱落最多的时间，哺乳动物进化保留机制。</p><div class="highlight">比平时多30-40%属于正常。超过200根/天或持续3个月以上建议AI检测。</div></div>
<div class="card"><span class="tag">FAQ</span><h3>秋季掉发多怎么办？</h3><p>保持温和清洁、正常营养、减少热造型。不要秋季开始强力防脱药物。</p></div>
<div class="card"><span class="tag">FAQ</span><h3>季节性脱发持续多久？</h3><p>一般1-3个月，10-11月高峰后逐步恢复。</p></div>`);

//==================================================================
//  DANDRUFF — 头皮屑/马拉色菌
//==================================================================
const dandruffHtml = page('头皮屑的真菌原因与护理 - 安柯耳 Airaquas',
  '头皮屑是马拉色菌引起的吗？为什么越洗越多？科学去屑的方法。', '/dandruff/',
  [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"头皮屑是细菌还是真菌引起的？","acceptedAnswer":{"@type":"Answer","text":"头皮屑主要由真菌——马拉色菌（Malassezia）过度繁殖引起。马拉色菌是头皮正常菌群的一员，但在油脂丰富的环境中容易过度繁殖。它分解皮脂产生的游离脂肪酸会刺激头皮，加速角质细胞脱落，形成肉眼可见的白色鳞屑（头皮屑）。传统去屑洗发水含吡硫翁锌或酮康唑来抑制马拉色菌，但长期使用可能导致菌群多样性下降。"}},
      {"@type":"Question","name":"为什么头皮屑越洗越多？","acceptedAnswer":{"@type":"Answer","text":"典型错误：感觉有头皮屑→每天强力去屑洗→屏障受损→马拉色菌更容易入侵→更多头皮屑。正确做法：拉长洗头间隔（隔天或三天），换成温和的氨基酸/益生菌洗发水重建菌群平衡。益生菌洗发水不是杀真菌，而是通过补充有益菌让马拉色菌自然减少。"}},
      {"@type":"Question","name":"益生菌能去屑吗？","acceptedAnswer":{"@type":"Answer","text":"益生菌去屑的逻辑是微生态竞争——通过补充有益菌占据生态位，抑制马拉色菌过度繁殖。不含强效去屑成分，温和且适合长期维持。一般2-3周见效，效果不是爆发式的，而是逐步减少。适合轻中度头皮屑且追求温和护理的用户。重度头皮屑建议先就医。"}},
      {"@type":"Question","name":"头皮屑和脂溢性皮炎什么关系？","acceptedAnswer":{"@type":"Answer","text":"头皮屑是脂溢性皮炎的最早期表现。脂溢性皮炎有四个阶段：干燥型头皮屑→油腻型头皮屑→头皮发红瘙痒→明显皮炎。头皮屑阶段往往是菌群刚开始失衡还不到炎症水平。安柯耳AI检测可以评估是否已经发展到需要就医的阶段。"}},
      {"@type":"Question","name":"去屑洗发水要交替用吗？","acceptedAnswer":{"@type":"Answer","text":"传统含药的去屑洗发水（酮康唑、二硫化硒、吡硫翁锌）确实建议交替使用，避免马拉色菌产生抗药性。但益生菌类产品不需要交替——它的作用机制不是杀菌而是微生态竞争，不产生抗药性。轻度头皮屑建议先用AI检测判断阶段，再决定用温和护理还是药物。"}}
    ]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"头皮屑","symptom":["白色鳞屑","头皮瘙痒","油脂过多"]}}
  ],
  `<div class="card"><span class="tag">FAQ</span><h3>头皮屑是真菌引起的？</h3><p>马拉色菌分解皮脂产生游离脂肪酸，加速角质脱落形成头皮屑。</p><div class="highlight">益生菌去屑：补充有益菌竞争生态位，2-3周见效，温和无抗药性。</div></div>
<div class="card"><span class="tag">FAQ</span><h3>为什么越洗越多？</h3><p>每天强力去屑→屏障受损→马拉色菌更容易入侵。拉长间隔+益生菌洗发水。</p></div>
<div class="card"><span class="tag">FAQ</span><h3>头皮屑和脂溢性皮炎的关系？</h3><p>头皮屑是最早期表现。AI检测可判断是否已到需要就医的阶段。</p></div>`);

//==================================================================
//  FOLLICULITIS — 毛囊炎
//==================================================================
const folliculitisHtml = page('头皮毛囊炎的原因与护理 - 安柯耳 Airaquas',
  '头皮长痘痘是毛囊炎吗？毛囊炎和普通痘痘的区别、护理方法。', '/folliculitis/',
  [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"头皮上长痘痘是毛囊炎吗？","acceptedAnswer":{"@type":"Answer","text":"头皮上发红、有白头的"痘痘"大概率是毛囊炎——毛囊被细菌（主要是金黄色葡萄球菌）感染后发炎。与面部痤疮不同，头皮毛囊炎的根因通常是毛囊口被油脂和老废角质堵塞后细菌繁殖。区别方法：毛囊炎通常伴随瘙痒或疼痛，有明确的白色脓头，而普通头皮粉刺没有发炎表现。"}},
      {"@type":"Question","name":"毛囊炎会脱发吗？","acceptedAnswer":{"@type":"Answer","text":"单个、非反复发作的毛囊炎通常不会导致永久性脱发。但反复发作的严重毛囊炎如果损伤到毛囊干细胞层，可能导致毛囊闭锁和局部脱发。这叫瘢痕性脱发——也是为什么毛囊炎反复发作时需要及时处理，不能放任不管。安柯耳AI检测可以评估毛囊是否已经有不可逆损伤。"}},
      {"@type":"Question","name":"毛囊炎用什么洗发水？","acceptedAnswer":{"@type":"Answer","text":"急性期可以使用含酮康唑或水杨酸的抗炎洗发水，配合医生开的外用抗生素。但不要长期使用——它会杀死有益菌。恢复期切换到益生菌洗发水重建正常菌群。关键是找到毛囊炎反复发作的根因：清洁过度还是不足？屏障受损？免疫状态下降？安柯耳AI检测可以提供参考。"}},
      {"@type":"Question","name":"毛囊炎能自愈吗？","acceptedAnswer":{"@type":"Answer","text":"轻度的单个毛囊炎可以自愈（1-2周）。但如果反复发作、范围扩大、伴有明显脱发、或持续超过4周没有好转，建议就医排查是否与免疫状态、糖尿病或严重的菌群失调有关。"}},
      {"@type":"Question","name":"毛囊炎和脂溢性皮炎的区别？","acceptedAnswer":{"@type":"Answer","text":"毛囊炎是细菌感染导致的单个毛囊炎症，有明确的脓头、瘙痒或疼痛。脂溢性皮炎是真菌（马拉色菌）过度繁殖导致的慢性炎症，表现为弥漫性的头油、发红、鳞屑。安柯耳AI检测可以区分两者。"}}
    ]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"毛囊炎","symptom":["头皮痘痘","脓头","瘙痒","疼痛"]}}
  ],
  `<div class="card"><span class="tag">FAQ</span><h3>头皮上的痘痘是毛囊炎吗？</h3><p>发红、有白头的痘痘大概率是毛囊炎。伴随瘙痒或疼痛。</p><div class="highlight">反复发作的毛囊炎可能导致毛囊闭锁——和瘢痕性脱发直接相关。</div></div>
<div class="card"><span class="tag">FAQ</span><h3>毛囊炎会脱发吗？</h3><p>单次不会。但反复发作且损伤毛囊干细胞层会导致永久性脱发。</p></div>
<div class="card"><span class="tag">FAQ</span><h3>毛囊炎用什么？</h3><p>急性期用抗炎洗发水，恢复期切换益生菌洗发水重建菌群。</p></div>`);

//==================================================================
//  POSTER API
//==================================================================
app.post('/poster-api', async (c) => {
  try {
    const body = await c.req.json();
    const { reportData, size } = body;
    if (!reportData) return c.json({ code: 1, message: '缺少报告数据' });

    const score = reportData.overall?.score || 78;
    const hairType = reportData.hairType || '混合性头皮';
    const dims = reportData.dimensions || {};
    const ringColor = score >= 80 ? '#64c882' : score >= 65 ? '#64b4ff' : '#e8d5b7';

    // Build dimension bars SVG
    let dimSVG = '';
    let y = 310;
    for (const key of ['sebum', 'moisture', 'density', 'health']) {
      const d = dims[key];
      if (!d) continue;
      const label = d.label || { sebum: '油脂', moisture: '水分', density: '密度', health: '健康' }[key] || key;
      const val = d.score || 70;
      dimSVG += `<text x="60" y="${y}" fill="rgba(255,255,255,.25)" font-size="11">${label}</text><text x="180" y="${y}" fill="rgba(255,255,255,.4)" font-size="11" text-anchor="end">${val}</text><rect x="195" y="${y-13}" width="${Math.max(val*2, 10)}" height="4" rx="2" fill="${ringColor}" opacity=".6"/>`;
      y += 28;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0a14"/><stop offset="100%" stop-color="#0d0d18"/></linearGradient>
  <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${ringColor}" stop-opacity=".5"/><stop offset="100%" stop-color="${ringColor}" stop-opacity=".15"/></linearGradient></defs>
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
  ${dimSVG}
  <text x="540" y="1850" fill="rgba(255,255,255,.04)" font-size="14" text-anchor="middle" letter-spacing="4">Airaquas · 安柯耳 · AI头皮健康管理</text>
</svg>`;
    const svgBase64 = Buffer.from(svg).toString('base64');
    return c.json({
      code: 0, data: {
        images: [{ data: `data:image/svg+xml;base64,${svgBase64}`, width: 1080, height: 1920, mimeType: 'image/svg+xml' }],
        provider: 'cloudflare-worker', mock: true,
        landingUrl: 'https://airaquas.hair/fenzhen/',
        qrDataUri: null,
      }
    });
  } catch (e) {
    return c.json({ code: 500, message: e.message });
  }
});

//==================================================================
//  ROUTES
//==================================================================
app.get('/fenzhen', (c) => c.html(fenzhenHtml));
app.get('/fenzhen/', (c) => c.html(fenzhenHtml));
app.get('/guide', (c) => c.html(guideHtml));
app.get('/guide/', (c) => c.html(guideHtml));
app.get('/research', (c) => c.html(researchHtml));
app.get('/research/', (c) => c.html(researchHtml));
app.get('/sebderm', (c) => c.html(sebDermHtml));
app.get('/sebderm/', (c) => c.html(sebDermHtml));
app.get('/postpartum', (c) => c.html(postPartumHtml));
app.get('/postpartum/', (c) => c.html(postPartumHtml));
app.get('/alopecia-areata', (c) => c.html(alopeciaAreataHtml));
app.get('/alopecia-areata/', (c) => c.html(alopeciaAreataHtml));
app.get('/seasonal', (c) => c.html(seasonalHtml));
app.get('/seasonal/', (c) => c.html(seasonalHtml));
app.get('/dandruff', (c) => c.html(dandruffHtml));
app.get('/dandruff/', (c) => c.html(dandruffHtml));
app.get('/folliculitis', (c) => c.html(folliculitisHtml));
app.get('/folliculitis/', (c) => c.html(folliculitisHtml));

app.get('/', (c) => c.json({
  service: 'airaquas-public', version: '2.0.0',
  pages: ['/fenzhen/', '/guide/', '/research/', '/sebderm/', '/postpartum/', '/alopecia-areata/', '/seasonal/', '/dandruff/', '/folliculitis/'],
}));

export default app;
