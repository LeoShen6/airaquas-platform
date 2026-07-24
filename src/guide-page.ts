/**
 * airaquas.hair — AI 护发指南（时尚海报风格）
 */

import { htmlShell } from './design-system';

export const GUIDE_HTML = htmlShell('AI 智能护发指南 · 安柯耳 Airaquas', '描述你的头发状况，AI 为你生成个性化护发方案。', '/guide', `
<style>
.guide-hero{padding:120px 0 60px;text-align:center;position:relative}
.guide-hero::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:80%;max-width:400px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,169,110,0.15),transparent)}
.guide-hero h1{font-size:clamp(32px,5vw,56px);font-weight:700;line-height:1.05;letter-spacing:-0.03em;margin-bottom:12px}
.guide-hero h1 span{background:linear-gradient(135deg,#c8a96e,#dfbd7c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.guide-hero p{font-size:15px;color:rgba(255,255,255,0.4);max-width:500px;margin:0 auto;line-height:1.7}

.guide-input-wrap{max-width:640px;margin:0 auto;padding:0 16px}
.guide-input{position:relative}
.guide-input textarea{width:100%;padding:20px 24px;border-radius:20px;background:rgba(255,255,255,0.02);border:1.5px solid rgba(255,255,255,0.06);
  color:#e8e4dc;font-size:15px;font-family:inherit;line-height:1.7;resize:vertical;min-height:140px;outline:none;transition:all 0.3s}
.guide-input textarea:focus{border-color:rgba(200,169,110,0.25);background:rgba(255,255,255,0.03)}
.guide-input textarea::placeholder{color:rgba(255,255,255,0.2)}
.guide-input .hint{font-size:12px;color:rgba(255,255,255,0.2);margin-top:8px;text-align:right}
.guide-submit{display:flex;justify-content:center;margin-top:16px}
.guide-examples{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:20px}
.guide-examples button{padding:8px 16px;border-radius:100px;font-size:12px;border:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.02);
  color:rgba(255,255,255,0.35);cursor:pointer;transition:all 0.2s;font-family:inherit}
.guide-examples button:hover{background:rgba(200,169,110,0.06);color:#c8a96e;border-color:rgba(200,169,110,0.1)}

#guideResult{display:none;margin-top:40px;padding:0 16px}
.guide-card{max-width:640px;margin:0 auto;padding:32px;border-radius:20px;background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.05);
  line-height:1.9;font-size:14px;color:rgba(255,255,255,0.75);white-space:pre-wrap}
.guide-card strong{color:#e8e4dc;font-weight:600}
.guide-card .gold-text{color:#c8a96e;font-weight:600;font-size:15px}

.guide-loading{display:none;text-align:center;padding:40px}
.guide-loading.active{display:block}
.guide-loading .spinner{width:32px;height:32px;border:2px solid rgba(255,255,255,0.04);border-top-color:#c8a96e;border-radius:50%;animation:guideSpin 0.8s linear infinite;margin:0 auto 12px}
@keyframes guideSpin{to{transform:rotate(360deg)}}
.guide-loading p{font-size:13px;color:rgba(255,255,255,0.3)}

@media(max-width:768px){
  .guide-hero{padding:100px 0 40px}
  .guide-card{padding:24px}
}
</style>

<section class="guide-hero">
<div class="container-narrow">
<div class="tag" style="display:inline-flex;margin-bottom:12px">AI 智能生成</div>
<h1>智能<span>护发指南</span></h1>
<p>描述你的头发或头皮状况，AI 为你生成个性化的护发方案。</p>
</div>
</section>

<div class="guide-input-wrap">
<div class="guide-examples">
<button onclick="fillPrompt('最近掉发很多，洗头时一抓一把，发际线好像也在后退。头皮有点油。')">掉发增多</button>
<button onclick="fillPrompt('头皮经常痒，有白色头皮屑，洗完头第二天就油了。')">头皮痒+头屑</button>
<button onclick="fillPrompt('头发很干枯，分叉多，没有光泽。头皮也比较干。')">头发干枯</button>
<button onclick="fillPrompt('发缝越来越宽，头顶头发明显变少了，家族有脱发史。')">发缝变宽</button>
</div>

<div class="guide-input">
<textarea id="promptInput" placeholder="描述你的头发/头皮状况&#10;&#10;例如：最近洗头掉发很多，发际线有点后退，头皮容易出油..."></textarea>
<div class="hint"><span id="charCount">0</span>/500</div>
</div>

<div class="guide-submit">
<button class="btn btn-primary" onclick="generateGuide()">生成护发指南 →</button>
</div>

<div class="guide-loading" id="guideLoading">
<div class="spinner"></div>
<p>AI 正在分析你的状况，生成个性化方案...</p>
</div>
</div>

<div id="guideResult">
<div class="guide-card" id="guideContent"></div>
</div>

<script>
function fillPrompt(text){
  document.getElementById('promptInput').value=text;
  document.getElementById('charCount').textContent=text.length;
  document.getElementById('promptInput').focus();
}
document.getElementById('promptInput').addEventListener('input',function(){
  var l=this.value.length;
  document.getElementById('charCount').textContent=l;
  if(l>500)this.value=this.value.slice(0,500);
});

async function generateGuide(){
  var prompt=document.getElementById('promptInput').value.trim();
  if(!prompt){alert('请描述你的头发状况');return}
  var loadEl=document.getElementById('guideLoading');
  var resEl=document.getElementById('guideResult');
  var conEl=document.getElementById('guideContent');
  loadEl.classList.add('active');
  resEl.style.display='none';
  try{
    var r=await fetch('/api/guide/generate',{method:'POST',body:JSON.stringify({prompt}),headers:{'Content-Type':'application/json'}});
    var d=await r.json();
    if(d.code===0||d.message){
      conEl.textContent=d.message||d.data||'暂无结果';
      resEl.style.display='block';
    }else{throw new Error(d.message||'生成失败')}
  }catch(e){conEl.textContent='生成失败: '+e.message+'. 请稍后重试。';resEl.style.display='block'}
  finally{loadEl.classList.remove('active')}
  setTimeout(function(){resEl.scrollIntoView({behavior:'smooth',block:'start'})},200);
}
</script>
`);
