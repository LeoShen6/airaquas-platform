/**
 * airaquas.hair — 分享海报（时尚海报风格）
 */

import { htmlShell } from './design-system';

export const POSTER_HTML = htmlShell('AI 头皮检测分享海报 · 安柯耳 Airaquas', '生成你的专属 AI 头皮检测海报，分享给好友。', '/poster', `
<style>
.poster-hero{padding:120px 0 60px;text-align:center;position:relative}
.poster-hero::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:80%;max-width:400px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,169,110,0.15),transparent)}
.poster-hero h1{font-size:clamp(32px,5vw,56px);font-weight:700;line-height:1.05;letter-spacing:-0.03em;margin-bottom:12px}
.poster-hero h1 span{background:linear-gradient(135deg,#c8a96e,#dfbd7c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.poster-hero p{font-size:15px;color:rgba(255,255,255,0.4);max-width:500px;margin:0 auto;line-height:1.7}

.poster-form{max-width:560px;margin:0 auto;padding:0 16px 40px}
.poster-form label{display:block;font-size:12px;color:rgba(255,255,255,0.45);margin-bottom:6px;font-weight:600;letter-spacing:0.05em}
.poster-form input,.poster-form select{width:100%;padding:14px 18px;border-radius:14px;background:rgba(255,255,255,0.02);
  border:1.5px solid rgba(255,255,255,0.06);color:#e8e4dc;font-size:14px;font-family:inherit;outline:none;transition:all 0.3s;margin-bottom:16px}
.poster-form input:focus,.poster-form select:focus{border-color:rgba(200,169,110,0.2);background:rgba(255,255,255,0.03)}
.poster-form select option{background:#050510;color:#e8e4dc}

.poster-submit{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.poster-preview{max-width:400px;margin:40px auto;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);display:none}
.poster-preview img{width:100%;display:block}
.poster-preview.active{display:block}

.poster-samples{display:flex;gap:12px;justify-content:center;margin-bottom:24px;flex-wrap:wrap}
.poster-sample{padding:8px 16px;border-radius:100px;font-size:12px;border:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.02);
  color:rgba(255,255,255,0.35);cursor:pointer;transition:all 0.2s;font-family:inherit}
.poster-sample:hover{background:rgba(200,169,110,0.06);color:#c8a96e;border-color:rgba(200,169,110,0.1)}

@media(max-width:768px){
  .poster-hero{padding:100px 0 40px}
}
</style>

<section class="poster-hero">
<div class="container-narrow">
<div class="tag" style="display:inline-flex;margin-bottom:12px">分享你的检测报告</div>
<h1>生成<span>分享海报</span></h1>
<p>输入你的基本信息，生成一张专属的 AI 头皮检测分享海报。</p>
</div>
</section>

<div class="poster-form">
<div class="poster-samples">
<button class="poster-sample" onclick="fillForm('张三','成都','健康型')">示例数据</button>
<button class="poster-sample" onclick="fillForm('','','')">清空</button>
</div>

<label>昵称</label>
<input type="text" id="posterName" placeholder="你的昵称" maxlength="20"/>

<label>城市</label>
<select id="posterCity">
<option value="">选择城市</option>
<option value="北京">北京</option>
<option value="上海">上海</option>
<option value="广州">广州</option>
<option value="深圳">深圳</option>
<option value="成都">成都</option>
<option value="杭州">杭州</option>
<option value="重庆">重庆</option>
<option value="武汉">武汉</option>
<option value="西安">西安</option>
<option value="南京">南京</option>
<option value="长沙">长沙</option>
<option value="郑州">郑州</option>
<option value="沈阳">沈阳</option>
<option value="天津">天津</option>
</select>

<label>头皮类型</label>
<select id="posterType">
<option value="">选择类型</option>
<option value="健康型">健康型 — 头皮状态良好</option>
<option value="脂溢型">脂溢型 — 油脂分泌旺盛</option>
<option value="干燥型">干燥型 — 头皮干燥缺水</option>
<option value="敏感型">敏感型 — 头皮容易敏感</option>
</select>

<div class="poster-submit">
<button class="btn btn-primary" onclick="generatePoster()">生成海报 →</button>
</div>
</div>

<div class="poster-preview" id="posterPreview"></div>

<script>
function fillForm(name,city,type){
  if(name)document.getElementById('posterName').value=name;
  if(city)document.getElementById('posterCity').value=city;
  if(type)document.getElementById('posterType').value=type;
}
async function generatePoster(){
  var name=document.getElementById('posterName').value.trim()||'匿名';
  var city=document.getElementById('posterCity').value;
  var type=document.getElementById('posterType').value;
  var previewEl=document.getElementById('posterPreview');
  previewEl.classList.remove('active');
  previewEl.innerHTML='<div class="guide-loading active"><div class="spinner"></div><p>生成海报中...</p></div>';
  try{
    var r=await fetch('/api/poster/generate',{method:'POST',body:JSON.stringify({name,city,scalpType:type}),headers:{'Content-Type':'application/json'}});
    var d=await r.json();
    if(d.code===0||d.imageUrl){
      previewEl.innerHTML='<img src="'+d.imageUrl+'" alt="分享海报"/><div style="margin-top:12px;display:flex;gap:8px;justify-content:center"><button class="btn btn-ghost btn-sm" onclick="window.open(\''+d.imageUrl+'\')">查看大图</button></div>';
      previewEl.classList.add('active');
      setTimeout(function(){previewEl.scrollIntoView({behavior:'smooth',block:'center'})},200);
    }else if(d.message){
      previewEl.innerHTML='<div style="padding:40px;text-align:center;color:rgba(255,255,255,0.35);font-size:14px">'+d.message+'</div>';
      previewEl.classList.add('active');
    }else{
      throw new Error('生成失败');
    }
  }catch(e){
    previewEl.innerHTML='<div style="padding:40px;text-align:center;color:rgba(255,255,255,0.35);font-size:14px">生成失败: '+e.message+'</div>';
    previewEl.classList.add('active');
  }
}
</script>
`);
