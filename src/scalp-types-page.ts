/**
 * airaquas.hair — 头皮类型百科（时尚海报风格）
 */

import { htmlShell } from './design-system';

export const SCALP_TYPES_HTML = htmlShell('四型五维头皮分类 · 安柯耳 Airaquas', '了解头皮四型五维分类体系，科学认识你的头皮。', '/scalp-types', `
<style>
.types-hero{padding:120px 0 60px;text-align:center;position:relative}
.types-hero::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:80%;max-width:400px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,169,110,0.15),transparent)}
.types-hero h1{font-size:clamp(32px,5vw,56px);font-weight:700;line-height:1.05;letter-spacing:-0.03em;margin-bottom:12px}
.types-hero h1 span{background:linear-gradient(135deg,#c8a96e,#dfbd7c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.types-hero p{font-size:15px;color:rgba(255,255,255,0.4);max-width:500px;margin:0 auto;line-height:1.7}

.type-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:0 16px}
.type-card{padding:32px;border-radius:20px;background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.05);transition:all 0.3s}
.type-card:hover{background:rgba(255,255,255,0.03);border-color:rgba(200,169,110,0.08)}
.type-card .icon{font-size:36px;margin-bottom:12px;display:block}
.type-card h3{font-size:20px;font-weight:600;color:#e8e4dc;margin-bottom:6px}
.type-card .en{font-size:11px;color:rgba(255,255,255,0.2);letter-spacing:0.1em;margin-bottom:12px;text-transform:uppercase}
.type-card p{font-size:13px;color:rgba(255,255,255,0.4);line-height:1.8;margin-bottom:12px}
.type-card .tags{display:flex;gap:6px;flex-wrap:wrap}
.type-card .tags span{padding:3px 10px;border-radius:6px;font-size:10px;background:rgba(200,169,110,0.06);color:#c8a96e}

.dim-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;padding:0 16px}
.dim-card{text-align:center;padding:20px 12px;border-radius:16px;background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.04);transition:all 0.3s}
.dim-card:hover{background:rgba(255,255,255,0.03)}
.dim-card .num{font-size:28px;font-weight:700;color:#c8a96e;margin-bottom:4px}
.dim-card h4{font-size:13px;font-weight:600;color:#e8e4dc;margin-bottom:4px}
.dim-card p{font-size:11px;color:rgba(255,255,255,0.3);line-height:1.5}

.types-cta{text-align:center;padding:60px 0}
.types-cta p{font-size:14px;color:rgba(255,255,255,0.35);margin-bottom:20px}

@media(max-width:768px){
  .types-hero{padding:100px 0 40px}
  .type-grid{grid-template-columns:1fr}
  .dim-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:480px){
  .dim-grid{grid-template-columns:1fr 1fr}
}
</style>

<section class="types-hero">
<div class="container-narrow">
<div class="tag" style="display:inline-flex;margin-bottom:12px">头皮科学</div>
<h1>四型<span>五维</span>分类体系</h1>
<p>科学分类是精准护理的第一步。了解你的头皮属于哪一型、各维度状态如何。</p>
</div>
</section>

<section class="section container">
<div class="label" style="margin-bottom:16px;padding:0 16px">四种头皮类型</div>
<div class="type-grid">
<div class="type-card">
<span class="icon">🔵</span>
<h3>健康型</h3>
<div class="en">Normal Scalp</div>
<p>油脂分泌适中，水油平衡，毛囊通畅。无明显头屑、瘙痒、脱发问题。日常维持护理即可。</p>
<div class="tags"><span>水油平衡</span><span>无头屑</span><span>毛囊通畅</span></div>
</div>
<div class="type-card">
<span class="icon">🟡</span>
<h3>脂溢型</h3>
<div class="en">Seborrheic Scalp</div>
<p>油脂分泌旺盛，头皮和发根油腻，容易堵塞毛囊。常伴有头屑、瘙痒。需要控油调理。</p>
<div class="tags"><span>油脂旺盛</span><span>易堵塞</span><span>控油关键</span></div>
</div>
<div class="type-card">
<span class="icon">🟤</span>
<h3>干燥型</h3>
<div class="en">Dry Scalp</div>
<p>头皮缺水缺油，屏障功能弱，容易出现细屑、紧绷感。头发干枯无光泽。以滋润养护为主。</p>
<div class="tags"><span>缺水缺油</span><span>屏障弱</span><span>滋润养护</span></div>
</div>
<div class="type-card">
<span class="icon">🔴</span>
<h3>敏感型</h3>
<div class="en">Sensitive Scalp</div>
<p>头皮屏障受损，对外界刺激反应强烈（如染发、日晒、风）。容易泛红、刺痛、瘙痒。主打舒敏修护。</p>
<div class="tags"><span>屏障受损</span><span>反应强烈</span><span>舒敏修护</span></div>
</div>
</div>
</section>

<section class="section container" style="padding-top:0">
<div class="label" style="margin-bottom:16px;padding:0 16px">五个评估维度</div>
<div class="dim-grid">
<div class="dim-card">
<div class="num">01</div>
<h4>油脂分泌</h4>
<p>皮脂腺活跃程度，影响毛孔通透和头皮微环境</p>
</div>
<div class="dim-card">
<div class="num">02</div>
<h4>水分含量</h4>
<p>头皮含水量，决定了屏障功能和舒适度</p>
</div>
<div class="dim-card">
<div class="num">03</div>
<h4>毛囊密度</h4>
<p>单位面积毛囊数量，直接关联发量视觉</p>
</div>
<div class="dim-card">
<div class="num">04</div>
<h4>屏障状态</h4>
<p>角质层完整度，抵御外界刺激的能力</p>
</div>
<div class="dim-card">
<div class="num">05</div>
<h4>毛囊健康</h4>
<p>毛囊周围微循环与毛干生长状态</p>
</div>
</div>
</section>

<div class="types-cta">
<p>想知道你的头皮是什么类型？AI 3 分钟给你答案。</p>
<a href="/detect" class="btn btn-primary">免费 AI 检测 →</a>
</div>
`);
