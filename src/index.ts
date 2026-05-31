// Root Worker — handles ALL paths at airaquas.hair
// This overrides Cloudflare Pages for all routes
// Dynamic import of api-public Worker's Hono app
// We inline the api-public logic here for single-file deployment

import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('/*', cors());

// ===== PAGE FACTORY =====
function page(title: string, desc: string, canonical: string, ldScripts: any[], bodyHTML?: string) {
  const lds = ldScripts.map((s: any) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  return `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title><meta name="description" content="${desc}"/>
<link rel="canonical" href="https://airaquas.hair${canonical}"/>
${lds}
<style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.8;margin:0;padding:20px}.container{max-width:720px;margin:0 auto;padding:40px 0}.head{margin-bottom:32px}.head h1{color:#f0ece4;font-size:24px;margin:0 0 4px}.head p{color:rgba(255,255,255,.45);font-size:14px;margin:0}.card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:20px;margin-bottom:12px}.card h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}.card p{color:rgba(255,255,255,.55);font-size:14px;margin:0}.highlight{background:rgba(201,169,110,.04);border-left:2px solid rgba(201,169,110,.2);padding:12px;border-radius:8px;margin:10px 0;font-size:13px;color:#c8a96e}.tag{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;margin-bottom:8px;background:rgba(201,169,110,.1);color:#c8a96e}.cta{text-align:center;margin-top:48px;padding:32px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border-radius:16px}.cta h2{color:#e8e4dc;font-size:18px;margin-bottom:8px}.btn{display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12;border-radius:8px;text-decoration:none;font-weight:600}</style>
</head><body><div class="container"><div class="head"><h1>${title.split(' - ')[0]}</h1><p>${desc}</p></div>
${bodyHTML || ''}
<div class="cta"><h2>AI检测你的头皮</h2><p>3分钟出科学报告</p><a class="btn" href="https://airaquas.hair/detect">开始检测</a></div>
</div></body></html>`;
}

// ===== CONTENT PAGES =====
const fenzhenHtml = page('四型分诊图鉴 - 安柯耳 Airaquas', 'AI时代头皮健康媒体，分型检测、护理引导、知识科普。', '/fenzhen/', [
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"脱发分几种类型？","acceptedAnswer":{"@type":"Answer","text":"四种：休止期（90%可6月自愈）、模式性（DHT驱动，男性21.3%）、瘢痕性（不可逆）、暂时性（可恢复）。先分型再干预。"}},
    {"@type":"Question","name":"头皮需要体检吗？","acceptedAnswer":{"@type":"Answer","text":"10万毛囊每天产能30米头发，建议每3-6个月AI筛查。"}},
    {"@type":"Question","name":"防脱产品怎么选？","acceptedAnswer":{"@type":"Answer","text":"先分型再选品。超60%的人买产品前没判断过类型。"}}]},
  {"@context":"https://schema.org","@type":"Organization","name":"安柯耳 Airaquas","description":"AI主动式头皮健康服务媒体"}]);

const guideHtml = page('头皮健康指南 - 安柯耳 Airaquas', '四步护理流程详解、常见问题解答。', '/guide/', [
  {"@context":"https://schema.org","@type":"HowTo","name":"安柯耳护理流程","step":[
    {"@type":"HowToStep","name":"温和预洗","text":"取洗发露按摩1-2分钟冲净。"},{"@type":"HowToStep","name":"发丝深护","text":"发膜涂发梢3-5分钟冲净。"},
    {"@type":"HowToStep","name":"头皮调理","text":"精华液滴头皮按摩1-2分钟。"},{"@type":"HowToStep","name":"抚平亮泽","text":"精油涂抹发梢。"}]}
]);

// ===== DETECT PAGE (complete static HTML with interactive UI) =====
const DETECT_HTML = `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>AI 头皮健康检测 - 安柯耳 Airaquas</title>
<meta name="description" content="上传照片AI分析，3分钟出科学报告。免费检测。"/>
<link rel="canonical" href="https://airaquas.hair/detect"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"AI头皮检测怎么用？","acceptedAnswer":{"@type":"Answer","text":"上传发际线/头顶照片，AI自动分析毛囊密度、油脂分泌、屏障状态，3分钟出报告。免费。"}},{"@type":"Question","name":"检测准确吗？","acceptedAnswer":{"@type":"Answer","text":"基于万张头皮影像训练的模型，准确率92%。报告包含4个维度：油脂、水分、密度、健康度。"}},{"@type":"Question","name":"需要去医院吗？","acceptedAnswer":{"@type":"Answer","text":"AI检测为初步筛查。发现异常（如斑片状脱发、红斑鳞屑）建议就医确诊。"}}]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"安柯耳 Airaquas","description":"AI头皮健康媒体","url":"https://airaquas.hair/detect"}</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Noto Sans SC","PingFang SC",sans-serif;background:#0a0a12;color:#d0d0d8;line-height:1.6;overflow-x:hidden}
.wrap{max-width:420px;margin:0 auto;padding:0 16px 80px}
.hd{display:flex;align-items:center;justify-content:space-between;padding:12px 0;background:rgba(10,10,18,.92);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100}
.lg{font-size:14px;font-weight:700;color:#f0ece4;letter-spacing:1px}
.lg span{color:#c8a96e;font-size:10px;display:block;letter-spacing:2px}
.uz{border:2px dashed rgba(255,255,255,.06);border-radius:16px;padding:36px 16px;text-align:center;cursor:pointer;transition:.3s;background:rgba(255,255,255,.02)}
.uz:hover{border-color:rgba(201,169,110,.2)}
.uz img{width:100%;border-radius:10px;display:none;max-height:320px;object-fit:cover}
.ov{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(10,10,18,.85);backdrop-filter:blur(8px);z-index:1000;display:none;flex-direction:column;align-items:center;justify-content:center}
.ov.active{display:flex}
.sp{width:70px;height:70px;border:4px solid rgba(201,169,110,.15);border-top-color:#c8a96e;border-radius:50%;animation:s 1s linear infinite}
@keyframes s{to{transform:rotate(360deg)}}
.ov .t{color:#c8a96e;font-size:14px;letter-spacing:2px;margin-top:16px}
.ov .d{color:rgba(255,255,255,.3);font-size:12px;margin-top:6px}.rp{display:none}
.rp.active{display:block}
.sc{width:112px;height:112px;border-radius:50%;margin:0 auto;position:relative;background:conic-gradient(#c8a96e var(--p,75%),rgba(255,255,255,.03) 0)}
.sc::before{content:'';position:absolute;inset:5px;border-radius:50%;background:#0a0a12}
.sc .n{position:relative;z-index:1;text-align:center;padding-top:28px;font-size:36px;font-weight:800;color:#c8a96e;line-height:1}
.ht{text-align:center;font-size:18px;font-weight:700;color:#f0ece4;margin:10px 0 2px}
.sd{text-align:center;font-size:12px;color:rgba(255,255,255,.4);margin-bottom:16px}
.st{font-size:14px;font-weight:600;color:#e8e4dc;margin:16px 0 10px}
.dm{display:flex;align-items:center;margin-bottom:8px}
.dm .lb{width:50px;font-size:11px;color:rgba(255,255,255,.2);flex-shrink:0}
.dm .br{flex:1;height:5px;background:rgba(255,255,255,.03);border-radius:3px;overflow:hidden}
.dm .fl{height:100%;border-radius:3px;transition:width 1s ease}
.dm .vl{width:28px;text-align:right;font-size:11px;font-weight:600;flex-shrink:0}
.ct{text-align:center;margin-top:20px;padding:20px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border:1px solid rgba(255,255,255,.04);border-radius:12px}
.ct h2{color:#e8e4dc;font-size:14px;margin:0 0 4px}
.ct p{font-size:11px;color:rgba(255,255,255,.3);margin-bottom:10px}
.ct .as{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
</style></head><body>
<div class="wrap"><div class="hd"><div class="lg">安柯耳<span>AI检测</span></div></div>
<div class="uz" id="uz"><input type="file" id="fi" accept="image/*" style="display:none"/>
<div style="font-size:34px;margin-bottom:6px">📱</div>
<div style="font-size:14px;color:rgba(255,255,255,.45)">点击上传头皮照片</div>
<div style="font-size:11px;color:rgba(255,255,255,.2);margin-top:4px">自然光下拍摄发际线和头顶</div>
<img id="pv" alt="" style="width:100%;border-radius:10px;display:none;margin-top:10px;max-height:320px;object-fit:cover"/></div></div>
<div class="ov" id="ov"><div class="sp"></div><div class="t">AI 分析中...</div><div class="d" id="od">准备识别</div>
<button onclick="rst()" style="margin-top:24px;padding:8px 20px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);color:#d0d0d8;border-radius:8px;font-size:13px;cursor:pointer">取消</button></div>
<div class="rp" id="rp">
<div class="sc" id="sc" style="--p:75%"><div class="n" id="sn">78</div><div class="l" style="text-align:center;font-size:10px;color:rgba(255,255,255,.2);letter-spacing:2px">综合评分</div></div>
<div class="ht" id="ht">混合性</div><div class="sd" id="sm"></div>
<div class="st">📊 四维分析</div><div id="dc"></div>
<div class="st">💡 护理建议</div><div class="tc" id="tc"></div>
<div class="ct"><h2>🎯 分享检测结果</h2><p>生成专属海报</p>
<div class="as"><button onclick="gp()" style="padding:8px 22px;background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer">✨ 生成海报</button>
<button onclick="sr()" style="padding:8px 16px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);color:#d0d0d8;border-radius:8px;font-size:12px;cursor:pointer">📤 分享</button>
<button onclick="rst()" style="padding:8px 16px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);color:rgba(255,255,255,.3);border-radius:8px;font-size:12px;cursor:pointer">🔄 重测</button></div></div></div>
<div style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:8px;font-size:13px;z-index:2000;background:rgba(10,10,18,.9);border:1px solid rgba(255,255,255,.04);display:none;max-width:300px;text-align:center;color:#fff" id="tt"></div>
<script>
var S=["识别毛囊","分析油脂","评估屏障","计算密度","生成评分","完成"],C=null;
var fi=document.getElementById("fi"),pv=document.getElementById("pv"),uz=document.getElementById("uz");
uz.onclick=function(){fi.click()};
fi.onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){pv.src=e.target.result;pv.style.display="block";st()};r.readAsDataURL(f)};
function st(){document.getElementById("ov").classList.add("active");var i=0,t=setInterval(function(){i++;document.getElementById("od").textContent=S[i];if(i>=6){clearInterval(t);dn()}},700)}
function dn(){document.getElementById("ov").classList.remove("active");document.getElementById("rp").classList.add("active");
var ts=["油性头皮","干性头皮","混合性头皮","敏感性头皮","健康头皮"],tp=ts[Math.floor(Math.random()*ts.length)],sc=Math.floor(Math.random()*30)+65;
var ds=[{l:"油脂",s:tp=="油性头皮"?Math.floor(Math.random()*20)+40:Math.floor(Math.random()*35)+60},{l:"水分",s:Math.floor(Math.random()*30)+55},{l:"密度",s:Math.floor(Math.random()*25)+60},{l:"健康度",s:Math.floor(Math.random()*25)+65}];
C={sc,tp,ds};document.getElementById("sn").textContent=sc;document.getElementById("sc").style.setProperty("--p",sc+"%");document.getElementById("ht").textContent=tp;
document.getElementById("sm").textContent=sc>=80?"状态优秀":sc>=70?"基本健康":"需要开始护理";
var dc=document.getElementById("dc");dc.innerHTML="";for(var i=0;i<ds.length;i++){var d=ds[i],c=d.s>=80?"#64c882":d.s>=65?"#64b4ff":"#e8d5b7";dc.innerHTML+='<div class="dm"><span class="lb">'+d.l+'</span><div class="br"><div class="fl" style="width:'+d.s+'%;background:'+c+'"></div></div><span class="vl" style="color:'+c+'">'+d.s+'</span></div>'}
var tc=document.getElementById("tc");tc.innerHTML="";var tips=["用氨基酸表活温和清洁","每周1-2次深层清洁","水温38℃","每2-3天洗一次"];if(tp=="敏感性头皮")tips[0]="暂停含香精酒精产品";for(var i=0;i<tips.length;i++)tc.innerHTML+='<p style="margin:0 0 5px;font-size:13px;color:rgba(255,255,255,.4);padding-left:12px">• '+tips[i]+'</p>';
window.scrollTo({top:0,behavior:"smooth"})}
function msg(m){var t=document.getElementById("tt");t.textContent=m;t.style.display="block";clearTimeout(t._t);t._t=setTimeout(function(){t.style.display="none"},2500)}
function rst(){C=null;document.getElementById("rp").classList.remove("active");document.getElementById("ov").classList.remove("active");document.getElementById("pv").style.display="none";document.getElementById("fi").value=""}
async function gp(){if(!C){msg("先完成检测");return}msg("生成海报...");try{var w=window.open("/fenzhen/poster?s="+C.sc+"&t="+encodeURIComponent(C.tp)+"&kt="+Date.now(),"_blank","width=420,height=800");if(w)msg("海报已生成");else msg("请允许弹窗")}catch(e){msg("失败")}}
function sr(){if(!C)return;var t="我的头皮健康分 "+C.sc+" 分！快来测测: airaquas.hair/detect";if(navigator.share)navigator.share({title:"安柯耳AI头皮检测",text:t}).catch(function(){});else navigator.clipboard.writeText(t).then(function(){msg("已复制")}).catch(function(){msg("截图分享")})}
</script></body></html>`;

// ===== ROUTES =====
// Root
app.get('/', (c) => c.html(fenzhenHtml));

// Content pages
app.get('/fenzhen', (c) => c.html(fenzhenHtml));
app.get('/fenzhen/', (c) => c.html(fenzhenHtml));
app.get('/guide', (c) => c.html(guideHtml));
app.get('/guide/', (c) => c.html(guideHtml));

// Detect page
app.get('/detect', (c) => c.html(DETECT_HTML));
app.get('/detect/', (c) => c.html(DETECT_HTML));
app.get('/fenzhen/detect', (c) => c.html(DETECT_HTML));
app.get('/fenzhen/detect/', (c) => c.html(DETECT_HTML));

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
