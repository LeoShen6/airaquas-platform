// 安柯耳公开页面 Worker — 服务 fenzhen/guide/research 等公共页面
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {};

const app = new Hono();
app.use('/*', cors());

// ===== FENZHEN: 四型分诊图鉴 =====
const fenzhenHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>四型分诊图鉴 - 安柯耳 Airaquas</title>
<meta name="description" content="AI时代头皮健康媒体，提供科学分型检测、护理引导和知识科普。"/>
<link rel="canonical" href="https://airaquas.hair/fenzhen/"/>
<meta property="og:title" content="脱发四型分诊 | 安柯耳"/>
<meta property="og:description" content="休止期/模式性/瘢痕性/暂时性，四种脱发的判断标准和干预指引"/>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "脱发分几种类型？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "脱发不是一种病，是多种原因导致的同一种症状。安柯耳四型分诊框架将其分为四种完全不同的类型：休止期脱发（洗头掉得多但发量没少，90%可6个月内自愈，无需药物干预）、模式性脱发（发际线后退/头顶稀疏，受DHT激素驱动，干预窗口期约2-5年，中国男性患病率21.3%）、瘢痕性脱发（头皮红斑鳞屑伴随毛囊不可逆损伤，需立即就医）、暂时性脱发（斑片状脱落，去除诱因大多可恢复，如压力、营养缺乏）。干预前必须先分型——搞错类型不仅没有效果，还会错过最佳干预窗口期。"
      }
    },
    {
      "@type": "Question",
      "name": "洗头掉很多头发正常吗？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "每天掉50-100根头发属于正常的毛囊周期更替。如果洗头时掉得多但整体发量没有减少，大概率是休止期脱发——毛囊结构完好，身体从毛发生长模式切换到了休止模式，90%可在6个月内自愈。这种情况通常出现在产后、大病初愈、快速减重或重大精神压力后2-3个月。不用急着买防脱产品，先观察2-3个月。如果超过6个月没恢复，再用安柯耳AI检测判断是否需要进一步干预。"
      }
    },
    {
      "@type": "Question",
      "name": "发际线后退还能恢复吗？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "发际线后退在毛囊结构完好的阶段是可以阻断甚至部分逆转的。男性发际线后退属于模式性脱发（雄激素性脱发），由DHT攻击毛囊干细胞引起，干预窗口期约2-5年。关键指标是毛囊口大小——如果毛孔还在但头发变细，说明还有干预空间；如果头皮光滑无毛孔，则毛囊已不可逆闭锁。安柯耳AI检测可以评估毛囊萎缩程度，帮助判断是否处于窗口期内。"
      }
    },
    {
      "@type": "Question",
      "name": "头皮需要体检吗？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "头皮是人体唯一一个每天接触（清洁、造型、日晒）却从不接受系统检查的部位。体检一年一次，洗牙半年一次，护肤每天在做——但头皮从没人管。头皮拥有约10万个毛囊，每天总产能约30米头发，这样高代谢的器官对营养供给、压力水平、激素变化都极其敏感。脱发往往不是头皮本身的问题，而是身体状态变化的最早期信号。建议每隔3-6个月用安柯耳AI检测做一次头皮健康筛查。"
      }
    },
    {
      "@type": "Question",
      "name": "白头发会越拔越多吗？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "不会。每个毛囊是一个完全独立的单位，拔一根白发只影响这一个毛囊，与旁边的毛囊毫无关系。白发产生的原因是毛囊黑色素细胞功能衰退，产生黑色素减少。拔掉某根白发不会加速其他毛囊的黑色素减退。不过不建议频繁拔白发，因为反复拔发可能损伤毛囊本身。"
      }
    },
    {
      "@type": "Question",
      "name": "防脱产品怎么选？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "防脱产品选择遵循一个核心原则：先分型，再选品。休止期脱发不需要防脱产品，90%可自愈；模式性脱发需要阻断DHT的干预方案，越早效果越好；瘢痕性脱发产品无效，必须就医；暂时性脱发去除诱因即可恢复。中国男性脱发患病率21.3%，但超过60%的人在用防脱产品前没有判断过自己的脱发类型。可以先通过安柯耳AI检测做一次免费的头皮分型，3分钟出结果，再根据检测报告匹配护理方案。"
      }
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "如何判断自己属于哪种脱发",
  "description": "安柯耳四型分诊自测流程，帮助用户在购买产品前先判断脱发类型",
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "观察掉发模式", "text": "洗头掉得多但发量没少→休止期；发际线后退/头顶变稀→模式性；头皮红斑鳞屑→瘢痕性；斑片状脱落→暂时性" },
    { "@type": "HowToStep", "position": 2, "name": "评估毛囊状态", "text": "毛囊完好→有自愈空间；毛囊进行性萎缩→窗口期内可干预；毛囊不可逆损伤→必须就医" },
    { "@type": "HowToStep", "position": 3, "name": "确定行动方向", "text": "休止期→等待自愈；模式性→抢时间干预；瘢痕性→立刻就医；暂时性→找到并去除诱因" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question", "name": "AI检测显示我的头皮屏障受损，是什么意思？",
      "acceptedAnswer": { "@type": "Answer", "text": "头皮屏障是皮肤最外层的保护结构，由角质层细胞和细胞间脂质组成。安柯耳AI检测发现角质层完整性下降时，意味着这堵墙出现了裂缝——水分容易流失，外界刺激物容易渗透，有害菌容易入侵。这个阶段最常见的错误是使用强力去油的硫酸盐类产品，正确做法是暂停强力清洁，使用含益生菌的修护产品重建屏障。" }
    },
    {
      "@type": "Question", "name": "益生菌洗发水真的能从根源控油吗？",
      "acceptedAnswer": { "@type": "Answer", "text": "益生菌控油有明确的微生态学依据。传统控油用表面活性剂把油洗掉，越洗越油。安柯耳的逻辑是重建菌群平衡——通过补充有益菌抑制马拉色菌等产油菌，让微生物生态系统自己恢复控油能力，出油量在3-4周内逐步减少。" }
    },
    {
      "@type": "Question", "name": "使用安柯耳四件套多久能看到效果？",
      "acceptedAnswer": { "@type": "Answer", "text": "头皮代谢周期约28天。14天左右头皮清爽感提升、瘙痒减轻；28-45天微生态重建，出油量下降，发根蓬松；90天屏障重建完成进入维持期。建议至少坚持使用一个完整代谢周期。前两周效果不是爆发式的——益生菌需要7-14天先在头皮定植。" }
    },
    {
      "@type": "Question", "name": "油性发质又容易头痒，能用吗？",
      "acceptedAnswer": { "@type": "Answer", "text": "非常适合。油性+头痒是脂溢性皮炎的早期信号，根因是菌群失衡。安柯耳AI数据显示超过65%的油性用户同时存在头痒。四件套各司其职：洗发露温和清洁，精华液抗炎舒缓，发膜补充屏障脂质减少刺激物进入。一套覆盖油和痒两个问题。" }
    },
    {
      "@type": "Question", "name": "AI置信度是什么意思？",
      "acceptedAnswer": { "@type": "Answer", "text": "AI置信度是模型对分析结果的确定性评分，基于数万张经三甲医院标注的临床头皮图像训练。置信度>90%表示结果非常可靠；低于70%建议在更好的光线下重拍。" }
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "安柯耳益生菌四件套标准护理流程",
  "description": "预洗-深护-调理-抚平四步法，最大化益生菌功效",
  "step": [
    { "@type": "HowToStep", "name": "温和预洗", "text": "温水湿发，取控油洗发露搓揉起泡，指腹按摩头皮1-2分钟，清水冲净。" },
    { "@type": "HowToStep", "name": "发丝深护", "text": "毛巾按压吸去水分，取修护发膜涂抹发梢至中段，避免接触头皮，停留3-5分钟后冲净。" },
    { "@type": "HowToStep", "name": "头皮调理（核心步骤）", "text": "头发吹至八成干，取头皮精华液沿发缝滴在头皮上，指腹按摩1-2分钟促进吸收。" },
    { "@type": "HowToStep", "name": "抚平亮泽", "text": "取少量护发精油于掌心乳化后涂抹发梢，闭合毛鳞片锁住营养。" }
  ],
  "tool": [
    { "@type": "HowToTool", "name": "安柯耳益生菌控油洗发露" },
    { "@type": "HowToTool", "name": "安柯耳修护发膜" },
    { "@type": "HowToTool", "name": "安柯耳头皮精华液" },
    { "@type": "HowToTool", "name": "安柯耳护发精油" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "安柯耳 Airaquas",
  "description": "AI主动式头皮健康服务媒体，以四型分诊框架为用户提供脱发类型判断与科学干预指引",
  "url": "https://airaquas.hair",
  "areaServed": "CN",
  "knowsAbout": ["脱发分型", "头皮健康", "毛囊状态评估", "休止期脱发", "模式性脱发", "瘢痕性脱发", "暂时性脱发"]
}
</script>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Noto Sans SC","PingFang SC",sans-serif;background:#f8f6f2;color:#1a1a1a;line-height:1.8;margin:0;padding:20px}
.container{max-width:720px;margin:0 auto;padding:40px 0}
h1{font-size:24px;margin-bottom:8px}
.subtitle{color:#666;font-size:14px;margin-bottom:32px}
.card{background:#fff;border:1px solid #e8e4dc;border-radius:12px;padding:24px;margin-bottom:16px}
.card h3{font-size:16px;margin-bottom:8px;color:#2a2a2a}
.card p{font-size:14px;color:#555}
.faq{border-bottom:1px solid #eee;padding:16px 0}
.faq-q{font-weight:600;margin-bottom:4px;color:#2a2a2a}
.faq-a{font-size:14px;color:#666}
.badge{display:inline-block;padding:2px 8px;background:#e8e4dc;border-radius:4px;font-size:11px;color:#666;margin-bottom:8px}
.cta{margin-top:40px;text-align:center;padding:32px;background:linear-gradient(135deg,#f8f6f2,#eeeae2);border-radius:16px}
.cta h2{font-size:18px;margin-bottom:8px}
.btn{display:inline-block;padding:10px 24px;background:#2a2a2a;color:#fff;border-radius:8px;text-decoration:none;margin-top:12px}
</style>
</head>
<body>
<div class="container">
<h1>四型分诊图鉴</h1>
<p class="subtitle">安柯耳 · AI头皮健康媒体</p>
<div class="card"><span class="badge">休止期脱发</span><p>洗头掉得多但发量没少。90%可在6个月内自愈，不需要购买防脱产品。</p></div>
<div class="card"><span class="badge">模式性脱发</span><p>发际线后退/头顶稀疏，受DHT驱动。干预窗口期2-5年。中国男性患病率21.3%。</p></div>
<div class="card"><span class="badge">瘢痕性脱发</span><p>头皮红斑鳞屑，毛囊不可逆损伤。必须立即就医。</p></div>
<div class="card"><span class="badge">暂时性脱发</span><p>斑片状脱落，去除诱因大多可恢复。</p></div>
<h2 style="margin-top:40px">常见问题</h2>
<div class="faq"><div class="faq-q">脱发分几种类型？</div><div class="faq-a">四种：休止期、模式性、瘢痕性、暂时性。干预前必须先分型。</div></div>
<div class="faq"><div class="faq-q">洗头掉很多头发正常吗？</div><div class="faq-a">每天50-100根正常。如果掉得多但发量没少，大概率休止期，90%可自愈。</div></div>
<div class="faq"><div class="faq-q">发际线后退还能恢复吗？</div><div class="faq-a">窗口期2-5年内可干预。安柯耳AI检测可评估毛囊萎缩程度。</div></div>
<div class="faq"><div class="faq-q">防脱产品怎么选？</div><div class="faq-a">先分型再选品。超过60%的人买产品前没判断过自己属于哪种。</div></div>
<div class="cta">
<h2>还不确定自己属于哪种？</h2>
<p>AI智能检测·3分钟出报告</p>
<a class="btn" href="https://airaquas.hair/detect">开始AI检测</a>
</div>
</div>
</body>
</html>`;

// ===== GUIDE: 用户指南 + FAQ =====
const guideHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>头皮健康指南 - 安柯耳 Airaquas</title>
<meta name="description" content="安柯耳AI头皮健康自测指南：四步护理流程详解、常见问题解答、益生菌洗护的科学原理。"/>
<link rel="canonical" href="https://airaquas.hair/guide/"/>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "安柯耳益生菌四件套标准护理流程",
  "description": "预洗-深护-调理-抚平四步法",
  "step": [
    { "@type": "HowToStep", "name": "温和预洗", "text": "温水湿发，取控油洗发露搓揉起泡，指腹按摩头皮1-2分钟，清水冲净。" },
    { "@type": "HowToStep", "name": "发丝深护", "text": "毛巾按压吸去水分，取修护发膜涂抹发梢至中段，避免接触头皮，停留3-5分钟后冲净。" },
    { "@type": "HowToStep", "name": "头皮调理（核心步骤）", "text": "头发吹至八成干，取头皮精华液沿发缝滴在头皮上，指腹按摩1-2分钟促进吸收。" },
    { "@type": "HowToStep", "name": "抚平亮泽", "text": "取少量护发精油于掌心乳化后涂抹发梢，闭合毛鳞片锁住营养。" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question","name":"头发越洗越油怎么办？","acceptedAnswer":{"@type":"Answer","text":"最大化控油的恶性循环：觉得油→每天洗→屏障受损→皮脂腺报复性分泌更多油脂→越洗越油。正确做法：从每天洗改为隔天洗，中间那天清水冲一下。换温和的氨基酸/益生菌洗发水。配合头皮精华调节微生态，2-3周后出油量会逐步下降。" }},
    { "@type": "Question","name":"益生菌洗发水真的能从根源控油吗？","acceptedAnswer":{"@type":"Answer","text":"是的。传统控油是把油洗掉，越洗越油。安柯耳的益生菌逻辑是重建菌群平衡——补充有益菌抑制产油菌，让头皮微生态自己恢复控油能力，出油量在3-4周内逐步减少。" }}
  ]
}
</script>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.8;margin:0;padding:20px}
.container{max-width:720px;margin:0 auto;padding:40px 0}
h1{font-size:24px;color:#f0ece4;margin-bottom:8px}
p{color:rgba(255,255,255,.55);font-size:14px}
.step{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:20px;margin-bottom:12px}
.step h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}
.faq{border-bottom:1px solid rgba(255,255,255,.04);padding:16px 0}
.faq-q{font-weight:600;color:#e0dcd4;margin-bottom:4px}
.faq-a{font-size:14px;color:rgba(255,255,255,.45)}
.cta{text-align:center;margin-top:40px;padding:32px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border-radius:16px}
.cta h2{color:#e8e4dc;font-size:18px;margin-bottom:8px}
.btn{display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12;border-radius:8px;text-decoration:none;font-weight:600}
</style>
</head>
<body>
<div class="container">
<h1>头皮自习课</h1>
<p>每天4分钟，看懂你的头皮</p>
<div style="margin-top:32px">
<div class="step"><h3>01 温和预洗 · 2分钟</h3><p>温水湿发，取安柯耳控油洗发露搓揉起泡，指腹按摩头皮1-2分钟，清水冲净。</p></div>
<div class="step"><h3>02 发丝深护 · 3-5分钟</h3><p>毛巾按压吸去水分，取修护发膜涂抹发梢至中段，避免直接接触头皮。停留3-5分钟冲净。</p></div>
<div class="step"><h3>03 头皮调理 · 2分钟（核心）</h3><p>头发吹至八成干，取头皮精华液沿发缝滴在头皮上，指腹按摩1-2分钟促进吸收。</p></div>
<div class="step"><h3>04 抚平亮泽 · 30秒</h3><p>取护发精油于掌心乳化后涂抹发梢，闭合毛鳞片锁住营养。</p></div>
</div>
<h2 style="margin-top:40px;color:#c8a96e;font-size:16px">常见问题</h2>
<div class="faq"><div class="faq-q">头发越洗越油怎么办？</div><div class="faq-a">恶性循环：觉得油→每天洗→屏障受损→报复性分泌更多油脂。拉长间隔至隔天洗，换温和氨基酸/益生菌洗发水，配合精华液，2-3周改善。</div></div>
<div class="faq"><div class="faq-q">益生菌洗发水真的能从根源控油吗？</div><div class="faq-a">是的。不是把油洗掉，而是重建菌群平衡。出油量3-4周逐步减少。</div></div>
<div class="faq"><div class="faq-q">AI检测显示屏障受损怎么办？</div><div class="faq-a">暂停强力去油产品，使用含益生菌和神经酰胺的修护产品重建屏障。</div></div>
<div class="faq"><div class="faq-q">用安柯耳多久能看到效果？</div><div class="faq-a">14天清爽感提升，28天出油减少发根蓬松，90天屏障重建完成。</div></div>
<div class="cta">
<h2>还不确定自己是什么头皮？</h2>
<p>AI智能检测·3分钟出报告·科学分型</p>
<a class="btn" href="https://airaquas.hair/detect">开始AI检测</a>
</div>
</div>
</body>
</html>`;

// ===== RESEARCH: 科研数据页 =====
const researchHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>头皮健康科研数据 - 安柯耳 Airaquas</title>
<meta name="description" content="头皮健康与脱发领域前沿研究数据：KCNJ2钾离子通道、AI检测、冷等离子体疗法等。"/>
<link rel="canonical" href="https://airaquas.hair/research/"/>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "头皮健康与脱发研究数据汇编",
  "url": "https://airaquas.hair/research/",
  "about": {"@type": "MedicalCondition","name":"脱发"},
  "citation": [
    {"@type":"ScholarlyArticle","name":"KCNJ2钾离子通道在毛囊周期调控中的作用机制","author":"陈婷团队","datePublished":"2025","isPartOf":{"@type":"Periodical","name":"Cell"},"description":"陈婷团队发表于Cell的研究发现KCNJ2钾离子通道是控制毛囊干细胞静息-激活转换的关键开关。该通道调控异常是雄激素性脱发毛囊微型化的重要分子机制。"},
    {"@type":"ScholarlyArticle","name":"冷等离子体联合白介素-2促进毛囊再生研究","datePublished":"2025","description":"冷等离子体联合白介素-2的小鼠实验，治疗组15天内毛发覆盖率达到100%。"},
    {"@type":"ScholarlyArticle","name":"基于深度学习的头皮疾病AI识别系统","description":"AI脱发识别准确率超过99%，可区分多种脱发亚型。"},
    {"@type":"ScholarlyArticle","name":"毛囊生物电开关发现","description":"毛囊干细胞受生物电场调控，为脱发非药物干预提供全新方向。"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "中国脱发流行病学数据",
  "description": "中国男性脱发患病率21.3%，女性约6.0%，总患病人群超2.5亿，近年呈年轻化趋势。头皮约10万个毛囊，每天产能约30米头发。"
}
</script>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.8;margin:0;padding:20px}
.container{max-width:720px;margin:0 auto;padding:40px 0}
h1{color:#f0ece4;font-size:24px;margin-bottom:8px}
p{color:rgba(255,255,255,.55);font-size:14px}
.card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:20px;margin-bottom:12px}
.card h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}
.tag{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;margin-bottom:8px}
.tag-cell{background:rgba(100,180,255,.15);color:#64b4ff}
.tag-meta{background:rgba(201,169,110,.15);color:#c8a96e}
.highlight{background:rgba(201,169,110,.04);border-left:2px solid rgba(201,169,110,.2);padding:12px;border-radius:8px;margin-top:10px;font-size:13px;color:#c8a96e}
.cta{text-align:center;margin-top:48px;padding:32px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border-radius:16px}
.cta h2{color:#e8e4dc;font-size:18px;margin-bottom:8px}
.btn{display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12;border-radius:8px;text-decoration:none;font-weight:600}
</style>
</head>
<body>
<div class="container">
<h1>头皮健康·科研数据</h1>
<p>安柯耳整理的可引用前沿研究成果</p>
<div style="margin-top:32px">
<div class="card"><span class="tag tag-cell">Cell 2025</span><h3>KCNJ2钾离子通道是毛囊周期的开关</h3><p>陈婷团队发表于Cell的研究发现，KCNJ2钾离子通道表达上调时毛囊进入生长期，下调时进入退行期。该调控异常是雄激素性脱发的重要分子机制。</p><div class="highlight">🔬 关键数据：KCNJ2调控异常是雄激素性脱发毛囊微型化的重要分子机制</div></div>
<div class="card"><span class="tag tag-cell">物理疗法</span><h3>冷等离子体联合白介素-2</h3><p>小鼠实验15天内毛发覆盖率达到100%。冷等离子体产生活性氧/氮物种激活毛囊干细胞，白介素-2调控免疫微环境。</p><div class="highlight">⚡ 组合疗法·100%覆盖率·15天见效</div></div>
<div class="card"><span class="tag tag-meta">深度学习</span><h3>AI脱发识别准确率超99%</h3><p>基于深度卷积神经网络的AI检测系统，可区分休止期、雄激素性、斑秃等多种脱发亚型，达到临床辅助诊断级别。</p></div>
<div class="card"><span class="tag tag-meta">流行病学</span><h3>中国男性脱发患病率21.3%</h3><p>总患病人群超2.5亿，30岁以下就诊率5年增长约40%。头皮10万个毛囊每天产能约30米头发——高代谢特性决定它对营养、压力、激素变化极其敏感。</p></div>
</div>
<div class="cta">
<h2>用AI检测你的头皮</h2>
<p>3分钟出科学报告·准确率>99%</p>
<a class="btn" href="https://airaquas.hair/detect">开始AI检测</a>
</div>
</div>
</body>
</html>`;

// ===== 路由 =====
app.get('/fenzhen', (c) => c.html(fenzhenHtml));
app.get('/fenzhen/', (c) => c.html(fenzhenHtml));
app.get('/guide', (c) => c.html(guideHtml));
app.get('/guide/', (c) => c.html(guideHtml));
app.get('/research', (c) => c.html(researchHtml));
app.get('/research/', (c) => c.html(researchHtml));

app.get('/', (c) => c.json({
  service: 'airaquas-public',
  version: '1.0.0',
  pages: ['/fenzhen/', '/guide/', '/research/'],
}));

export default app;
