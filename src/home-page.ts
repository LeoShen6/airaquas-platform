/**
 * airaquas.hair — 首页（时尚海报风格）
 */

import { htmlShell, COLORS } from './design-system';

export function generateHomePage(): string {
  return htmlShell('安柯耳 Airaquas · AI 头皮健康时尚媒介', 'AI时代头皮健康媒体，分型检测、护理引导、知识科普。', '/', `
<style>
/* Hero */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden}
.hero-bg{position:absolute;inset:0;background:
  radial-gradient(ellipse 800px 600px at 30% 35%,rgba(200,169,110,0.05),transparent),
  radial-gradient(ellipse 600px 400px at 75% 65%,rgba(123,193,255,0.04),transparent),
  linear-gradient(180deg,#050510 0%,#0a0a18 50%,#050510 100%)}
.hero-grain{position:absolute;inset:0;opacity:0.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-size:256px 256px}
.hero-decor{position:absolute;top:-20%;right:-10%;width:60vmax;height:60vmax;border-radius:50%;background:radial-gradient(circle,rgba(200,169,110,0.03),transparent 70%);pointer-events:none}
.hero-content{position:relative;z-index:2;padding:140px 0 60px;width:100%}
.hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.hero-eyebrow{font-size:11px;font-weight:700;letter-spacing:0.2em;color:#c8a96e;margin-bottom:20px;text-transform:uppercase}
.hero-title{font-size:clamp(42px,7vw,88px);font-weight:700;line-height:0.92;letter-spacing:-0.05em;color:#e8e4dc;margin-bottom:6px}
.hero-title .highlight{background:linear-gradient(135deg,#c8a96e,#dfbd7c,#c8a96e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{font-size:clamp(15px,1.8vw,18px);color:rgba(255,255,255,0.4);line-height:1.7;max-width:500px;margin:20px 0 36px}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap}
.hero-visual{position:relative;display:flex;justify-content:center;align-items:center}
.hero-visual-inner{position:relative;width:100%;max-width:420px;aspect-ratio:3/4;background:linear-gradient(160deg,rgba(200,169,110,0.04),rgba(123,193,255,0.02));border-radius:24px;border:1px solid rgba(255,255,255,0.04);overflow:hidden;display:flex;align-items:center;justify-content:center}
.hero-visual-inner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(200,169,110,0.06),transparent 60%)}
.hero-visual-text{text-align:center;padding:20px;position:relative;z-index:1}
.hero-visual-text .big{font-size:clamp(56px,8vw,96px);font-weight:700;background:linear-gradient(180deg,#e8e4dc,#c8a96e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
.hero-visual-text .small{font-size:12px;color:rgba(255,255,255,0.3);letter-spacing:0.15em;margin-top:8px;text-transform:uppercase}
.hero-stats{display:flex;gap:48px;margin-top:48px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.04)}
.hero-stat-item{text-align:left}
.hero-stat-num{font-size:30px;font-weight:700;color:#e8e4dc;letter-spacing:-0.03em}
.hero-stat-label{font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:0.05em;margin-top:4px}

/* ═══ Featured sections grid ═══ */
.featured-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.featured-card{position:relative;padding:40px 32px;border-radius:20px;background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.05);overflow:hidden;transition:all 0.4s;min-height:280px;display:flex;flex-direction:column;justify-content:flex-end}
.featured-card::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.4));pointer-events:none;z-index:0}
.featured-card:hover{border-color:rgba(200,169,110,0.15);transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,0.2)}
.featured-card.span-2{grid-column:span 2}
.featured-card .tag{position:absolute;top:20px;left:20px;z-index:1;background:rgba(200,169,110,0.1);color:#c8a96e;padding:4px 12px;border-radius:100px;font-size:10px;font-weight:600;letter-spacing:0.05em}
.featured-card .content{position:relative;z-index:1}
.featured-card h3{font-size:22px;font-weight:600;color:#e8e4dc;margin-bottom:6px;line-height:1.2}
.featured-card p{font-size:13px;color:rgba(255,255,255,0.35);line-height:1.6;margin-bottom:12px}
.featured-card .card-link{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#c8a96e;transition:gap 0.2s}
.featured-card:hover .card-link{gap:10px}
.featured-card .card-bg{position:absolute;inset:0;z-index:-1;opacity:0.04}
.featured-card.detect .card-bg{background:radial-gradient(ellipse at 20% 80%,rgba(123,193,255,0.15),transparent 60%)}
.featured-card.salon .card-bg{background:radial-gradient(ellipse at 80% 20%,rgba(200,169,110,0.15),transparent 60%)}
.featured-card.guide .card-bg{background:radial-gradient(ellipse at 50% 50%,rgba(200,169,110,0.1),transparent 60%)}
.featured-card.poster .card-bg{background:radial-gradient(ellipse at 50% 50%,rgba(123,193,255,0.1),transparent 60%)}
.featured-card.types .card-bg{background:radial-gradient(ellipse at 30% 70%,rgba(200,169,110,0.08),transparent 60%)}

/* ═══ Brand story ═══ */
.brand{text-align:center;padding:80px 0;position:relative}
.brand::before{content:'';position:absolute;top:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(200,169,110,0.2),transparent)}
.brand-title{font-size:clamp(24px,3.5vw,44px);font-weight:600;color:#e8e4dc;line-height:1.1;margin-bottom:12px}
.brand-desc{font-size:clamp(14px,1.5vw,16px);color:rgba(255,255,255,0.35);max-width:600px;margin:0 auto 40px;line-height:1.8}
.brand-logos{display:flex;justify-content:center;gap:40px;flex-wrap:wrap;align-items:center;opacity:0.3}
.brand-logos span{font-size:12px;color:rgba(255,255,255,0.3);letter-spacing:0.1em;font-weight:500}

/* ═══ Feature list ═══ */
.features{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.feature{padding:24px;border-radius:16px;background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.04);text-align:center;transition:all 0.3s}
.feature:hover{border-color:rgba(200,169,110,0.1);background:rgba(255,255,255,0.03)}
.feature-icon{font-size:28px;margin-bottom:12px;display:block}
.feature h4{font-size:14px;font-weight:600;color:#e8e4dc;margin-bottom:4px}
.feature p{font-size:12px;color:rgba(255,255,255,0.3);line-height:1.5}

/* ═══ CTA banner ═══ */
.cta-banner{position:relative;padding:80px 0;text-align:center;overflow:hidden;border-radius:20px;background:linear-gradient(160deg,rgba(200,169,110,0.04),rgba(123,193,255,0.02),rgba(200,169,110,0.02));border:1px solid rgba(200,169,110,0.06);margin:60px 0}
.cta-banner::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;
  background:conic-gradient(from 0deg,transparent,rgba(200,169,110,0.02),transparent,rgba(123,193,255,0.02),transparent);
  animation:rotate 20s linear infinite}
@keyframes rotate{to{transform:rotate(360deg)}}
.cta-banner-content{position:relative;z-index:1}
.cta-banner h2{font-size:clamp(28px,4vw,48px);font-weight:600;color:#e8e4dc;margin-bottom:12px}
.cta-banner p{font-size:15px;color:rgba(255,255,255,0.35);max-width:500px;margin:0 auto 28px}

@media(max-width:768px){
  .hero-grid{grid-template-columns:1fr;gap:40px}
  .hero-stats{gap:24px;flex-wrap:wrap}
  .hero{min-height:auto}
  .featured-grid{grid-template-columns:1fr}
  .featured-card.span-2{grid-column:span 1}
  .features{grid-template-columns:1fr 1fr}
  .cta-banner{padding:48px 16px;margin:40px 0}
}
@media(max-width:480px){
  .features{grid-template-columns:1fr}
}
</style>

<!-- Hero -->
<section class="hero">
<div class="hero-bg"></div>
<div class="hero-grain"></div>
<div class="hero-decor"></div>
<div class="container hero-content">
<div class="hero-grid">
<div>
<div class="hero-eyebrow anim-fade-up anim-delay-1">AI 头皮健康 · 时尚媒介</div>
<h1 class="hero-title anim-fade-up anim-delay-2">头皮<br><span class="highlight">科学美学</span></h1>
<p class="hero-sub anim-fade-up anim-delay-3">AI 分型检测 · 城市美发圈 · 科学护发指南<br class="hide-mobile">重塑头皮健康认知方式</p>
<div class="hero-actions anim-fade-up anim-delay-3">
<a href="/detect" class="btn btn-primary">免费AI检测 →</a>
<a href="/salon" class="btn btn-ghost">城市美发圈</a>
</div>
<div class="hero-stats anim-fade-up anim-delay-3">
<div class="hero-stat-item"><div class="hero-stat-num">78</div><div class="hero-stat-label">覆盖城市</div></div>
<div class="hero-stat-item"><div class="hero-stat-num">92K+</div><div class="hero-stat-label">合作沙⿻</div></div>
<div class="hero-stat-item"><div class="hero-stat-num">92%</div><div class="hero-stat-label">AI 准确率</div></div>
</div>
</div>
<div class="hero-visual anim-fade-up anim-delay-2">
<div class="hero-visual-inner">
<div class="hero-visual-text">
<div class="big">AI</div>
<div class="small">Scalp Intelligence</div>
<div style="margin-top:16px;display:flex;justify-content:center;gap:8px;flex-wrap:wrap">
<span class="tag" style="font-size:9px">四型五维</span>
<span class="tag" style="font-size:9px">科学分型</span>
<span class="tag" style="font-size:9px">智能报告</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<!-- Brand Story -->
<section class="section container">
<div class="brand">
<h2 class="brand-title">从诊断到护理，<span style="background:linear-gradient(135deg,#c8a96e,#dfbd7c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">一站解决</span></h2>
<p class="brand-desc">安柯耳以 AI 头皮影像分析为核心，连接全国 78 城 92,000+ 专业美发沙龙，<br class="hide-mobile">为每个头皮问题提供从检测到解决方案的完整闭环。</p>
<div class="features">
<div class="feature"><span class="feature-icon">🔬</span><h4>AI 精准检测</h4><p>上传照片，3 分钟获取头皮四型五维科学报告</p></div>
<div class="feature"><span class="feature-icon">🗺️</span><h4>城市美发圈</h4><p>覆盖 78 城，找到你身边的合作专业沙龙</p></div>
<div class="feature"><span class="feature-icon">📋</span><h4>个性护理方案</h4><p>根据检测结果生成定制护发方案</p></div>
<div class="feature"><span class="feature-icon">📊</span><h4>追踪管理</h4><p>记录头皮变化趋势，科学见证改善</p></div>
</div>
</div>
</section>

<!-- Featured Content -->
<section class="section container">
<div class="label">EXPLORE</div>
<h2 class="h2" style="margin-bottom:28px">探索更多</h2>
<div class="featured-grid">
<a href="/detect" class="featured-card detect span-2">
<div class="card-bg"></div>
<span class="tag">AI 检测</span>
<div class="content">
<h3>免费 AI 头皮检测</h3>
<p>上传发际线与头顶照片，AI 自动分析毛囊密度、油脂分泌、屏障状态，3 分钟获取你的专属头皮报告。</p>
<span class="card-link">开始检测 →</span>
</div>
</a>
<a href="/salon" class="featured-card salon">
<div class="card-bg"></div>
<span class="tag">78 城市</span>
<div class="content">
<h3>城市美发圈</h3>
<p>92,000+ 合作沙龙名录，找到你身边的专业美发店。</p>
<span class="card-link">查看门店 →</span>
</div>
</a>
<a href="/guide" class="featured-card guide">
<div class="card-bg"></div>
<span class="tag">护发</span>
<div class="content">
<h3>智能护发指南</h3>
<p>AI 个性化护发建议，针对你的头皮类型量身定制。</p>
<span class="card-link">生成指南 →</span>
</div>
</a>
<a href="/scalp-types" class="featured-card types">
<div class="card-bg"></div>
<span class="tag">知识</span>
<div class="content">
<h3>头皮类型百科</h3>
<p>了解四型五维头皮分类，科学认识你的头皮。</p>
<span class="card-link">了解更多 →</span>
</div>
</a>
<a href="/poster" class="featured-card poster">
<div class="card-bg"></div>
<span class="tag">分享</span>
<div class="content">
<h3>分享海报</h3>
<p>生成你的专属头皮检测海报，分享给朋友。</p>
<span class="card-link">制作海报 →</span>
</div>
</a>
</div>
</section>

<!-- CTA Banner -->
<section class="container">
<div class="cta-banner">
<div class="cta-banner-content">
<h2>你的头皮值得<wbr><span style="background:linear-gradient(135deg,#c8a96e,#dfbd7c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">专业对待</span></h2>
<p>不凭感觉做判断，让 AI 帮你了解真正的头皮状态。免费、快捷、科学。</p>
<a href="/detect" class="btn btn-primary">免费头皮检测 →</a>
</div>
</div>
</section>
`);
}
