/**
 * airaquas.hair — AI 头皮检测页（时尚海报风格）
 */

import { htmlShell } from './design-system';

export function generateDetectPage(): string {
  return htmlShell('AI 头皮四型五维自测 · 安柯耳 Airaquas', '安柯耳(Airaquas)时尚媒介内容平台 — AI头皮四型五维自测，上传照片AI分析头皮健康分型，多维度评估出科学报告。免费检测。', '/detect', `
<style>
/* ===== Hero ===== */
.detect-hero{padding:120px 0 60px;text-align:center;position:relative}
.detect-hero::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:80%;max-width:400px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,169,110,0.15),transparent)}
.detect-hero h1{font-size:clamp(32px,5vw,56px);font-weight:700;line-height:1.05;letter-spacing:-0.03em;margin-bottom:12px}
.detect-hero h1 span{background:linear-gradient(135deg,#c8a96e,#dfbd7c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.detect-hero p{font-size:15px;color:rgba(255,255,255,0.4);max-width:500px;margin:0 auto 8px;line-height:1.7}
.detect-hero .badge-row{display:flex;justify-content:center;gap:8px;margin-top:16px;flex-wrap:wrap}
.detect-hero .badge{display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:100px;font-size:10px;background:rgba(200,169,110,0.08);color:#c8a96e}

/* ===== Upload zone ===== */
.uz-wrap{max-width:560px;margin:0 auto;padding:0 16px}
.uz{position:relative;border:1.5px dashed rgba(200,169,110,0.12);border-radius:24px;padding:60px 24px;text-align:center;cursor:pointer;
  transition:all 0.4s;background:radial-gradient(ellipse at center,rgba(200,169,110,0.02),transparent 70%);min-height:320px;
  display:flex;flex-direction:column;align-items:center;justify-content:center}
.uz:hover,.uz.dragover{border-color:rgba(200,169,110,0.3);background:radial-gradient(ellipse at center,rgba(200,169,110,0.04),transparent 70%);transform:scale(1.01)}
.uz.has-image{border-style:solid;border-color:rgba(200,169,110,0.08);padding:16px;cursor:default}
.uz-icon{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,rgba(200,169,110,0.08),rgba(200,169,110,0.03));
  display:flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:20px;transition:all 0.3s}
.uz:hover .uz-icon{background:linear-gradient(135deg,rgba(200,169,110,0.12),rgba(200,169,110,0.05));transform:scale(1.05)}
.uz-title{font-size:18px;font-weight:600;color:#e8e4dc;margin-bottom:6px}
.uz-hint{font-size:13px;color:rgba(255,255,255,0.35);line-height:1.6;max-width:350px}
.uz input[type=file]{display:none}
.uz-preview{width:100%;max-width:400px;margin:0 auto;position:relative}
.uz-preview img{width:100%;border-radius:16px;border:1px solid rgba(255,255,255,0.06)}
.uz-reset{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);
  border:none;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s}
.uz-reset:hover{background:rgba(200,169,110,0.3)}

/* ===== Camera toggle ===== */
.camera-toggle{margin-top:16px;display:flex;gap:8px;justify-content:center}
.camera-toggle button{padding:8px 16px;border-radius:8px;font-size:11px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);color:rgba(255,255,255,0.45);cursor:pointer;transition:all 0.2s;font-family:inherit}
.camera-toggle button:hover{background:rgba(255,255,255,0.05)}
.camera-toggle button.active{background:rgba(200,169,110,0.08);color:#c8a96e;border-color:rgba(200,169,110,0.15)}
#camera{display:none;width:100%;border-radius:20px;margin-top:16px;transform:scaleX(-1)}

/* ===== Report ===== */
#report{display:none;margin-top:32px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.04)}
.report-header{text-align:center;margin-bottom:28px}
.report-header .tag{display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:100px;font-size:10px;
  background:rgba(200,169,110,0.08);color:#c8a96e;margin-bottom:8px}
.report-header h2{font-size:24px;font-weight:600;color:#e8e4dc;margin-bottom:4px}
.report-header p{font-size:13px;color:rgba(255,255,255,0.35)}

/* ===== Results grid ===== */
.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:560px;margin:0 auto;padding:0 16px}
.result-card{position:relative;padding:20px;border-radius:16px;background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.05);transition:all 0.3s}
.result-card:hover{background:rgba(255,255,255,0.03);border-color:rgba(200,169,110,0.08)}
.result-card-label{font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.08em;margin-bottom:6px;font-weight:600;text-transform:uppercase}
.result-card-value{font-size:24px;font-weight:700;letter-spacing:-0.02em;margin-bottom:2px}
.result-card-desc{font-size:11px;color:rgba(255,255,255,0.25);line-height:1.5}
.result-card .score-bar{margin-top:8px;height:3px;border-radius:2px;background:rgba(255,255,255,0.04);overflow:hidden}
.result-card .score-fill{height:100%;border-radius:2px;transition:width 1.5s ease}
.score-good .score-fill{background:linear-gradient(90deg,#6b8f71,#8ab88a)}
.score-fair .score-fill{background:linear-gradient(90deg,#b8916b,#d4a97a)}
.score-poor .score-fill{background:linear-gradient(90deg,#c86464,#e08888)}
.result-card.score-good .result-card-value{color:#8ab88a}
.result-card.score-fair .result-card-value{color:#d4a97a}
.result-card.score-poor .result-card-value{color:#e08888}
.result-card.span-2{grid-column:span 2}

/* ===== Loading ===== */
.loading-overlay{display:none;position:fixed;inset:0;z-index:500;background:rgba(5,5,16,0.85);backdrop-filter:blur(20px);align-items:center;justify-content:center;flex-direction:column;gap:20px}
.loading-overlay.active{display:flex}
.loading-spinner{width:40px;height:40px;border:2px solid rgba(255,255,255,0.04);border-top-color:#c8a96e;border-radius:50%;animation:spin 0.8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-text{font-size:14px;color:rgba(255,255,255,0.4)}

/* ===== History ===== */
.history-section{margin-top:48px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.04)}
.history-section h3{font-size:16px;font-weight:600;color:#e8e4dc;margin-bottom:16px}
.history-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.history-card{padding:16px;border-radius:12px;background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.05);text-decoration:none;transition:all 0.2s}
.history-card:hover{background:rgba(255,255,255,0.03);border-color:rgba(200,169,110,0.1)}
.history-date{font-size:10px;color:rgba(255,255,255,0.25);margin-bottom:4px}
.history-score{font-size:18px;font-weight:700;margin-bottom:2px}

@media(max-width:768px){
  .detect-hero{padding:100px 0 40px}
  .result-grid{grid-template-columns:1fr}
  .result-card.span-2{grid-column:span 1}
  .history-grid{grid-template-columns:1fr}
  .uz{padding:40px 20px;min-height:260px}
}
</style>

<div class="loading-overlay" id="loadingOverlay">
<div class="loading-spinner"></div>
<div class="loading-text">AI 分析中 ...</div>
</div>

<section class="detect-hero">
<div class="container-narrow">
<div class="tag" style="display:inline-flex;margin-bottom:12px">免费 · 3 分钟出报告</div>
<h1><span>AI</span> 头皮四型五维检测</h1>
<p>上传发际线与头顶照片，AI 自动分析毛囊密度、油脂分泌、屏障状态。</p>
<div class="badge-row">
<span class="badge">🔬 四型分类</span>
<span class="badge">📊 五维评估</span>
<span class="badge">⚡ 3 分钟出报告</span>
</div>
</div>
</section>

<div class="uz-wrap">
<div class="uz" id="uploadZone" onclick="document.getElementById('fileInput').click()">
<div class="uz-icon" id="uzIcon">📸</div>
<div class="uz-title" id="uzTitle">上传头皮照片</div>
<div class="uz-hint" id="uzHint">请上传清晰的发际线和头顶照片<br>支持 JPG / PNG，建议在充足光线下拍摄</div>
<input type="file" id="fileInput" accept="image/*,.jpg,.jpeg,.png" onchange="handleFile(this.files[0])"/>
<div class="uz-preview" id="uzPreview" style="display:none"></div>
</div>

<div class="camera-toggle">
<button onclick="switchMode('upload')" id="modeUpload" class="active">📁 上传照片</button>
<button onclick="switchMode('camera')" id="modeCamera">📷 拍照</button>
</div>
<video id="camera" autoplay playsinline></video>

<div id="report">
<div class="report-header">
<span class="tag">检测报告</span>
<h2 id="reportType">--</h2>
<p id="reportSummary">AI 分析中</p>
</div>
<div class="result-grid" id="resultGrid"></div>
</div>

<div class="history-section" id="historySection" style="display:none">
<h3>📋 检测历史</h3>
<div class="history-grid" id="historyGrid"></div>
</div>
</div>

<script>
(function(){
const API = '/api';
var fileInput = document.getElementById('fileInput');
var uploadZone = document.getElementById('uploadZone');
var uzIcon = document.getElementById('uzIcon');
var uzTitle = document.getElementById('uzTitle');
var uzHint = document.getElementById('uzHint');
var uzPreview = document.getElementById('uzPreview');
var report = document.getElementById('report');
var resultGrid = document.getElementById('resultGrid');
var reportType = document.getElementById('reportType');
var reportSummary = document.getElementById('reportSummary');
var loading = document.getElementById('loadingOverlay');
var currentFile = null;
var video = document.getElementById('camera');
var stream = null;

// Drag & drop
uploadZone.addEventListener('dragover',function(e){e.preventDefault();uploadZone.classList.add('dragover')});
uploadZone.addEventListener('dragleave',function(){uploadZone.classList.remove('dragover')});
uploadZone.addEventListener('drop',function(e){e.preventDefault();uploadZone.classList.remove('dragover');
  var f=e.dataTransfer.files[0];if(f&&f.type.startsWith('image/'))handleFile(f)});

function handleFile(f){
  if(!f)return;
  currentFile=f;
  var url=URL.createObjectURL(f);
  uzPreview.style.display='block';
  uzPreview.innerHTML='<img src="'+url+'" alt="预览"><button class="uz-reset" onclick="resetUpload()">✕</button>';
  uploadZone.classList.add('has-image');
  uzTitle.textContent=f.name;
  uzHint.textContent=Math.round(f.size/1024)+' KB · 点击重新选择';
  analyzeImage(f);
}

function resetUpload(){
  currentFile=null;
  uzPreview.style.display='none';
  uzPreview.innerHTML='';
  uploadZone.classList.remove('has-image');
  uzTitle.textContent='上传头皮照片';
  uzHint.textContent='请上传清晰的发际线和头顶照片\\n支持 JPG / PNG，建议在充足光线下拍摄';
  report.style.display='none';
  fileInput.value='';
}

async function analyzeImage(file){
  loading.classList.add('active');
  try{
    var form=new FormData();
    form.append('image',file);
    var res=await fetch(API+'/detect',{method:'POST',body:form});
    var data=await res.json();
    if(data.code!==0)throw new Error(data.message||'分析失败');
    showReport(data.data);
    loadHistory();
  }catch(e){
    loading.classList.remove('active');
    uzHint.textContent='分析失败: '+e.message+'，请重试';
  }
}

function showReport(data){
  loading.classList.remove('active');
  report.style.display='block';
  var typeNames={seborrheic:'脂溢型',dry:'干燥型',sensitive:'敏感型',normal:'健康型'};
  reportType.textContent=(typeNames[data.scalp_type]||data.scalp_type)+'头皮';
  reportSummary.textContent=data.summary||'AI综合分析你的头皮状况，以下为各维度评分。';

  var dims=[
    {key:'oil',label:'油脂分泌',unit:'分',good:[81,100],fair:[51,80],poor:[0,50]},
    {key:'moisture',label:'水分含量',unit:'分',good:[81,100],fair:[51,80],poor:[0,50]},
    {key:'density',label:'毛囊密度',unit:'根/cm²',good:[181,300],fair:[121,180],poor:[0,120]},
    {key:'barrier',label:'屏障状态',unit:'分',good:[81,100],fair:[51,80],poor:[0,50]},
    {key:'follicle',label:'毛囊健康',unit:'分',good:[81,100],fair:[51,80],poor:[0,50]}
  ];

  resultGrid.innerHTML=dims.map(function(d){
    var v=parseFloat(data[d.key])||0;
    var cls=v>=(d.good[0])?'score-good':v>=(d.fair[0])?'score-fair':'score-poor';
    var pct=Math.min(100,v/(d.good[1]||100)*100);
    return '<div class="result-card '+cls+'"><div class="result-card-label">'+d.label+'</div><div class="result-card-value">'+v+'<span style="font-size:12px;font-weight:400;color:rgba(255,255,255,0.25)"> '+d.unit+'</span></div><div class="result-card-desc">'+(d.poor[0]<=v&&v<=d.poor[1]?'偏低':v<=d.fair[1]?'中等':'良好')+'</div><div class="score-bar"><div class="score-fill" style="width:'+pct+'%"></div></div></div>';
  }).join('');

  // Scroll to report
  setTimeout(function(){report.scrollIntoView({behavior:'smooth',block:'start'})},300);
}

async function loadHistory(){
  try{
    var res=await fetch(API+'/detect/history');
    var data=await res.json();
    if(data.code===0&&data.data&&data.data.length>0){
      var grid=document.getElementById('historyGrid');
      var sec=document.getElementById('historySection');
      sec.style.display='block';
      var typeNames={seborrheic:'脂溢型',dry:'干燥型',sensitive:'敏感型',normal:'健康型'};
      grid.innerHTML=data.data.slice(0,6).map(function(h){
        return '<a class="history-card" href="/api/detect/'+h.id+'"><div class="history-date">'+new Date(h.created_at).toLocaleDateString('zh-CN')+'</div><div class="history-score">'+(typeNames[h.scalp_type]||h.scalp_type||'--')+'</div><div style="font-size:11px;color:rgba(255,255,255,0.25);margin-top:2px">点击查看详情</div></a>';
      }).join('');
    }
  }catch(e){}
}

window.handleFile=handleFile;
window.resetUpload=resetUpload;

// Camera
window.switchMode=function(mode){
  document.querySelectorAll('.camera-toggle button').forEach(function(b){b.classList.remove('active')});
  if(mode==='camera'){
    document.getElementById('modeCamera').classList.add('active');
    video.style.display='block';
    uploadZone.style.display='none';
    navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}}).then(function(s){
      stream=s;video.srcObject=s;
    }).catch(function(e){alert('无法打开摄像头: '+e.message);switchMode('upload')});
  }else{
    document.getElementById('modeUpload').classList.add('active');
    video.style.display='none';
    uploadZone.style.display='flex';
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null;video.srcObject=null}
  }
};

// Load history on page load
document.addEventListener('DOMContentLoaded',loadHistory);
})();
</script>
`);
}
