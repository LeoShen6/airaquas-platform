/**
 * airaquas.hair — Fashion Poster Design System
 * 统一的设计 Token、布局函数、组件
 */

// ═══ Color Tokens ═══
export const COLORS = {
  bg: '#050510',
  bg2: '#0a0a18',
  bg3: '#101020',
  card: 'rgba(255,255,255,0.03)',
  cardHover: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.06)',
  borderLight: 'rgba(255,255,255,0.1)',
  text: '#e8e4dc',
  text2: 'rgba(255,255,255,0.45)',
  text3: 'rgba(255,255,255,0.25)',
  gold: '#c8a96e',
  goldLight: '#dfbd7c',
  goldDark: '#a88a4e',
  accent: '#7bc1ff',
  accent2: '#4a90d9',
  overlay: 'rgba(0,0,0,0.5)',
  overlayHeavy: 'rgba(0,0,0,0.8)',
};

// ═══ Shared CSS ═══
export const BASE_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
::selection{background:rgba(200,169,110,0.3);color:#fff}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,'Noto Sans SC','PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif;
  background:#050510;color:#e8e4dc;line-height:1.7;overflow-x:hidden;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}

/* ═══ Layout utilities ═══ */
.container{max-width:1120px;margin:0 auto;padding:0 24px}
.container-narrow{max-width:720px;margin:0 auto;padding:0 24px}
.section{padding:80px 0}
.section-sm{padding:48px 0}

/* ═══ Typography ═══ */
.h1{font-size:clamp(36px,6vw,72px);font-weight:700;line-height:1.05;letter-spacing:-0.03em;color:#e8e4dc}
.h2{font-size:clamp(28px,4vw,48px);font-weight:600;line-height:1.1;letter-spacing:-0.02em;color:#e8e4dc}
.h3{font-size:clamp(20px,2.5vw,28px);font-weight:600;line-height:1.2;color:#e8e4dc}
.h4{font-size:16px;font-weight:600;line-height:1.3;color:#e8e4dc}
.body{font-size:14px;line-height:1.7;color:rgba(255,255,255,0.45)}
.body-sm{font-size:12px;line-height:1.6;color:rgba(255,255,255,0.35)}
.label{font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#c8a96e;margin-bottom:8px}

/* ═══ Gold accent ═══ */
.gold{color:#c8a96e}
.gold-line{width:40px;height:2px;background:linear-gradient(90deg,#c8a96e,transparent);margin:16px 0}

/* ═══ Header ═══ */
.header{position:fixed;top:0;left:0;right:0;z-index:1000;
  background:rgba(5,5,16,0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(255,255,255,0.04);transition:transform 0.3s}
.header-inner{display:flex;align-items:center;justify-content:space-between;height:60px}
.header-logo{font-size:16px;font-weight:700;letter-spacing:1px;color:#e8e4dc}
.header-logo span{color:#c8a96e;font-size:10px;display:block;letter-spacing:2px;margin-top:-2px}
.header-nav{display:flex;gap:4px}
.header-nav a{padding:8px 16px;font-size:12px;font-weight:500;color:rgba(255,255,255,0.45);border-radius:8px;transition:all 0.2s}
.header-nav a:hover{color:#e8e4dc;background:rgba(255,255,255,0.05)}
.header-nav a.active{color:#c8a96e;background:rgba(200,169,110,0.08)}

/* ═══ Button ═══ */
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;border-radius:12px;font-size:13px;font-weight:600;
  letter-spacing:0.02em;cursor:pointer;transition:all 0.3s;border:none;font-family:inherit}
.btn-primary{background:linear-gradient(135deg,#c8a96e,#a88a4e);color:#050510}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(200,169,110,0.2)}
.btn-ghost{background:rgba(255,255,255,0.04);color:#e8e4dc;border:1px solid rgba(255,255,255,0.08)}
.btn-ghost:hover{background:rgba(255,255,255,0.08);border-color:rgba(200,169,110,0.3)}
.btn-sm{padding:10px 20px;font-size:12px;border-radius:8px}

/* ═══ Card ═══ */
.card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:24px;transition:all 0.3s}
.card:hover{background:rgba(255,255,255,0.04);border-color:rgba(200,169,110,0.15)}

/* ═══ Grid ═══ */
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}

/* ═══ Divider ═══ */
.divider{height:1px;background:linear-gradient(90deg,transparent,rgba(200,169,110,0.2),transparent);margin:40px 0}

/* ═══ Tag/Badge ═══ */
.tag{display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:100px;font-size:10px;font-weight:600;
  letter-spacing:0.05em;background:rgba(200,169,110,0.08);color:#c8a96e}

/* ═══ Hero section (full-screen / editorial) ═══ */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 40%,rgba(200,169,110,0.04),transparent 60%),
  radial-gradient(ellipse at 70% 60%,rgba(123,193,255,0.03),transparent 50%),
  linear-gradient(180deg,#050510 0%,#0a0a18 100%);}
.hero-grid-line{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
  linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
  background-size:60px 60px;mask-image:radial-gradient(ellipse at center,black,transparent 70%)}
.hero-content{position:relative;z-index:2;max-width:800px;padding:120px 0 60px}
.hero-eyebrow{font-size:12px;font-weight:600;letter-spacing:0.15em;color:#c8a96e;margin-bottom:16px}
.hero-title{font-size:clamp(40px,7vw,84px);font-weight:700;line-height:0.95;letter-spacing:-0.04em;color:#e8e4dc;margin-bottom:20px}
.hero-sub{font-size:clamp(16px,2vw,20px);color:rgba(255,255,255,0.45);line-height:1.6;max-width:560px;margin-bottom:32px}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap}
.hero-stat{display:flex;gap:40px;margin-top:60px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.06)}
.hero-stat-item{text-align:left}
.hero-stat-num{font-size:28px;font-weight:700;color:#e8e4dc;letter-spacing:-0.02em}
.hero-stat-label{font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:0.05em;margin-top:2px}

/* ═══ Footer ═══ */
.footer{padding:48px 0 24px;border-top:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.25);font-size:12px;text-align:center}

/* ═══ Mobile nav (hamburger) ═══ */
.hamburger{display:none;flex-direction:column;gap:4px;cursor:pointer;padding:8px;background:none;border:none}
.hamburger span{width:20px;height:2px;background:rgba(255,255,255,0.5);border-radius:2px;transition:all 0.3s}
.mobile-menu{display:none;position:fixed;inset:0;z-index:999;background:rgba(5,5,16,0.98);backdrop-filter:blur(20px);padding:80px 24px}
.mobile-menu.active{display:flex;flex-direction:column;gap:4px}
.mobile-menu a{padding:16px 20px;font-size:18px;font-weight:500;color:rgba(255,255,255,0.5);border-radius:12px;transition:all 0.2s}
.mobile-menu a:hover{color:#e8e4dc;background:rgba(255,255,255,0.04)}

/* ═══ Animations ═══ */
@keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes shimmer{0%{opacity:1}50%{opacity:0.6}100%{opacity:1}}
.anim-fade-up{animation:fadeInUp 0.7s ease both}
.anim-fade{animation:fadeIn 0.5s ease both}
.anim-delay-1{animation-delay:0.1s}
.anim-delay-2{animation-delay:0.2s}
.anim-delay-3{animation-delay:0.3s}

/* ═══ Responsive ═══ */
@media(max-width:768px){
  .container,.container-narrow{padding:0 16px}
  .section{padding:48px 0}
  .grid-2,.grid-3,.grid-4{grid-template-columns:1fr}
  .header-nav{display:none}
  .hamburger{display:flex}
  .hero{min-height:auto}
  .hero-content{padding:100px 0 40px}
  .hero-title{font-size:clamp(32px,10vw,52px)}
  .hero-stat{gap:24px;flex-wrap:wrap;margin-top:40px}
  .hero-stat-item{min-width:80px}
}
`;

// ═══ HTML Shell ═══
export function htmlShell(title: string, desc: string, canonical: string, bodyHTML: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<link rel="canonical" href="https://airaquas.hair${canonical}"/>
<style>${BASE_CSS}</style>
</head>
<body>

<div class="header">
<div class="container header-inner">
<a href="/" class="header-logo">安柯耳<span>AIRAQUAS</span></a>
<nav class="header-nav">
<a href="/">首页</a>
<a href="/salon">城市美发圈</a>
<a href="/detect">头皮检测</a>
<a href="/guide">护发指南</a>
<a href="/poster">分享海报</a>
</nav>
<button class="hamburger" onclick="document.getElementById('mobileMenu').classList.toggle('active')"><span></span><span></span><span></span></button>
</div>
</div>

<div id="mobileMenu" class="mobile-menu">
<a href="/" onclick="this.closest('.mobile-menu').classList.remove('active')">首页</a>
<a href="/salon" onclick="this.closest('.mobile-menu').classList.remove('active')">城市美发圈</a>
<a href="/detect" onclick="this.closest('.mobile-menu').classList.remove('active')">头皮检测</a>
<a href="/guide" onclick="this.closest('.mobile-menu').classList.remove('active')">护发指南</a>
<a href="/poster" onclick="this.closest('.mobile-menu').classList.remove('active')">分享海报</a>
</div>

${bodyHTML}

<footer class="footer">
<div class="container">
<p>安柯耳 Airaquas · AI 头皮健康时尚媒介</p>
<p style="margin-top:4px">© ${new Date().getFullYear()} Airaquas. All rights reserved.</p>
</div>
</footer>

<script>
// Close mobile menu on route change
document.querySelectorAll('.mobile-menu a').forEach(function(a){a.addEventListener('click',function(){document.getElementById('mobileMenu').classList.remove('active')})});
// Keyboard shortcut
document.addEventListener('keydown',function(e){if(e.key==='Escape')document.getElementById('mobileMenu').classList.remove('active')});
</script>
</body>
</html>`;
}
