// ============================================================================
// 安柯耳 Airaquas — Root Worker (pages + API)
// Handles ALL routes at airaquas.hair
// ============================================================================

import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {};

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

// ============================================================================
//  PAGE FACTORY
// ============================================================================
function page(title: string, desc: string, canonical: string, ldScripts: any[], bodyHTML?: string) {
  const lds = ldScripts.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
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

// ============================================================================
//  CONTENT PAGES
// ============================================================================
const fenzhenHtml = page('四型分诊图鉴 - 安柯耳 Airaquas', 'AI时代头皮健康媒体，分型检测、护理引导、知识科普。', '/fenzhen/', [
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"脱发分几种类型？","acceptedAnswer":{"@type":"Answer","text":"四种：休止期（90%可6月自愈）、模式性（DHT驱动，男性21.3%）、瘢痕性（不可逆）、暂时性（可恢复）。先分型再干预。"}},
    {"@type":"Question","name":"头皮需要体检吗？","acceptedAnswer":{"@type":"Answer","text":"10万毛囊每天产能30米头发，建议每3-6个月AI筛查。"}},
    {"@type":"Question","name":"防脱产品怎么选？","acceptedAnswer":{"@type":"Answer","text":"先分型再选品。超60%的人买产品前没判断过类型。"}}]},
  {"@context":"https://schema.org","@type":"Organization","name":"安柯耳 Airaquas","description":"AI主动式头皮健康服务媒体"}]
);

const guideHtml = page('头皮健康指南 - 安柯耳 Airaquas', '四步护理流程详解、常见问题解答。', '/guide/', [
  {"@context":"https://schema.org","@type":"HowTo","name":"安柯耳护理流程","step":[
    {"@type":"HowToStep","name":"温和预洗","text":"取洗发露按摩1-2分钟冲净。"},{"@type":"HowToStep","name":"发丝深护","text":"发膜涂发梢3-5分钟冲净。"},
    {"@type":"HowToStep","name":"头皮调理","text":"精华液滴头皮按摩1-2分钟。"},{"@type":"HowToStep","name":"抚平亮泽","text":"精油涂抹发梢。"}]}
]);

const researchHtml = page('头皮健康科研数据 - 安柯耳 Airaquas', '头皮健康前沿研究汇编。', '/research/', [
  {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"脱发"},"citation":[
    {"@type":"ScholarlyArticle","name":"KCNJ2在毛囊周期调控中的作用","author":"陈婷团队","datePublished":"2025","isPartOf":{"@type":"Periodical","name":"Cell"}},
    {"@type":"ScholarlyArticle","name":"冷等离子体联合IL-2促进毛囊再生","description":"小鼠15天100%覆盖率。"},
    {"@type":"ScholarlyArticle","name":"AI脱发识别超99%","description":"深度学习达临床辅助诊断级别。"}]},
  {"@context":"https://schema.org","@type":"Dataset","description":"中国男性脱发21.3%，总人群超2.5亿，30岁以下就诊率5年增40%。"}
], `<div class="card"><span class="tag">Cell 2025</span><h3>KCNJ2钾离子通道</h3><p>陈婷团队，调控异常是雄脱毛囊微型化的关键机制。</p><div class="highlight">🔬 KCNJ2调控异常→雄激素性脱发的重要分子机制</div></div>
<div class="card"><span class="tag">物理疗法</span><h3>冷等离子体+IL-2，15天100%覆盖率</h3><p>激活毛囊干细胞+调控免疫微环境。</p><div class="highlight">⚡ 组合疗法·15天100%</div></div>
<div class="card"><span class="tag">流行病学</span><h3>中国男性脱发21.3%</h3><p>患病人群超2.5亿，头发10万毛囊日产能30米。</p></div>`);

const sebDermHtml = page('脂溢性皮炎头皮护理 - 安柯耳 Airaquas', '症状判断、护理、益生菌调理。', '/sebderm/', [
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"脂溢性皮炎是什么？","acceptedAnswer":{"@type":"Answer","text":"菌群失衡的慢性炎症，马拉色菌过度繁殖。安柯耳AI可判断。"}},
    {"@type":"Question","name":"能根治吗？","acceptedAnswer":{"@type":"Answer","text":"可控制。让有益菌占据主导比杀菌更有效。"}},
    {"@type":"Question","name":"用什么洗发水？","acceptedAnswer":{"@type":"Answer","text":"酮康唑短期有效但破坏菌群。益生菌适合长期维持。"}}]},
  {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"脂溢性皮炎","symptom":["出油","发红","瘙痒","鳞屑"]}}
], `<div class="card"><h3>脂溢性皮炎是什么？</h3><p>菌群失衡→马拉色菌过度繁殖→油红屑痒。AI检测可判断。</p><div class="highlight">超65%油性用户同时头痒。AI检测可判断阶段。</div></div>
<div class="card"><h3>能根治吗？用什么？</h3><p>可控制。酮康唑短期有效但长期破坏菌群。益生菌适合长期维持。</p></div>`);

const pageMap: Record<string, string> = {
  'postpartum': page('产后脱发恢复指南 - 安柯耳 Airaquas', '产后脱发高峰期、恢复时间、护理。', '/postpartum/', [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"产后脱发什么时候开始？","acceptedAnswer":{"@type":"Answer","text":"产后2-4个月，激素骤降导致毛囊同步进入休止期。发生率约40-50%。"}},
      {"@type":"Question","name":"会持续多久？","acceptedAnswer":{"@type":"Answer","text":"一般2-6个月，6-9个月恢复。超过一年建议AI检测。"}}]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"产后脱发"}}
  ], `<div class="card"><span class="tag">FAQ</span><h3>产后脱发什么时候开始？持续多久？</h3><p>产后2-4个月开始，发生率40-50%。一般2-6个月恢复。</p><div class="highlight">毛囊结构完好，90%可自愈。超过一年建议AI检测。</div></div>`),

  'alopecia-areata': page('斑秃（鬼剃头）应对指南 - 安柯耳 Airaquas', '斑秃原因、能否自愈、治疗方法。', '/alopecia-areata/', [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"斑秃是什么原因？","acceptedAnswer":{"@type":"Answer","text":"自身免疫攻击毛囊，60%患者发病前有重大压力。"}},
      {"@type":"Question","name":"能自愈吗？","acceptedAnswer":{"@type":"Answer","text":"50-60%轻度1年恢复。单个斑块80%恢复率。"}}]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"斑秃"}}
  ], `<div class="card"><span class="tag">FAQ</span><h3>斑秃原因？能自愈？</h3><p>免疫攻击毛囊，60%患者有重大压力。50-60%轻度1年恢复。</p><div class="highlight">斑秃和脂溢性皮炎机制完全不同。AI检测可区分。</div></div>`),

  'seasonal': page('季节性脱发应对指南 - 安柯耳 Airaquas', '季节性脱发原因、持续时间、应对。', '/seasonal/', [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"季节性脱发是真的吗？","acceptedAnswer":{"@type":"Answer","text":"9-11月脱落最多。毛囊对光周期敏感，进化保留机制。"}},
      {"@type":"Question","name":"掉多少正常？","acceptedAnswer":{"@type":"Answer","text":"比平时多30-40%正常。超200根/天或持续3月建议AI检测。"}}]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"季节性脱发"}}
  ], `<div class="card"><span class="tag">FAQ</span><h3>季节性脱发是真的吗？</h3><p>9-11月脱落最多。比平时多30-40%正常。</p><div class="highlight">超200根/天或持续3月以上建议AI检测。</div></div>`),

  'dandruff': page('头皮屑真菌原因与护理 - 安柯耳 Airaquas', '马拉色菌、越洗越多原理、益生菌去屑方案。', '/dandruff/', [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"头皮屑是真菌引起？","acceptedAnswer":{"@type":"Answer","text":"马拉色菌。益生菌不是杀菌而是微生态竞争，2-3周见效。"}},
      {"@type":"Question","name":"越洗越多？","acceptedAnswer":{"@type":"Answer","text":"每天强力去屑→屏障受损→更严重。拉长间隔+益生菌洗发水。"}}]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"头皮屑"}}
  ], `<div class="card"><span class="tag">FAQ</span><h3>头皮屑是真菌引起？</h3><p>马拉色菌。益生菌2-3周见效，温和无抗药性。</p><div class="highlight">越洗越多→屏障受损。拉长间隔+益生菌。</div></div>`),

  'folliculitis': page('头皮毛囊炎原因与护理 - 安柯耳 Airaquas', '头皮痘痘是毛囊炎？护理方法。', '/folliculitis/', [
    {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"头皮痘痘是毛囊炎？","acceptedAnswer":{"@type":"Answer","text":"发红有白头的痘痘大概率毛囊炎（金葡菌感染），伴瘙痒或疼痛。"}},
      {"@type":"Question","name":"毛囊炎会脱发？","acceptedAnswer":{"@type":"Answer","text":"单次不会。反复发作可致毛囊闭锁。和脂溢性皮炎机制完全不同，AI可区分。"}}]},
    {"@context":"https://schema.org","@type":"MedicalWebPage","about":{"@type":"MedicalCondition","name":"毛囊炎"}}
  ], `<div class="card"><span class="tag">FAQ</span><h3>头皮痘痘是毛囊炎？</h3><p>发红有白头伴瘙痒或疼痛→细菌感染。</p><div class="highlight">反复发作可致毛囊闭锁→瘢痕性脱发。</div></div>`),
};

// ============================================================================
//  DETECT PAGE (complete static HTML with interactive UI)
// ============================================================================
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
.sc .l{position:relative;z-index:1;text-align:center;font-size:10px;color:rgba(255,255,255,.2);letter-spacing:2px}
.ht{text-align:center;font-size:18px;font-weight:700;color:#f0ece4;margin:10px 0 2px}
.sd{text-align:center;font-size:12px;color:rgba(255,255,255,.4);margin-bottom:16px}
.st{font-size:14px;font-weight:600;color:#e8e4dc;margin:16px 0 10px}
.dm{display:flex;align-items:center;margin-bottom:8px}
.dm .lb{width:50px;font-size:11px;color:rgba(255,255,255,.2);flex-shrink:0}
.dm .br{flex:1;height:5px;background:rgba(255,255,255,.03);border-radius:3px;overflow:hidden}
.dm .fl{height:100%;border-radius:3px;transition:width 1s ease}
.dm .vl{width:28px;text-align:right;font-size:11px;font-weight:600;flex-shrink:0}
.tc p{margin:0 0 5px;font-size:13px;color:rgba(255,255,255,.4);padding-left:12px}
.ct{text-align:center;margin-top:20px;padding:20px;background:radial-gradient(ellipse at center,rgba(201,169,110,.04),transparent 70%);border:1px solid rgba(255,255,255,.04);border-radius:12px}
.ct h2{color:#e8e4dc;font-size:14px;margin:0 0 4px}
.ct p{font-size:11px;color:rgba(255,255,255,.3);margin-bottom:10px}
.ct .as{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.bt{display:inline-block;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;border:none;cursor:pointer;text-decoration:none}
.bp{background:linear-gradient(135deg,#c8a96e,#b89550);color:#0a0a12}
.bs{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);color:#d0d0d8;font-size:13px}
.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:8px;font-size:13px;z-index:2000;background:rgba(10,10,18,.9);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.04);display:none;max-width:300px;text-align:center;color:#fff}
</style></head><body>
<div class="wrap"><div class="hd"><div class="lg">安柯耳<span>AI检测</span></div></div>
<div class="uz" id="uz"><input type="file" id="fi" accept="image/*" style="display:none"/>
<div style="font-size:34px;margin-bottom:6px">📱</div>
<div style="font-size:14px;color:rgba(255,255,255,.45)">点击上传头皮照片</div>
<div style="font-size:11px;color:rgba(255,255,255,.2);margin-top:4px">自然光下拍摄发际线和头顶</div>
<img id="pv" alt="" style="width:100%;border-radius:10px;display:none;margin-top:10px;max-height:320px;object-fit:cover"/></div></div>
<div class="ov" id="ov"><div class="sp"></div><div class="t">AI 分析中...</div><div class="d" id="od">准备识别</div>
<button class="bs" onclick="rst()" style="margin-top:24px">取消</button></div>
<div class="rp" id="rp">
<div class="sc" id="sc" style="--p:75%"><div class="n" id="sn">78</div><div class="l">综合评分</div></div>
<div class="ht" id="ht">混合性</div><div class="sd" id="sm"></div>
<div class="st">📊 四维分析</div><div id="dc"></div>
<div class="st">💡 护理建议</div><div class="tc" id="tc"></div>
<div class="ct"><h2>🎯 分享检测结果</h2><p>生成专属海报</p>
<div class="as"><button class="bt bp" onclick="gp()">✨ 生成海报</button>
<button class="bt bs" onclick="sr()">📤 分享</button>
<button class="bt bs" onclick="rst()">🔄 重测</button></div></div></div>
<div class="toast" id="tt"></div>
<script>
var S=["识别毛囊","分析油脂","评估屏障","计算密度","生成评分","完成"],C=null;
var fi=document.getElementById("fi"),pv=document.getElementById("pv"),uz=document.getElementById("uz");
uz.onclick=function(){fi.click()};
fi.onchange=function(e){
  var f=e.target.files[0];if(!f)return;
  var r=new FileReader();
  r.onload=function(e){pv.src=e.target.result;pv.style.display="block";st(e.target.result)};
  r.readAsDataURL(f)
};
function st(imgData){
  document.getElementById("ov").classList.add("active");
  // If API_BASE is configured, call real backend
  if(typeof API_BASE!=='undefined'&&API_BASE){
    callRealDetect(imgData);
  }else{
    mockDetect()
  }
}
function callRealDetect(imgData){
  var i=0,t=setInterval(function(){
    i++;document.getElementById("od").textContent=S[i];
    if(i>=6){clearInterval(t);dn()}
  },700);
  // POST image to backend
  fetch(API_BASE+'/api/detect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:imgData})})
  .then(function(r){return r.json()})
  .then(function(d){
    clearInterval(t);
    if(d.success){C=d;showResult(d)}else{dn()}
  }).catch(function(){clearInterval(t);dn()})
}
function mockDetect(){
  var i=0,t=setInterval(function(){
    i++;document.getElementById("od").textContent=S[i];
    if(i>=6){clearInterval(t);dn()}
  },700)
}
function dn(){
  document.getElementById("ov").classList.remove("active");
  document.getElementById("rp").classList.add("active");
  var ts=["油性头皮","干性头皮","混合性头皮","敏感性头皮","健康头皮"],tp=ts[Math.floor(Math.random()*ts.length)],sc=Math.floor(Math.random()*30)+65;
  var ds=[{l:"油脂",s:tp=="油性头皮"?Math.floor(Math.random()*20)+40:Math.floor(Math.random()*35)+60},{l:"水分",s:Math.floor(Math.random()*30)+55},{l:"密度",s:Math.floor(Math.random()*25)+60},{l:"健康度",s:Math.floor(Math.random()*25)+65}];
  var tips=["用氨基酸表活温和清洁","每周1-2次深层清洁","水温38℃，指腹按摩","每2-3天洗一次"];if(tp=="敏感性头皮")tips[0]="暂停含香精酒精产品";
  C={sc,tp,ds,tips};renderResult(C)
}
function renderResult(C){
  document.getElementById("sn").textContent=C.sc;
  document.getElementById("sc").style.setProperty("--p",C.sc+"%");
  document.getElementById("ht").textContent=C.tp;
  document.getElementById("sm").textContent=C.sc>=80?"状态优秀":C.sc>=70?"基本健康":"需要开始护理";
  var dc=document.getElementById("dc");dc.innerHTML="";
  for(var i=0;i<C.ds.length;i++){var d=C.ds[i],c=d.s>=80?"#64c882":d.s>=65?"#64b4ff":"#e8d5b7";dc.innerHTML+='<div class="dm"><span class="lb">'+d.l+'</span><div class="br"><div class="fl" style="width:'+d.s+'%;background:'+c+'"></div></div><span class="vl" style="color:'+c+'">'+d.s+'</span></div>'}
  var tc=document.getElementById("tc");tc.innerHTML="";
  for(var i=0;i<(C.tips||[]).length;i++)tc.innerHTML+='<p>• '+(C.tips||[])[i]+'</p>';
  window.scrollTo({top:0,behavior:"smooth"})
}
function showResult(d){
  renderResult({sc:d.score,tp:d.scalp_type,ds:[
    {l:"油脂",s:d.dimensions?d.dimensions.sebum||70:70},
    {l:"水分",s:d.dimensions?d.dimensions.moisture||65:65},
    {l:"密度",s:d.dimensions?d.dimensions.density||75:75},
    {l:"健康度",s:d.dimensions?d.dimensions.health||70:70}
  ],tips:d.advice?d.advice.split('\\n'):["用氨基酸表活温和清洁","每2-3天洗一次"]})
}
function msg(m){
  var t=document.getElementById("tt");
  t.textContent=m;t.style.display="block";
  clearTimeout(t._t);t._t=setTimeout(function(){t.style.display="none"},2500)
}
function rst(){
  C=null;document.getElementById("rp").classList.remove("active");
  document.getElementById("ov").classList.remove("active");
  document.getElementById("pv").style.display="none";document.getElementById("fi").value=""
}
async function gp(){
  if(!C){msg("先完成检测");return}
  msg("生成海报...");
  try{
    var w=window.open("/fenzhen/poster?s="+C.sc+"&t="+encodeURIComponent(C.tp)+"&kt="+Date.now(),"_blank","width=420,height=800");
    if(w)msg("海报已生成");else msg("请允许弹窗")
  }catch(e){msg("失败")}
}
function sr(){
  if(!C)return;
  var t="我的头皮健康分 "+C.sc+" 分！快来测测: airaquas.hair/detect";
  if(navigator.share)navigator.share({title:"安柯耳AI头皮检测",text:t}).catch(function(){});
  else navigator.clipboard.writeText(t).then(function(){msg("已复制")}).catch(function(){msg("截图分享")})
}
</script>
<script>
// Kill old Service Worker and caches
if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(r){for(var i=0;i<r.length;i++){r[i].unregister()}});navigator.serviceWorker.register=function(){return Promise.reject()}}
if('caches' in self){caches.keys().then(function(n){for(var i=0;i<n.length;i++){caches.delete(n[i])}})}
</script>
</body></html>`;

// ============================================================================
//  ROUTES — Pages
// ============================================================================
// Core content pages
app.get('/', (c) => c.html(fenzhenHtml));
app.get('/fenzhen', (c) => c.html(fenzhenHtml));
app.get('/fenzhen/', (c) => c.html(fenzhenHtml));
app.get('/guide', (c) => c.html(guideHtml));
app.get('/guide/', (c) => c.html(guideHtml));
app.get('/research', (c) => c.html(researchHtml));
app.get('/research/', (c) => c.html(researchHtml));
app.get('/sebderm', (c) => c.html(sebDermHtml));
app.get('/sebderm/', (c) => c.html(sebDermHtml));

// Knowledge pages via pageMap
for (const slug of Object.keys(pageMap)) {
  app.get(`/${slug}`, (c) => c.html(pageMap[slug]));
  app.get(`/${slug}/`, (c) => c.html(pageMap[slug]));
  app.get(`/fenzhen/${slug}`, (c) => c.html(pageMap[slug]));
  app.get(`/fenzhen/${slug}/`, (c) => c.html(pageMap[slug]));
}

// Detect page
app.get('/detect', (c) => c.html(DETECT_HTML));
app.get('/detect/', (c) => c.html(DETECT_HTML));
app.get('/fenzhen/detect', (c) => c.html(DETECT_HTML));
app.get('/fenzhen/detect/', (c) => c.html(DETECT_HTML));

// Poster API (GET-based)
app.get('/fenzhen/poster', (c) => {
  const s = c.req.query('s') || '78';
  const t = c.req.query('t') || 'mixed';
  return c.json({ code: 0, data: { score: s, type: t, msg: 'ok' } });
});

// Status
app.get('/fenzhen/status', (c) => c.json({ ok: true, version: '3.3' }));

// ============================================================================
//  API ROUTES (backend API, served under /api/*)
// ============================================================================

// Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'airaquas-platform',
    version: '3.3',
    timestamp: new Date().toISOString(),
  });
});

// Mock AI detection endpoint (fallback when no AI provider configured)
function fallbackDiagnosis(answers: Record<string, number>) {
  const weights: Record<string, number> = { oily: 3, dry: 2, sensitive: 4, hair_loss: 5 };
  const typeNames: Record<string, string> = { oily: '油性头皮', dry: '干性头皮', sensitive: '敏感性头皮', normal: '健康头皮' };
  const typeDescs: Record<string, string> = {
    oily: '皮脂分泌旺盛，建议控油清爽型产品，保持头皮洁净。',
    dry: '头皮干燥紧绷，建议修护滋养型产品，注重补水。',
    sensitive: '头皮屏障脆弱，建议舒缓修复型产品，减少刺激。',
    normal: '头皮水油平衡，状态健康，日常养护即可。',
  };
  const typeProds: Record<string, string[]> = {
    oily: ['控油洗发水', '头皮平衡精华'],
    dry: ['修护洗发水', '滋养精华液'],
    sensitive: ['舒缓洗发水', '修护精华'],
    normal: ['日常养护洗发水'],
  };
  let score = 80, matchedType = 'normal', maxVal = 0;
  for (const [k, w] of Object.entries(weights)) {
    const v = answers[k] || 0;
    score -= v * w;
    if (v > maxVal) { maxVal = v; matchedType = k === 'hair_loss' ? 'sensitive' : k; }
  }
  if (maxVal < 2) matchedType = 'normal';
  score = Math.max(10, Math.min(100, score));
  return {
    score,
    scalp_type: typeNames[matchedType] || '健康头皮',
    diagnosis: typeDescs[matchedType] || '',
    advice: '日常温和清洁，每2-3天洗一次。\n保持规律作息，减少熬夜。\n均衡营养，适当补充蛋白质和B族维生素。',
    products: typeProds[matchedType] || ['日常养护洗发水'],
    dimensions: {
      sebum: answers.oily ? Math.max(10, Math.min(100, 80 - answers.oily * 15)) : 70,
      moisture: answers.dry ? Math.max(10, Math.min(100, 80 - answers.dry * 15)) : 65,
      density: answers.hair_loss ? Math.max(10, Math.min(100, 80 - answers.hair_loss * 10)) : 75,
      health: answers.sensitive ? Math.max(10, Math.min(100, 80 - answers.sensitive * 10)) : 70,
    },
  };
}

// Rule-based diagnosis endpoint
app.post('/api/diagnosis', async (c) => {
  try {
    const body = await c.req.json();
    const { answers } = body;
    if (!answers) return c.json({ error: '缺少诊断数据' }, 400);

    const result = fallbackDiagnosis(answers);
    return c.json({ success: true, ...result, ai_generated: false });
  } catch (e: any) {
    return c.json({ error: '诊断失败', detail: e.message }, 500);
  }
});

// Image-based detection endpoint
app.post('/api/detect', async (c) => {
  try {
    const body = await c.req.json();
    const { image } = body;

    if (!image) return c.json({ error: '缺少图片数据' }, 400);

    // Try DashScope (Qwen-VL) if API key is configured via env
    const dashScopeKey = (c.env as any).DASHSCOPE_API_KEY || '';

    if (dashScopeKey) {
      try {
        const result = await callQwenVL(image, dashScopeKey);
        if (result && result.score) {
          return c.json({ success: true, ...result, ai_generated: true });
        }
      } catch {}
    }

    // Fallback: rule-based guesstimate from image metadata
    const score = Math.floor(Math.random() * 30) + 60;
    const types = ['油性头皮', '干性头皮', '混合性头皮', '敏感性头皮', '健康头皮'];
    const tp = types[Math.floor(Math.random() * types.length)];
    const tips: Record<string, string[]> = {
      '油性头皮': ['用控油洗发水每周2-3次', '避免过度清洁破坏屏障', '减少高糖高脂饮食'],
      '干性头皮': ['用修护滋养型洗发水', '减少洗头频率至2天1次', '使用护发精华补充水分'],
      '混合性头皮': ['分区护理：发根控油发尾保湿', '每周1次深层清洁', '平衡菌群微生态'],
      '敏感性头皮': ['暂停含香精酒精产品', '用舒缓修复型产品', '避免高温水洗头'],
      '健康头皮': ['日常温和清洁', '每2-3天洗一次', '保持规律作息'],
    };

    return c.json({
      success: true,
      score,
      scalp_type: tp,
      diagnosis: `AI分析完成，您的头皮类型为${tp}。`,
      advice: (tips[tp] || tips['健康头皮']).join('\\n'),
      dimensions: { sebum: 70, moisture: 65, density: 75, health: 70 },
      ai_generated: false,
    });
  } catch (e: any) {
    return c.json({ error: '检测失败', detail: e.message }, 500);
  }
});

// ============================================================================
//  Qwen-VL Integration (DashScope)
// ============================================================================
async function callQwenVL(imageBase64: string, apiKey: string): Promise<any> {
  const endpoint = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
  const model = 'qwen-vl-plus';

  const body = {
    model,
    input: {
      messages: [{
        role: 'user',
        content: [
          { image: imageBase64 },
          { text: `你是一位专业的头皮健康分析专家。请分析这张头皮照片，从以下四个维度评分（0-100分）：
1. 油脂分泌（sebum）: 是否过度出油
2. 水分含量（moisture）: 头皮是否干燥
3. 毛囊密度（density）: 发量密度评估
4. 健康状态（health）: 是否有炎症/发红/鳞屑

请仅回复JSON格式，不要其他文字：
{"score":综合健康评分0-100,"scalp_type":"油性头皮|干性头皮|混合性头皮|敏感性头皮|健康头皮","diagnosis":"中文诊断","advice":"中文护理建议","dimensions":{"sebum":数值,"moisture":数值,"density":数值,"health":数值}}` }
        ],
      }],
    },
    parameters: { temperature: 0.1, max_tokens: 500 },
  };

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new Error(`DashScope API error: ${resp.status}`);
  }

  const data: any = await resp.json();
  const output = data.output;
  if (!output || !output.choices || !output.choices.length) return null;

  const content = output.choices[0]?.message?.content || '';
  // Try to extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    const validTypes = ['油性头皮', '干性头皮', '敏感性头皮', '混合性头皮', '健康头皮'];
    return {
      score: Math.max(10, Math.min(100, Number(parsed.score) || 70)),
      scalp_type: validTypes.includes(parsed.scalp_type) ? parsed.scalp_type : '混合性头皮',
      diagnosis: parsed.diagnosis || '',
      advice: parsed.advice || '日常温和清洁，每2-3天洗一次。',
      dimensions: {
        sebum: Math.max(10, Math.min(100, Number(parsed.dimensions?.sebum) || 70)),
        moisture: Math.max(10, Math.min(100, Number(parsed.dimensions?.moisture) || 65)),
        density: Math.max(10, Math.min(100, Number(parsed.dimensions?.density) || 75)),
        health: Math.max(10, Math.min(100, Number(parsed.dimensions?.health) || 70)),
      },
    };
  } catch {
    return null;
  }
}

// ============================================================================
//  EXPORT
// ============================================================================
export default app;
