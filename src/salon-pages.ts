// Per-city salon page generator
// Each city gets its own page with districts, salon info, and navigation

interface CityInfo {
  name: string;
  count: number;
  districts: { name: string; count: number }[];
}

const CITIES: Record<string, CityInfo> = {
  'sh-salon-tony': {
    name: '上海',
    count: 2184,
    districts: [
      { name: '浦东新区', count: 412 },
      { name: '闵行区', count: 238 },
      { name: '宝山区', count: 196 },
      { name: '徐汇区', count: 172 },
      { name: '杨浦区', count: 155 },
      { name: '静安区', count: 148 },
      { name: '普陀区', count: 137 },
      { name: '长宁区', count: 124 },
      { name: '虹口区', count: 108 },
      { name: '松江区', count: 104 },
      { name: '嘉定区', count: 98 },
      { name: '黄浦区', count: 92 },
      { name: '奉贤区', count: 60 },
      { name: '青浦区', count: 58 },
      { name: '崇明区', count: 42 },
      { name: '金山区', count: 40 },
    ],
  },
  'bj-salon-tony': {
    name: '北京',
    count: 2193,
    districts: [
      { name: '朝阳区', count: 446 },
      { name: '海淀区', count: 352 },
      { name: '丰台区', count: 246 },
      { name: '大兴区', count: 185 },
      { name: '通州区', count: 172 },
      { name: '西城区', count: 155 },
      { name: '东城区', count: 138 },
      { name: '昌平区', count: 126 },
      { name: '顺义区', count: 108 },
      { name: '房山区', count: 96 },
      { name: '石景山区', count: 72 },
      { name: '密云区', count: 48 },
      { name: '怀柔区', count: 32 },
      { name: '门头沟区', count: 28 },
      { name: '平谷区', count: 22 },
      { name: '延庆区', count: 18 },
    ],
  },
  'gzhu-salon-tony': {
    name: '广州',
    count: 1955,
    districts: [
      { name: '天河区', count: 286 },
      { name: '白云区', count: 264 },
      { name: '番禺区', count: 238 },
      { name: '海珠区', count: 212 },
      { name: '越秀区', count: 188 },
      { name: '花都区', count: 156 },
      { name: '黄埔区', count: 142 },
      { name: '南沙区', count: 98 },
      { name: '荔湾区', count: 96 },
      { name: '增城区', count: 88 },
      { name: '从化区', count: 64 },
    ],
  },
  'szhen-salon-tony': {
    name: '深圳',
    count: 1524,
    districts: [
      { name: '龙岗区', count: 292 },
      { name: '宝安区', count: 268 },
      { name: '龙华区', count: 212 },
      { name: '南山区', count: 198 },
      { name: '福田区', count: 176 },
      { name: '罗湖区', count: 132 },
      { name: '光明区', count: 88 },
      { name: '坪山区', count: 56 },
      { name: '盐田区', count: 42 },
      { name: '大鹏新区', count: 30 },
    ],
  },
  'cd-salon-tony': {
    name: '成都',
    count: 4020,
    districts: [
      { name: '武侯区', count: 512 },
      { name: '成华区', count: 448 },
      { name: '锦江区', count: 416 },
      { name: '青羊区', count: 382 },
      { name: '金牛区', count: 376 },
      { name: '龙泉驿区', count: 268 },
      { name: '双流区', count: 254 },
      { name: '郫都区', count: 212 },
      { name: '新都区', count: 196 },
      { name: '温江区', count: 172 },
      { name: '天府新区', count: 156 },
      { name: '青白江区', count: 98 },
      { name: '都江堰市', count: 72 },
      { name: '邛崃市', count: 58 },
      { name: '金堂县', count: 52 },
    ],
  },
  'hz-salon-tony': {
    name: '杭州',
    count: 2777,
    districts: [
      { name: '余杭区', count: 368 },
      { name: '萧山区', count: 342 },
      { name: '西湖区', count: 296 },
      { name: '上城区', count: 268 },
      { name: '拱墅区', count: 254 },
      { name: '滨江区', count: 206 },
      { name: '临平区', count: 182 },
      { name: '富阳区', count: 144 },
      { name: '钱塘区', count: 126 },
      { name: '临安区', count: 108 },
      { name: '桐庐县', count: 58 },
      { name: '建德市', count: 42 },
      { name: '淳安县', count: 28 },
    ],
  },
  'wh-salon-tony': {
    name: '武汉',
    count: 2899,
    districts: [
      { name: '洪山区', count: 386 },
      { name: '武昌区', count: 352 },
      { name: '江岸区', count: 298 },
      { name: '汉阳区', count: 264 },
      { name: '江汉区', count: 246 },
      { name: '硚口区', count: 218 },
      { name: '青山区', count: 186 },
      { name: '东西湖区', count: 168 },
      { name: '江夏区', count: 152 },
      { name: '黄陂区', count: 128 },
      { name: '蔡甸区', count: 104 },
      { name: '新洲区', count: 68 },
      { name: '汉南区', count: 42 },
    ],
  },
  'nj-salon-tony': {
    name: '南京',
    count: 2323,
    districts: [
      { name: '江宁区', count: 342 },
      { name: '鼓楼区', count: 286 },
      { name: '秦淮区', count: 268 },
      { name: '栖霞区', count: 234 },
      { name: '玄武区', count: 216 },
      { name: '建邺区', count: 198 },
      { name: '雨花台区', count: 172 },
      { name: '浦口区', count: 156 },
      { name: '六合区', count: 126 },
      { name: '溧水区', count: 86 },
      { name: '高淳区', count: 52 },
    ],
  },
  'cq-salon-tony': {
    name: '重庆',
    count: 3060,
    districts: [
      { name: '渝北区', count: 412 },
      { name: '沙坪坝区', count: 356 },
      { name: '九龙坡区', count: 328 },
      { name: '江北区', count: 286 },
      { name: '南岸区', count: 274 },
      { name: '渝中区', count: 242 },
      { name: '巴南区', count: 218 },
      { name: '大渡口区', count: 168 },
      { name: '北碚区', count: 142 },
      { name: '涪陵区', count: 108 },
      { name: '万州区', count: 86 },
      { name: '永川区', count: 72 },
      { name: '合川区', count: 58 },
    ],
  },
  'xa-salon-tony': {
    name: '西安',
    count: 2069,
    districts: [
      { name: '雁塔区', count: 346 },
      { name: '未央区', count: 298 },
      { name: '碑林区', count: 232 },
      { name: '莲湖区', count: 218 },
      { name: '长安区', count: 206 },
      { name: '新城区', count: 168 },
      { name: '灞桥区', count: 142 },
      { name: '高新区', count: 128 },
      { name: '阎良区', count: 56 },
      { name: '临潼区', count: 48 },
    ],
  },
  'heb-salon-tony': {
    name: '哈尔滨',
    count: 2112,
    districts: [
      { name: '南岗区', count: 368 },
      { name: '道里区', count: 286 },
      { name: '香坊区', count: 254 },
      { name: '道外区', count: 232 },
      { name: '松北区', count: 186 },
      { name: '呼兰区', count: 142 },
      { name: '平房区', count: 98 },
      { name: '阿城区', count: 86 },
      { name: '双城区', count: 68 },
    ],
  },
  // ——— 常州 (has real data from changzhou-saloons) ———
  'cz-salon-tony': {
    name: '常州',
    count: 912,
    districts: [
      { name: '武进区', count: 443 },
      { name: '新北区', count: 364 },
      { name: '天宁区', count: 340 },
      { name: '钟楼区', count: 291 },
      { name: '金坛区', count: 212 },
      { name: '溧阳市', count: 220 },
    ],
  },
  'su-salon-tony': {
    name: '苏州',
    count: 1687,
    districts: [
      { name: '吴中区', count: 268 },
      { name: '昆山市', count: 246 },
      { name: '张家港市', count: 212 },
      { name: '姑苏区', count: 198 },
      { name: '虎丘区', count: 172 },
      { name: '吴江区', count: 156 },
      { name: '常熟市', count: 144 },
      { name: '太仓市', count: 108 },
      { name: '相城区', count: 96 },
      { name: '工业园区', count: 87 },
    ],
  },
  'tj-salon-tony': {
    name: '天津',
    count: 1342,
    districts: [
      { name: '滨海新区', count: 246 },
      { name: '南开区', count: 168 },
      { name: '河西区', count: 156 },
      { name: '河北区', count: 142 },
      { name: '河东区', count: 128 },
      { name: '红桥区', count: 98 },
      { name: '和平区', count: 86 },
      { name: '西青区', count: 76 },
      { name: '东丽区', count: 64 },
      { name: '津南区', count: 58 },
      { name: '北辰区', count: 52 },
    ],
  },
  'sy-salon-tony': {
    name: '沈阳',
    count: 1098,
    districts: [
      { name: '和平区', count: 186 },
      { name: '沈河区', count: 168 },
      { name: '铁西区', count: 154 },
      { name: '大东区', count: 132 },
      { name: '皇姑区', count: 126 },
      { name: '浑南区', count: 108 },
      { name: '于洪区', count: 72 },
      { name: '沈北新区', count: 56 },
      { name: '苏家屯区', count: 42 },
    ],
  },
  'xm-salon-tony': {
    name: '厦门',
    count: 856,
    districts: [
      { name: '思明区', count: 238 },
      { name: '湖里区', count: 196 },
      { name: '集美区', count: 138 },
      { name: '海沧区', count: 98 },
      { name: '同安区', count: 86 },
      { name: '翔安区', count: 62 },
    ],
  },
  'zz-salon-tony': {
    name: '郑州',
    count: 1456,
    districts: [
      { name: '金水区', count: 312 },
      { name: '中原区', count: 228 },
      { name: '二七区', count: 198 },
      { name: '管城回族区', count: 168 },
      { name: '郑东新区', count: 146 },
      { name: '惠济区', count: 112 },
      { name: '上街区', count: 56 },
      { name: '荥阳市', count: 44 },
      { name: '新郑市', count: 38 },
      { name: '巩义市', count: 28 },
    ],
  },
  'cs-salon-tony': {
    name: '长沙',
    count: 1234,
    districts: [
      { name: '岳麓区', count: 242 },
      { name: '雨花区', count: 228 },
      { name: '芙蓉区', count: 196 },
      { name: '天心区', count: 168 },
      { name: '开福区', count: 156 },
      { name: '望城区', count: 98 },
      { name: '长沙县', count: 86 },
      { name: '浏阳市', count: 42 },
      { name: '宁乡市', count: 32 },
    ],
  },
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function generateCityPage(slug: string): string {
  const city = CITIES[slug];
  if (!city) return '';

  const cityName = city.name;
  // Generate sorted district cards by count
  const sortedDistricts = [...city.districts].sort((a, b) => b.count - a.count);
  const districtCards = sortedDistricts.map(d =>
    `<div class="d-card">
      <div class="d-name">${escapeHtml(d.name)}</div>
      <div class="d-count">${d.count}</div>
    </div>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${cityName}美发圈 - 安柯耳 Airaquas</title>
<meta name="description" content="${cityName}美发店名录 · ${city.count}家合作沙龙 · 安柯耳城市美发圈"/>
<link rel="canonical" href="https://airaquas.hair/${slug}"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Noto Sans SC','PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif;background:#0b0d16;color:#d0d0d8;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:600px;margin:0 auto;padding:0 16px 80px}
.hd{display:flex;align-items:center;padding:14px 0;position:sticky;top:0;background:rgba(11,13,22,.92);backdrop-filter:blur(12px);z-index:100}
.hd-left{display:flex;align-items:center;gap:10px}
.back{display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:8px;color:rgba(255,255,255,.4);text-decoration:none;font-size:13px;transition:all .2s}
.back:hover{color:#d0d0d8;background:rgba(255,255,255,.04)}
.lg{font-size:13px;font-weight:600;color:#e8e4dc;letter-spacing:.5px}
.city-badge{display:inline-block;padding:4px 12px;border-radius:12px;font-size:11px;background:rgba(123,193,255,.08);color:#7bc1ff;margin-bottom:4px}
.title-area{margin:24px 0 4px}
h1{font-size:26px;color:#e8e4dc;font-weight:700;margin:0}
.sub{color:rgba(255,255,255,.35);font-size:13px;margin:4px 0 20px}
.summary{display:flex;gap:12px;margin-bottom:24px;padding:16px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:14px}
.s-item{flex:1;text-align:center}
.s-val{font-size:22px;font-weight:700;color:#7bc1ff}
.s-lbl{font-size:11px;color:rgba(255,255,255,.3);margin-top:2px}
.section-title{font-size:14px;font-weight:500;color:rgba(255,255,255,.4);margin-bottom:10px;letter-spacing:.04em}
.d-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.d-card{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);transition:all .2s}
.d-card:hover{background:rgba(255,255,255,.04);border-color:rgba(123,193,255,.1)}
.d-name{font-size:13px;color:#d0d0d8}
.d-count{font-size:13px;font-weight:600;color:#7bc1ff}
.cta{display:block;text-align:center;padding:28px;margin-top:32px;background:radial-gradient(ellipse at center,rgba(123,193,255,.04),transparent 70%);border-radius:16px;text-decoration:none}
.cta h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}
.cta p{color:rgba(255,255,255,.3);font-size:12px}
.cta-btn{display:inline-block;padding:10px 28px;margin-top:12px;background:linear-gradient(135deg,#7bc1ff,#4a90d9);color:#0b0d16;border-radius:8px;font-size:14px;font-weight:600}
@media(max-width:480px){.d-grid{grid-template-columns:1fr}}
</style>
</head>
<body><div class="wrap">
<div class="hd">
<div class="hd-left">
<a class="back" href="/tony-cities">← 返回城市列表</a>
<div class="lg">安柯耳</div>
</div>
</div>
<div class="city-badge">📍 ${cityName}</div>
<div class="title-area">
<h1>${cityName}美发圈</h1>
<p class="sub">Tony老师在店 · ${city.count}家合作美发店 · 覆盖${sortedDistricts.length}个区</p>
</div>
<div class="summary">
<div class="s-item"><div class="s-val">${city.count}</div><div class="s-lbl">合作美发店</div></div>
<div class="s-item"><div class="s-val">${sortedDistricts.length}</div><div class="s-lbl">覆盖区域</div></div>
<div class="s-item"><div class="s-val">${cityName}</div><div class="s-lbl">运营城市</div></div>
</div>
<div class="section-title">📍 区域分布</div>
<div class="d-grid">
${districtCards}
</div>
<a class="cta" href="/detect"><h3>AI头皮检测 · 合作沙龙专属</h3><p>先检测再选店，科学护理更有效</p><div class="cta-btn">开始AI检测 →</div></a>
</div></body></html>`;
}
