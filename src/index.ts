// Root Worker — handles ALL paths at airaquas.hair
// This overrides Cloudflare Pages for all routes
// Dynamic import of api-public Worker's Hono app
// We inline the api-public logic here for single-file deployment

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleDetect, handleDetectHistory } from './detect-service';
import { POSTER_HTML } from './poster-page';
import { SCALP_TYPES_HTML } from './scalp-types-page';
import { CITIES, generateCityPage, generateCityListHtml } from './salon-pages';
import { GUIDE_HTML } from './guide-page';

interface Env {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
  AI: Ai;
}

type Bindings = Env;

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

// ===== PAGE FACTORY =====
function page(title: string, desc: string, canonical: string, ldScripts: any[], bodyHTML?: string) {
  const lds = ldScripts.map((s: any) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  return `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title><meta name="description" content="${desc}"/>
<link rel="canonical" href="https://airaquas.hair${canonical}"/>
${lds}
<style>:root{--bg:#f7f4ef;--card:#ffffff;--text:#2c3e2d;--text2:#8a8a82;--accent:#6b8f71;--accent2:#b8916b;--border:#e8e3dc}body{font-family:-apple-system,BlinkMacSystemFont,'Noto Sans SC','PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif;background:var(--bg);color:var(--text);line-height:1.8;margin:0;padding:20px;-webkit-font-smoothing:antialiased}.container{max-width:720px;margin:0 auto;padding:40px 0}.head{margin-bottom:32px}.head h1{color:var(--text);font-size:24px;margin:0 0 4px}.head p{color:var(--text2);font-size:14px;margin:0}.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:12px}.card h3{color:var(--text);font-size:15px;margin-bottom:6px}.card p{color:var(--text2);font-size:14px;margin:0}.highlight{background:rgba(107,143,113,.05);border-left:2px solid var(--accent);padding:12px;border-radius:8px;margin:10px 0;font-size:13px;color:var(--accent)}.tag{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;margin-bottom:8px;background:rgba(107,143,113,.08);color:var(--accent)}.cta{text-align:center;margin-top:48px;padding:32px;background:var(--card);border:1px solid var(--border);border-radius:16px}.cta h2{color:var(--accent2);font-size:18px;margin-bottom:8px}.btn{display:inline-block;padding:10px 24px;background:linear-gradient(135deg,var(--accent2),#9a7b5a);color:#fff;border-radius:8px;text-decoration:none;font-weight:600}</style>
</head><body><div class="container"><div class="head"><h1>${title.split(' - ')[0]}</h1><p>${desc}</p></div>
${bodyHTML || ''}
<div class="cta"><h2>AI检测你的头皮</h2><p>3分钟出科学报告</p><a class="btn" href="https://airaquas.hair/detect">开始检测</a></div>
</div></body></html>`;
}

// ===== CONTENT PAGES =====
const fenzhenHtml = page('四型五维自测 - 安柯耳 Airaquas', 'AI时代头皮健康媒体，分型检测、护理引导、知识科普。', '/fenzhen/', [
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"脱发分几种类型？","acceptedAnswer":{"@type":"Answer","text":"四种：休止期（90%可6月自愈）、模式性（DHT驱动，男性21.3%）、瘢痕性（不可逆）、暂时性（可恢复）。先分型再干预。"}},
    {"@type":"Question","name":"头皮需要体检吗？","acceptedAnswer":{"@type":"Answer","text":"10万毛囊每天产能30米头发，建议每3-6个月AI筛查。"}},
    {"@type":"Question","name":"防脱产品怎么选？","acceptedAnswer":{"@type":"Answer","text":"先分型再选品。超60%的人买产品前没判断过类型。"}}]},
  {"@context":"https://schema.org","@type":"Organization","name":"安柯耳 Airaquas","description":"AI主动式头皮健康服务媒体"}]);

// 护发指南已升级为 AI 智能生成版块 → GUIDE_HTML

// ===== DETECT PAGE (complete static HTML with interactive UI) =====
const DETECT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>安柯耳 · AI 头皮四型五维自测 ｜ 时尚媒介内容平台</title>
<meta name="description" content="安柯耳(Airaquas)时尚媒介内容平台 — AI头皮四型五维自测，上传照片AI分析头皮健康分型，多维度评估出科学报告。免费检测。"/>
<link rel="canonical" href="https://airaquas.hair/detect"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"AI头皮检测怎么用？","acceptedAnswer":{"@type":"Answer","text":"上传发际线/头顶照片，AI自动分析毛囊密度、油脂分泌、屏障状态，3分钟出报告。免费。"}},{"@type":"Question","name":"检测准确吗？","acceptedAnswer":{"@type":"Answer","text":"基于万张头皮影像训练的模型，准确率92%。报告包含5个维度：油脂、水分、密度、屏障、毛囊健康。"}},{"@type":"Question","name":"需要去医院吗？","acceptedAnswer":{"@type":"Answer","text":"AI检测为初步筛查。发现异常（如斑片状脱发、红斑鳞屑）建议就医确诊。"}}]}</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f7f4ef;--card:#ffffff;--border:#e8e3dc;--text:#2c3e2d;--text2:#8a8a82;--accent:#6b8f71;--gold:#b8916b;--good:#6b8f71;--fair:#b8916b;--poor:#c86464}
body{font-family:-apple-system,BlinkMacSystemFont,'Noto Sans SC','PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
.wrap{max-width:480px;margin:0 auto;padding:0 16px 100px}
.hd{display:flex;align-items:center;justify-content:space-between;padding:14px 0;background:rgba(6,8,15,.92);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100}
.lg{font-size:15px;font-weight:700;color:#e8e4dc;letter-spacing:1px}
.lg span{color:var(--accent);font-size:10px;display:block;letter-spacing:2px}
.nav a{padding:5px 10px;border-radius:6px;font-size:11px;text-decoration:none;color:var(--text2);transition:.2s}
.nav a:hover{color:#fff;background:var(--card)}
.section-title{font-size:15px;font-weight:700;color:#e8e4dc;margin:24px 0 12px;display:flex;align-items:center;gap:8px}

/* === 上传区域 === */
.uz{position:relative;border:2px dashed rgba(100,180,255,.15);border-radius:20px;padding:44px 20px;text-align:center;cursor:pointer;transition:all .35s;background:linear-gradient(160deg,rgba(30,50,90,.08),rgba(15,20,40,.05));min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.uz:hover,.uz.dragover{border-color:rgba(100,180,255,.35);background:linear-gradient(160deg,rgba(30,50,90,.15),rgba(15,20,40,.1))}
.uz.has-image{padding:12px;border-style:solid;border-color:rgba(100,180,255,.2);cursor:default}
.uz-icon{width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,rgba(100,180,255,.12),rgba(58,123,213,.08));display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:14px;transition:all .3s}
.uz:hover .uz-icon{background:linear-gradient(135deg,rgba(100,180,255,.22),rgba(58,123,213,.15))}
.uz-title{font-size:15px;color:var(--gold);font-weight:500;margin-bottom:4px}
.uz-hint{font-size:12px;color:var(--text2);line-height:1.6}
.uz input[type=file]{display:none}
.uz img{width:100%;border-radius:14px;display:none;max-height:320px;object-fit:cover}
.uz.has-image img{display:block}
.uz.has-image .uz-icon,.uz.has-image .uz-title,.uz.has-image .uz-hint{display:none}
.uz-retry{display:none;margin-top:10px;padding:6px 16px;border:1px solid rgba(100,180,255,.15);border-radius:20px;background:transparent;color:var(--accent);font-size:12px;cursor:pointer;transition:all .3s}
.uz-retry:hover{background:rgba(100,180,255,.08)}
.uz.has-image .uz-retry{display:inline-block}

/* === 扫描动画 === */
.ov{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(6,8,15,.88);backdrop-filter:blur(8px);z-index:1000;flex-direction:column;align-items:center;justify-content:center}
.ov.active{display:flex}
.sp{width:100px;height:100px;border-radius:50%;border:3px solid rgba(100,180,255,.08);border-top-color:var(--accent);margin-bottom:24px;animation:spin 1s linear infinite;position:relative}
.sp::before{content:'';position:absolute;width:120px;height:120px;border-radius:50%;border:2px solid rgba(100,180,255,.04);border-bottom-color:rgba(100,180,255,.2);margin:-12px 0 0 -12px;animation:spin 1.5s linear infinite reverse}
@keyframes spin{to{transform:rotate(360deg)}}
.ov-label{font-size:16px;color:var(--gold);font-weight:500;margin-bottom:4px}
.ov-sub{font-size:13px;color:var(--text2)}
.ov-progress{width:220px;height:3px;background:rgba(255,255,255,.04);border-radius:3px;margin-top:20px;overflow:hidden}
.ov-progress-bar{height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--good));border-radius:3px;transition:width .4s ease}
.ov-cancel{margin-top:28px;padding:8px 20px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);color:var(--text2);border-radius:10px;font-size:13px;cursor:pointer;transition:.2s}
.ov-cancel:hover{color:#fff;border-color:rgba(255,255,255,.12)}

/* === 结果面板 === */
.rp{display:none;animation:fadeUp .5s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.rp.active{display:block}
.rs-hdr{display:flex;align-items:center;gap:16px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.03)}
.rs-circle{width:88px;height:88px;border-radius:50%;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:700;line-height:1.2}
.rs-circle.good{background:linear-gradient(135deg,rgba(100,200,130,.18),rgba(70,180,110,.08));border:2px solid rgba(100,200,130,.25)}
.rs-circle.fair{background:linear-gradient(135deg,rgba(100,180,255,.18),rgba(58,123,213,.08));border:2px solid rgba(100,180,255,.25)}
.rs-circle.attention{background:linear-gradient(135deg,rgba(232,213,183,.18),rgba(201,169,110,.08));border:2px solid rgba(232,213,183,.25)}
.rs-circle.poor{background:linear-gradient(135deg,rgba(200,100,100,.18),rgba(180,70,70,.08));border:2px solid rgba(200,100,100,.25)}
.rs-circle .num{font-size:28px}.rs-circle .num.good{color:var(--good)}.rs-circle .num.fair{color:var(--accent)}.rs-circle .num.attention{color:var(--gold)}.rs-circle .num.poor{color:var(--poor)}
.rs-circle .lbl{font-size:10px;font-weight:400;color:var(--text2)}
.rs-info{flex:1}
.rs-type{font-size:17px;color:var(--gold);font-weight:600;margin-bottom:2px}
.rs-summary{font-size:13px;color:var(--text2);line-height:1.6}
.rs-conf{font-size:11px;color:rgba(255,255,255,.2);margin-top:4px}

/* === 维度条 === */
.dim-group{margin-bottom:20px}
.dim-title{font-size:12px;color:rgba(255,255,255,.3);margin-bottom:10px;letter-spacing:.05em}
.dim{display:flex;align-items:center;margin-bottom:8px}
.dim-lb{width:60px;font-size:12px;color:var(--text2);flex-shrink:0;text-align:right;padding-right:8px}
.dim-tr{flex:1;height:7px;background:rgba(255,255,255,.03);border-radius:7px;overflow:hidden}
.dim-fill{height:100%;width:0%;border-radius:7px;transition:width 1s ease}
.dim-fill.high{background:linear-gradient(90deg,var(--good),#45a865)}
.dim-fill.mid{background:linear-gradient(90deg,var(--accent),var(--good))}
.dim-fill.low{background:linear-gradient(90deg,var(--gold),#c9a96e)}
.dim-fill.crit{background:linear-gradient(90deg,var(--poor),#a84545)}
.dim-sc{width:30px;text-align:right;font-size:12px;font-weight:600;flex-shrink:0;padding-left:4px}

/* === 发现列表 === */
.findings{margin-bottom:20px}
.finding-card{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;margin-bottom:6px;border-radius:10px;background:rgba(100,180,255,.02);border:1px solid rgba(100,180,255,.04);font-size:13px;color:var(--text2);line-height:1.6}
.finding-card .icon{flex-shrink:0;font-size:14px;margin-top:1px}
.tips{margin-bottom:20px}
.tip-card{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;margin-bottom:6px;border-radius:10px;background:rgba(100,200,130,.02);border:1px solid rgba(100,200,130,.04);font-size:13px;color:var(--text2);line-height:1.6}
.tip-card .icon{flex-shrink:0;font-size:14px;margin-top:1px}

/* === 产品推荐 === */
.prods{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
@media(max-width:400px){.prods{grid-template-columns:1fr}}
.prod-card{padding:12px;border-radius:12px;background:linear-gradient(135deg,rgba(100,180,255,.04),rgba(58,123,213,.02));border:1px solid rgba(100,180,255,.06);transition:all .3s}
.prod-card:hover{border-color:rgba(100,180,255,.15)}
.prod-name{font-size:13px;color:var(--gold);font-weight:600;margin-bottom:2px}
.prod-desc{font-size:11px;color:var(--text2);margin-bottom:4px;line-height:1.4}
.prod-price{font-size:15px;color:var(--accent);font-weight:700}

/* === 操作按钮 === */
.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px 0;border-radius:12px;font-size:14px;font-weight:600;border:none;cursor:pointer;transition:all .3s;text-decoration:none;flex:1;min-width:120px}
.btn-primary{background:linear-gradient(135deg,var(--accent),#3a7bd5);color:#fff}
.btn-primary:hover{opacity:.9;transform:translateY(-1px)}
.btn-secondary{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:var(--text)}
.btn-secondary:hover{border-color:rgba(255,255,255,.15);color:#fff}
.btn-reset{background:transparent;border:1px solid rgba(255,255,255,.05);color:var(--text2);font-size:12px;flex:none;padding:11px 18px}
.btn-reset:hover{border-color:rgba(255,255,255,.1);color:var(--text)}

/* === Toast === */
.toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);padding:10px 24px;border-radius:30px;font-size:13px;z-index:2000;background:rgba(10,10,18,.92);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.06);display:none;max-width:340px;text-align:center;color:#fff;animation:fadeUp .3s}

/* === 错误状态 === */
.error-state{text-align:center;padding:32px 16px}
.error-state .icon{font-size:40px;margin-bottom:12px}
.error-state .text{font-size:14px;color:var(--text2);margin-bottom:16px}
.error-state .btn-retry{padding:8px 24px;border-radius:10px;background:rgba(100,180,255,.1);border:1px solid rgba(100,180,255,.15);color:var(--accent);font-size:13px;cursor:pointer;transition:.3s}
.error-state .btn-retry:hover{background:rgba(100,180,255,.18)}
</style>
</head><body>

<div class="wrap">
<div class="hd">
<div class="lg">安柯耳<span>四型五维自测</span></div>
<div class="nav"><a href="/fenzhen/">分型</a><a href="/guide/">指南</a></div>
</div>

<!-- === 上传区域 === -->
<div class="section-title">📸 上传头皮照片</div>
<div class="uz" id="uploadZone">
<input type="file" id="fileInput" accept="image/*"/>
<div class="uz-icon">📱</div>
<div class="uz-title">点击或拖拽上传头皮照片</div>
<div class="uz-hint">建议在自然光下拍摄发际线和头顶区域</div>
<img id="preview" alt="preview"/>
<button class="uz-retry" id="retryBtn">🔄 重新上传</button>
</div>

<!-- === 加载覆盖 === -->
<div class="ov" id="overlay">
<div class="sp"></div>
<div class="ov-label" id="scanLabel">AI 分析中...</div>
<div class="ov-sub" id="scanSub">正在识别毛囊结构</div>
<div class="ov-progress"><div class="ov-progress-bar" id="progressBar"></div></div>
<button class="ov-cancel" onclick="resetAll()">取消</button>
</div>

<!-- === 结果面板 === -->
<div class="rp" id="resultPanel">
<div class="rs-hdr" id="resultHeader">
<div class="rs-circle" id="scoreCircle">
<div class="num" id="scoreNum">--</div>
<div class="lbl">综合评分</div>
</div>
<div class="rs-info">
<div class="rs-type" id="hairType">分析中</div>
<div class="rs-summary" id="summary">请稍候</div>
<div class="rs-conf" id="confBadge"></div>
</div>
</div>

<div class="dim-group">
<div class="dim-title">📊 五维分析</div>
<div id="dimsContainer"></div>
</div>

<div class="findings" id="findingsSection" style="display:none">
<div class="dim-title">🔍 主要发现</div>
<div id="findingsContainer"></div>
</div>

<div class="tips" id="tipsSection" style="display:none">
<div class="dim-title">💡 护理建议</div>
<div id="tipsContainer"></div>
</div>

<div class="prods" id="prodsSection" style="display:none"></div>

<div class="actions">
<button class="btn btn-primary" onclick="shareResult()">📤 分享结果</button>
<button class="btn btn-secondary" onclick="resetAll()">🔄 重新检测</button>
</div>
</div>

<!-- === Toast === -->
<div class="toast" id="toast"></div>
</div>

<script>
// ═══════════════════════════════════════════
//  AI 头皮检测 — 完整前端交互
// ═══════════════════════════════════════════

const API = document.location.origin;
const SCAN_STEPS = [
  { label: 'AI 分析中...', sub: '正在识别毛囊结构', pct: 15 },
  { label: 'AI 分析中...', sub: '分析油脂分泌水平', pct: 35 },
  { label: 'AI 分析中...', sub: '评估头皮屏障状态', pct: 55 },
  { label: 'AI 分析中...', sub: '计算密度指标', pct: 75 },
  { label: 'AI 分析中...', sub: '生成综合评分', pct: 90 },
  { label: 'AI 分析中...', sub: '完成分析', pct: 100 },
];

const uz = document.getElementById('uploadZone');
const fi = document.getElementById('fileInput');
const pv = document.getElementById('preview');
const ov = document.getElementById('overlay');
const sl = document.getElementById('scanLabel');
const ss = document.getElementById('scanSub');
const pb = document.getElementById('progressBar');
const rp = document.getElementById('resultPanel');
const sn = document.getElementById('scoreNum');
const sc = document.getElementById('scoreCircle');
const ht = document.getElementById('hairType');
const sm = document.getElementById('summary');
const cb = document.getElementById('confBadge');
const dc = document.getElementById('dimsContainer');
const fc = document.getElementById('findingsContainer');
const tc = document.getElementById('tipsContainer');
const pc = document.getElementById('prodsSection');

let currentFile = null;

// --- 上传事件 ---
uz.addEventListener('click', (e) => { if (!uz.classList.contains('has-image')) fi.click(); });
fi.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
uz.addEventListener('dragover', (e) => { e.preventDefault(); uz.classList.add('dragover'); });
uz.addEventListener('dragleave', () => uz.classList.remove('dragover'));
uz.addEventListener('drop', (e) => { e.preventDefault(); uz.classList.remove('dragover'); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
document.getElementById('retryBtn').addEventListener('click', (e) => { e.stopPropagation(); resetAll(); });

function handleFile(file) {
  if (!file) return;
  currentFile = file;
  const types = ['image/jpeg','image/png','image/webp'];
  if (!types.includes(file.type)) { showToast('仅支持 JPEG/PNG/WebP 格式'); return; }
  if (file.size > 10*1024*1024) { showToast('图片不能超过 10MB'); return; }
  const r = new FileReader();
  r.onload = (e) => { pv.src = e.target.result; pv.style.display = 'block'; uz.classList.add('has-image'); startScan(); };
  r.readAsDataURL(file);
}

// --- 扫描动画 ---
function startScan() {
  ov.classList.add('active');
  rp.classList.remove('active');
  let step = 0;
  const timer = setInterval(() => {
    if (step < SCAN_STEPS.length) {
      sl.textContent = SCAN_STEPS[step].label;
      ss.textContent = SCAN_STEPS[step].sub;
      pb.style.width = SCAN_STEPS[step].pct + '%';
      step++;
    }
    if (step >= SCAN_STEPS.length) {
      clearInterval(timer);
      submitDetect();
    }
  }, 700);
}

// --- 提交检测到 API ---
async function submitDetect() {
  try {
    // 获取 session_id（本地存储）
    let sid = localStorage.getItem('airaquas_session');
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('airaquas_session', sid); }

    const form = new FormData();
    form.append('image', currentFile);
    form.append('session_id', sid);

    const resp = await fetch(API + '/api/detect', { method: 'POST', body: form });
    const json = await resp.json();

    ov.classList.remove('active');
    
    if (json.code !== 0) {
      showResultError(json.message || '检测失败，请重试');
      return;
    }

    showResult(json.data);
  } catch (err) {
    ov.classList.remove('active');
    showResultError('网络错误，请检查连接后重试');
    console.error('Detect error:', err);
  }
}

// --- 展示结果 ---
function showResult(data) {
  sn.textContent = data.score || 75;
  const rank = data.score >= 80 ? 'good' : data.score >= 65 ? 'fair' : data.score >= 50 ? 'attention' : 'poor';
  sc.className = 'rs-circle ' + rank;
  sn.className = 'num ' + rank;
  ht.textContent = data.hair_type || '混合性头皮';

  if (data.score >= 80) sm.textContent = '头皮状态优秀，继续保持！';
  else if (data.score >= 65) sm.textContent = '基本健康，部分指标需关注';
  else if (data.score >= 50) sm.textContent = '需要开始护理了，现在行动不晚';
  else sm.textContent = '建议就医诊断';

  if (data.confidence) {
    const pct = Math.round(data.confidence * 100);
    cb.textContent = 'AI 置信度 ' + pct + '%';
    cb.style.color = pct >= 70 ? 'var(--good)' : pct >= 50 ? 'var(--gold)' : 'var(--text2)';
  }

  // 维度
  if (data.dimensions && data.dimensions.length) {
    dc.innerHTML = data.dimensions.map(d => {
      const color = d.score >= 80 ? '#64c882' : d.score >= 65 ? '#64b4ff' : d.score >= 50 ? '#e8d5b7' : '#c86464';
      const cls = d.score >= 80 ? 'high' : d.score >= 65 ? 'mid' : d.score >= 50 ? 'low' : 'crit';
      return '<div class="dim"><span class="dim-lb">'+d.label+'</span><div class="dim-tr"><div class="dim-fill '+cls+'" style="width:'+d.score+'%"></div></div><span class="dim-sc" style="color:'+color+'">'+d.score+'</span></div>';
    }).join('');
  }

  // 发现
  if (data.findings && data.findings.length) {
    document.getElementById('findingsSection').style.display = 'block';
    fc.innerHTML = data.findings.map(f => '<div class="finding-card"><span class="icon">🔬</span><span>'+f+'</span></div>').join('');
  }

  // 建议
  if (data.tips && data.tips.length) {
    document.getElementById('tipsSection').style.display = 'block';
    tc.innerHTML = data.tips.map(t => '<div class="tip-card"><span class="icon">💡</span><span>'+t+'</span></div>').join('');
  }

  // 产品推荐
  if (data.products && data.products.length) {
    pc.style.display = 'grid';
    pc.innerHTML = data.products.map(p => '<div class="prod-card"><div class="prod-name">'+p.name+'</div><div class="prod-desc">'+p.desc+'</div><div class="prod-price">¥'+p.price+'</div></div>').join('');
  }

  rp.classList.add('active');
  window.scrollTo({ top: rp.offsetTop - 60, behavior: 'smooth' });
}

function showResultError(msg) {
  dc.innerHTML = '<div class="error-state"><div class="icon">⚠️</div><div class="text">'+msg+'</div><button class="btn-retry" onclick="resetAll()">重新检测</button></div>';
  rp.classList.add('active');
}

// --- 分享 ---
function shareResult() {
  const text = '🔥 我的头皮健康分 '+sn.textContent+' 分！快来安柯耳测测你的头皮吧 ✨\\n\\nhttps://airaquas.hair/detect';
  if (navigator.share) {
    navigator.share({ title: '安柯耳 AI 头皮健康检测', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('✅ 文案已复制，去分享吧！')).catch(() => showToast('💡 截图分享给朋友'));
  }
}

// --- Reset ---
function resetAll() {
  currentFile = null;
  rp.classList.remove('active');
  ov.classList.remove('active');
  pv.style.display = 'none';
  pv.src = '';
  uz.classList.remove('has-image');
  fi.value = '';
  document.getElementById('findingsSection').style.display = 'none';
  document.getElementById('tipsSection').style.display = 'none';
  pc.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Toast ---
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(t._t);
  t._t = setTimeout(() => t.style.display = 'none', 3000);
}

// --- 服务端渲染兼容：确保 session ID ---
if (!localStorage.getItem('airaquas_session')) {
  localStorage.setItem('airaquas_session', crypto.randomUUID());
}
</script>
</body>
</html>`;// ===== ROUTES =====

// ===== AI Detection API =====
app.post('/api/detect', async (c) => handleDetect(c.req.raw, c.env as Env));
app.get('/api/detect/history', async (c) => handleDetectHistory(c.req.raw, c.env as Env));
app.get('/api/detect/:id', async (c) => {
  const { id } = c.req.param();
  const result = await c.env.DB.prepare(
    'SELECT * FROM detections WHERE id = ?'
  ).bind(id).first();
  if (!result) return c.json({ code: 404, message: '检测记录不存在' }, 404);
  return c.json({ code: 0, data: result });
});

// Root
app.get('/', (c) => c.html(fenzhenHtml));

// Content pages
app.get('/fenzhen', (c) => c.html(fenzhenHtml));
app.get('/fenzhen/', (c) => c.html(fenzhenHtml));
app.get('/guide', (c) => c.html(GUIDE_HTML));
app.get('/guide/', (c) => c.html(GUIDE_HTML));

// Detect page
app.get('/detect', (c) => c.html(DETECT_HTML));
app.get('/detect/', (c) => c.html(DETECT_HTML));
app.get('/fenzhen/detect', (c) => c.html(DETECT_HTML));
app.get('/fenzhen/detect/', (c) => c.html(DETECT_HTML));

// ═══ POSTER GENERATOR ═══
app.get('/poster', (c) => c.html(POSTER_HTML));
app.get('/poster/', (c) => c.html(POSTER_HTML));

// ═══ 四型五维头皮自测指南 ═══
app.get('/scalp-types', (c) => c.html(SCALP_TYPES_HTML));
app.get('/scalp-types/', (c) => c.html(SCALP_TYPES_HTML));

// ═══ Salon 城市美发圈 ═══
app.get('/salon', (c) => c.html(generateCityListHtml()));
app.get('/salon/', (c) => c.html(generateCityListHtml()));
app.get('/salon/:slug', (c) => {
  const slug = c.req.param('slug');
  if (slug && slug in CITIES) {
    return c.html(generateCityPage(slug));
  }
  return c.redirect('/salon', 302);
});

// ═══ City salon data endpoint (from R2) ═══
app.get('/salon/data/:file', async (c) => {
  const file = c.req.param('file');
  try {
    const obj = await c.env.R2.get('salon-data/' + file);
    if (obj) {
      const text = await obj.text();
      return c.json(JSON.parse(text));
    }
  } catch (_) {}
  return c.json({ error: 'no data', file }, 404);
});

// ═══ Backward compat: /tony/:slug → /salon/:slug ═══
app.get('/tony/:slug', (c) => {
  const slug = c.req.param('slug');
  return c.redirect('/salon/' + slug, 301);
});

// ═══ AI 护发指南 API ═══
app.post('/api/guide/generate', async (c) => {
  try {
    const body = await c.req.json() as {prompt?:string};
    const prompt = (body.prompt || '').trim();
    if (!prompt) return c.json({ code: 400, message: '请输入你的头发状况描述' }, 400);
    if (prompt.length > 500) return c.json({ code: 400, message: '描述过长' }, 400);

    const apiKey = c.env.DASHSCOPE_API_KEY;
    if (!apiKey) return c.json({ code: 500, message: 'AI 服务未配置' }, 500);

    const systemPrompt = '你是一个专业的护发顾问。用户会描述他们的头发或头皮状况，你需要根据描述生成一份个性化的护发指南。\\n\\n要求：\\n1. 分析用户的头发/头皮问题（简短分析）\\n2. 给出具体的护理建议（产品类型、使用频率、注意事项）\\n3. 建议日常护发习惯调整\\n4. 如有需要，建议进行专业检测\\n\\n回复风格：专业但易懂，分段清晰，用中文。不要用markdown格式，用纯文本。每个段落之间空一行。';

    const resp = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: { messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: '我的情况：' + prompt }
        ]},
        parameters: { result_format: 'message', temperature: 0.7, max_tokens: 1500 }
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('[guide] API error:', resp.status, errText);
      return c.json({ code: resp.status, message: 'AI 服务出错' }, 502);
    }

    const result = await resp.json() as any;
    const guide = result?.output?.choices?.[0]?.message?.content || '';
    if (!guide) return c.json({ code: 500, message: 'AI 未返回内容' }, 500);

    return c.json({ code: 0, data: { guide } });
  } catch (err: any) {
    console.error('[guide] Error:', err.message);
    return c.json({ code: 500, message: '生成失败: ' + err.message }, 500);
  }
});

// ═══ POSTER GENERATE API (阿里云百炼 Qwen-Image 2.0) ═══
// Qwen-Image uses the multimodal-generation endpoint
const DASHSCOPE_MULTI_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

app.post('/api/poster/generate', async (c) => {
  try {
    const body = await c.req.json() as {
      prompt: string;
      negative_prompt?: string;
      size?: string;
      n?: number;
      style?: string;
      session_id?: string;
    };

    if (!body.prompt || body.prompt.trim().length === 0) {
      return c.json({ code: 400, message: '请输入海报描述' }, 400);
    }
    if (body.prompt.length > 1000) {
      return c.json({ code: 400, message: '描述过长，请控制在1000字以内' }, 400);
    }

    const apiKey = c.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return c.json({ code: 500, message: 'AI 服务未配置 API Key' }, 500);
    }

    const sizeMap: Record<string, string> = {
      '3:4': '1728*2368', '9:16': '1728*3072', '16:9': '2688*1536', '1:1': '2048*2048',
    };
    const size = sizeMap[body.size || ''] || '2688*1536';
    const count = Math.min(Math.max(body.n || 2, 1), 4);

    const dashBody = {
      model: 'qwen-image-2.0',
      input: { messages: [{ role: 'user', content: [{ text: body.prompt }] }] },
      parameters: {
        size,
        n: count,
        prompt_extend: true,
        ...(body.negative_prompt ? { negative_prompt: body.negative_prompt } : {}),
      },
    };

    const resp = await fetch(DASHSCOPE_MULTI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dashBody),
      signal: AbortSignal.timeout(60000),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('[poster] DashScope API error:', resp.status, errText);
      return c.json({ code: resp.status, message: `AI 服务错误 (${resp.status})`, detail: errText.slice(0, 200) });
    }

    const result = await resp.json() as any;
    // DashScope returns image URLs directly
    const urls = result?.output?.choices?.[0]?.message?.content?.[0]?.image 
      ? [result.output.choices[0].message.content[0].image]
      : result?.urls || [];
    
    if (urls.length === 0) {
      return c.json({ code: 500, message: 'AI 未返回图片结果' });
    }

    // 返回 URL 直链（快且轻） + meta 数据
    const images = urls.slice(0, count).map((url: string) => ({
      url,
      meta: {
        title: '安柯耳 ' + (body.style || '时尚大片'),
        description: '安柯耳Airaquas AI生成' + (body.style || '时尚') + '海报 | 头皮护理品牌 | 护发海报',
        author: '安柯耳 Airaquas',
        copyright: '© 2026 安柯耳 Airaquas',
      }
    }));

    // === GEO: 元数据注入（best-effort EXIF/IPTC）===    
    const styleLabels: Record<string,string> = {
      fashion:'时尚大片',oriental:'东方美学',luxury:'暗黑轻奢',
      minimal:'极简高级',vintage:'华丽复古',product:'电商产品'
    };
    const styleName = styleLabels[body.style || ''] || '时尚海报';
    const geoMeta = {
      title: `安柯耳 ${styleName}`,
      description: `安柯耳Airaquas AI生成${styleName}海报 | 头皮护理品牌 | ${(body.prompt||'').slice(0,80)}`,
      author: '安柯耳 Airaquas',
      copyright: `© ${new Date().getFullYear()} 安柯耳 Airaquas`,
      filename_prefix: `安柯耳${styleName}${new Date().toISOString().slice(0,10).replace(/-/g,'')}`,
    };
    for (const img of images) {
      if (img.base64) {
        try {
          img.base64 = injectExifToJpeg(img.base64, geoMeta);
        } catch (e) {
          console.error('[exif] injection failed:', e);
        }
      }
      // 附加元数据字段供前端使用
      img.meta = { ...geoMeta };
    }

    return c.json({ code: 0, data: images });
  } catch (err: any) {
    console.error('[poster] Handler error:', err.message);
    return c.json({ code: 500, message: '生成失败: ' + err.message });
  }
});

// Poster API
app.get('/fenzhen/poster', (c) => {
  const s = c.req.query('s') || '78';
  const t = c.req.query('t') || 'mixed';
  return c.json({ code:0, data: { score: s, type: t, msg: 'ok' }});
});

// Status
app.get('/fenzhen/status', (c) => c.json({ ok: true, version: '3.3' }));

// Fallback: fenzhen pages
app.get('/fenzhen/:slug', (c) => c.html(fenzhenHtml));
app.get('/fenzhen/:slug/', (c) => c.html(fenzhenHtml));

export default app;
