/**
 * airaquas.hair — 安柯耳头皮健康社区页面
 * "慢慢来，让美好发生 · Beauty Happens In Hair"
 */

import { htmlShell, COLORS, BASE_CSS } from './design-system';

export function generateCommunityPage(): string {
  return htmlShell('安柯耳 · 头皮健康社区 | Airaquas', '安柯耳头皮健康社区 — 关于头皮健康、生活方式和自我照顾的小天地。慢慢来，让美好发生。', '/community', `

<style>
/* ═══ Community Hero ═══ */
.comm-hero{position:relative;min-height:90vh;display:flex;align-items:center;overflow:hidden}
.comm-hero-bg{position:absolute;inset:0;background:
  radial-gradient(ellipse 700px 500px at 25% 40%,rgba(200,169,110,0.06),transparent),
  radial-gradient(ellipse 500px 500px at 75% 60%,rgba(200,169,110,0.03),transparent),
  linear-gradient(180deg,#050510 0%,#0a0a18 50%,#050510 100%)}
.comm-hero-grain{position:absolute;inset:0;opacity:0.02;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-size:256px 256px}

/* ═══ Quick Cards ═══ */
.quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.quick-card{padding:32px 24px;border-radius:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);text-align:center;transition:all 0.3s}
.quick-card:hover{border-color:rgba(200,169,110,0.15);background:rgba(255,255,255,0.04);transform:translateY(-3px)}
.quick-icon{width:48px;height:48px;margin:0 auto 16px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px}
.quick-card h3{font-size:15px;font-weight:600;color:#e8e4dc;margin-bottom:4px}
.quick-card p{font-size:12px;color:rgba(255,255,255,0.35)}
.quick-card .arrow{margin-top:12px;font-size:11px;font-weight:600;color:#c8a96e;opacity:0;transition:all 0.3s}
.quick-card:hover .arrow{opacity:1}

/* ═══ Six Modules Grid ═══ */
.module-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.module-card{padding:28px;border-radius:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);transition:all 0.3s}
.module-card:hover{border-color:rgba(200,169,110,0.12);background:rgba(255,255,255,0.03)}
.module-header{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.module-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.module-card h3{font-size:15px;font-weight:600;color:#e8e4dc}
.module-card p{font-size:12px;color:rgba(255,255,255,0.35);line-height:1.7;margin-bottom:14px}
.module-highlights{display:flex;flex-direction:column;gap:4px}
.module-highlight{display:flex;align-items:center;gap:8px;font-size:11px;color:rgba(255,255,255,0.3)}
.module-highlight::before{content:'';width:4px;height:4px;border-radius:50%;background:#c8a96e;flex-shrink:0}
.module-link{margin-top:14px;display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:#c8a96e;transition:gap 0.2s}
.module-card:hover .module-link{gap:8px}

/* ═══ Principles ═══ */
.principles-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.principles-grid .center-item{grid-column:2}
.principle-card{padding:24px;border-radius:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);text-align:center;transition:all 0.3s}
.principle-card:hover{border-color:rgba(200,169,110,0.12);background:rgba(255,255,255,0.03)}
.principle-icon{font-size:28px;margin-bottom:8px}
.principle-card h3{font-size:14px;font-weight:600;color:#e8e4dc;margin-bottom:4px}
.principle-card p{font-size:12px;color:rgba(255,255,255,0.35);line-height:1.5}

/* ═══ Responsive ═══ */
@media(max-width:768px){
  .quick-grid{grid-template-columns:repeat(2,1fr)}
  .module-grid{grid-template-columns:1fr}
  .principles-grid{grid-template-columns:1fr 1fr}
  .principles-grid .center-item{grid-column:auto}
}
@media(max-width:480px){
  .quick-grid{grid-template-columns:1fr}
  .principles-grid{grid-template-columns:1fr}
  .comm-hero{min-height:auto}
}
</style>

<!-- Hero -->
<section class="comm-hero">
<div class="comm-hero-bg"></div>
<div class="comm-hero-grain"></div>
<div class="container" style="position:relative;z-index:2;padding:140px 0 60px">
<div class="hero-content" style="max-width:700px;text-align:center;margin:0 auto">
<div class="hero-eyebrow anim-fade-up anim-delay-1">
<span class="tag">🌿 头皮健康社区</span>
</div>
<h1 class="hero-title" style="font-size:clamp(32px,5vw,64px);margin-bottom:8px">安柯耳</h1>
<p class="hero-sub" style="text-align:center;margin:0 auto 24px;font-style:italic;font-size:clamp(14px,2vw,18px);color:rgba(255,255,255,0.5)">
Beauty Happens In Hair
</p>
<p style="font-size:14px;color:rgba(255,255,255,0.35);line-height:1.8;max-width:520px;margin:0 auto">
这里不仅仅是一个品牌的知识库，更是一个关于<strong style="color:#e8e4dc">头皮健康、生活方式和自我照顾</strong>的小天地。
</p>
<p style="font-size:13px;color:rgba(255,255,255,0.25);margin-top:12px;font-style:italic">
我们不制造焦虑，不贩卖焦虑，只分享真实、有用、温暖的知识和方法。
</p>
<div class="hero-actions" style="justify-content:center;margin-top:28px">
<a href="#quick" class="btn btn-primary">开始探索 →</a>
<a href="#principles" class="btn btn-ghost">社区原则</a>
</div>
<p style="text-align:center;margin-top:48px;font-size:11px;color:rgba(255,255,255,0.2)">↓ 慢慢来，让美好发生</p>
</div>
</div>
</section>

<!-- Quick Access -->
<section id="quick" class="section container">
<div class="label" style="text-align:center">QUICK ACCESS</div>
<h2 class="h2" style="text-align:center;margin-bottom:36px">🚀 快速入口</h2>
<div class="quick-grid">
<div class="quick-card">
<div class="quick-icon" style="background:linear-gradient(135deg,rgba(200,169,110,0.12),rgba(200,169,110,0.05))">🎯</div>
<h3>头皮自测</h3>
<p>2分钟了解你的头皮类型</p>
<div class="arrow">开始自测 →</div>
</div>
<div class="quick-card">
<div class="quick-icon" style="background:linear-gradient(135deg,rgba(200,169,110,0.12),rgba(200,169,110,0.05))">📖</div>
<h3>四型详解</h3>
<p>干性/油性/敏感性/混合性</p>
<div class="arrow">查看详解 →</div>
</div>
<div class="quick-card">
<div class="quick-icon" style="background:linear-gradient(135deg,rgba(200,169,110,0.12),rgba(200,169,110,0.05))">💆</div>
<h3>养护指南</h3>
<p>日常洗护实用技巧</p>
<div class="arrow">进入指南 →</div>
</div>
<div class="quick-card">
<div class="quick-icon" style="background:linear-gradient(135deg,rgba(200,169,110,0.12),rgba(200,169,110,0.05))">🎵</div>
<h3>头发丝电台</h3>
<p>治愈系生活随笔</p>
<div class="arrow">收听电台 →</div>
</div>
</div>
</section>

<!-- Six Modules -->
<section class="section container">
<div class="label" style="text-align:center">EXPLORE</div>
<h2 class="h2" style="text-align:center;margin-bottom:36px">📚 六大板块</h2>
<div class="module-grid">

<div class="module-card">
<div class="module-header">
<div class="module-icon" style="background:linear-gradient(135deg,rgba(200,169,110,0.15),rgba(200,169,110,0.05));color:#c8a96e">🧪</div>
<h3>头皮健康实验室</h3>
</div>
<p>专业但不晦涩的头皮健康科普。从头皮结构到益生菌，从成分表到养护原理——用朋友聊天的语气，讲清楚那些你想知道的事。</p>
<div class="module-highlights">
<span class="module-highlight">益生菌与头皮——看不见的小世界</span>
<span class="module-highlight">洗发水成分表怎么看？</span>
<span class="module-highlight">那些年我们踩过的头皮养护坑</span>
</div>
<div class="module-link">进入实验室 →</div>
</div>

<div class="module-card">
<div class="module-header">
<div class="module-icon" style="background:linear-gradient(135deg,rgba(200,169,110,0.15),rgba(200,169,110,0.05));color:#c8a96e">🎯</div>
<h3>四型五维自测中心</h3>
</div>
<p>我们原创的「四型五维」头皮自测体系。干性、油性、敏感性、混合性——你是哪一种？测一测就知道。</p>
<div class="module-highlights">
<span class="module-highlight">💧 干性头皮详解</span>
<span class="module-highlight">🔥 油性头皮详解</span>
<span class="module-highlight">🌸 敏感性头皮详解</span>
<span class="module-highlight">⚖️ 混合性头皮详解</span>
</div>
<div class="module-link">进入自测中心 →</div>
</div>

<div class="module-card">
<div class="module-header">
<div class="module-icon" style="background:linear-gradient(135deg,rgba(200,169,110,0.15),rgba(200,169,110,0.05));color:#c8a96e">🌿</div>
<h3>日常养护指南</h3>
</div>
<p>洗头、按摩、防晒、饮食……最实用的日常养护方法都在这里。把每一次洗头，都变成照顾自己的小仪式。</p>
<div class="module-highlights">
<span class="module-highlight">正确洗头的7个步骤</span>
<span class="module-highlight">头皮按摩全指南——5分钟放松</span>
<span class="module-highlight">头皮也需要防晒？</span>
</div>
<div class="module-link">进入养护指南 →</div>
</div>

<div class="module-card">
<div class="module-header">
<div class="module-icon" style="background:linear-gradient(135deg,rgba(200,169,110,0.15),rgba(200,169,110,0.05));color:#c8a96e">💬</div>
<h3>头发丝电台</h3>
</div>
<p>「风吹过头顶」音乐疗愈系列 + 生活随笔。不说教，不卖货，就安安静静地陪你一会儿。</p>
<div class="module-highlights">
<span class="module-highlight">🎵 vol.04 周末的慢生活</span>
<span class="module-highlight">🎵 vol.03 给自己的一首歌</span>
<span class="module-highlight">🎵 vol.02 宁夏</span>
</div>
<div class="module-link">进入电台 →</div>
</div>

<div class="module-card">
<div class="module-header">
<div class="module-icon" style="background:linear-gradient(135deg,rgba(200,169,110,0.15),rgba(200,169,110,0.05));color:#c8a96e">👥</div>
<h3>头皮说·社区</h3>
</div>
<p>分享你的头皮故事、养护心得、好物推荐。这里是属于我们的小天地，欢迎来玩。</p>
<div class="module-highlights">
<span class="module-highlight">分享养护心得</span>
<span class="module-highlight">好物推荐</span>
<span class="module-highlight">社区交流</span>
</div>
<div class="module-link">进入社区 →</div>
</div>

<div class="module-card">
<div class="module-header">
<div class="module-icon" style="background:linear-gradient(135deg,rgba(200,169,110,0.15),rgba(200,169,110,0.05));color:#c8a96e">📦</div>
<h3>关于安柯耳</h3>
</div>
<p>我们是谁、我们在做什么、我们相信什么。不端着，不装，聊聊真实的我们。</p>
<div class="module-highlights">
<span class="module-highlight">了解品牌故事</span>
<span class="module-highlight">认识我们的团队</span>
</div>
<div class="module-link">了解安柯耳 →</div>
</div>

</div>
</section>

<!-- Principles -->
<section id="principles" class="section container" style="text-align:center">
<div class="brand">
<div class="label">COMMUNITY PRINCIPLES</div>
<h2 class="h2">社区原则</h2>
<p style="color:rgba(255,255,255,0.35);margin-bottom:36px;font-size:14px">我们想建一个什么样的小天地</p>
<div class="principles-grid" style="max-width:800px;margin:0 auto">
<div class="principle-card">
<div class="principle-icon">💡</div>
<h3>不说教</h3>
<p>我们分享知识，但不制造焦虑</p>
</div>
<div class="principle-card">
<div class="principle-icon">🎯</div>
<h3>不夸大</h3>
<p>有一说一，能做到什么就说什么</p>
</div>
<div class="principle-card">
<div class="principle-icon">🤝</div>
<h3>有温度</h3>
<p>像朋友聊天一样，温暖而专业</p>
</div>
<div class="principle-card">
<div class="principle-icon">💎</div>
<h3>重价值</h3>
<p>每一篇内容，都希望对你真的有用</p>
</div>
<div class="principle-card center-item">
<div class="principle-icon">🌱</div>
<h3>慢慢来</h3>
<p>不管是养护头皮还是建设社区，我们都不着急</p>
</div>
</div>
</div>
</section>

<!-- CTA -->
<section class="container" style="padding-bottom:60px">
<div class="cta-banner" style="text-align:center">
<div class="cta-banner-content">
<p style="font-size:13px;color:#c8a96e;margin-bottom:8px;letter-spacing:0.1em">安柯耳 Airaquas</p>
<h2 style="font-size:clamp(24px,3vw,36px);font-weight:600;color:#e8e4dc;margin-bottom:8px">让美好发生</h2>
<p style="font-style:italic;color:rgba(255,255,255,0.3);margin-bottom:20px">Beauty Happens In Hair</p>
<p style="font-size:13px;color:rgba(255,255,255,0.35);margin-bottom:28px">
我们相信，好好照顾自己的头皮，也是好好爱自己的一种方式。
</p>
<a href="/" class="btn btn-primary">返回首页 →</a>
</div>
</div>
</section>
`);
}
