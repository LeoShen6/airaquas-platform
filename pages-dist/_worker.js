// _worker.js — Cloudflare Pages catch-all Worker
// Handles /tony/* city salon pages; everything else served from static assets or fallback.

const CITIES = {
  'sh-salon-tony': { name: '上海', count: 2184, dist: [['浦东新区',412],['闵行区',238],['宝山区',196],['徐汇区',172],['杨浦区',155],['静安区',148],['普陀区',137],['长宁区',124],['虹口区',108],['松江区',104],['嘉定区',98],['黄浦区',92],['奉贤区',60],['青浦区',58],['崇明区',42],['金山区',40]] },
  'bj-salon-tony': { name: '北京', count: 2193, dist: [['朝阳区',446],['海淀区',352],['丰台区',246],['大兴区',185],['通州区',172],['西城区',155],['东城区',138],['昌平区',126],['顺义区',108],['房山区',96],['石景山区',72],['密云区',48],['怀柔区',32],['门头沟区',28],['平谷区',22],['延庆区',18]] },
  'gzhu-salon-tony': { name: '广州', count: 1955, dist: [['天河区',286],['白云区',264],['番禺区',238],['海珠区',212],['越秀区',188],['花都区',156],['黄埔区',142],['南沙区',98],['荔湾区',96],['增城区',88],['从化区',64]] },
  'szhen-salon-tony': { name: '深圳', count: 1524, dist: [['龙岗区',292],['宝安区',268],['龙华区',212],['南山区',198],['福田区',176],['罗湖区',132],['光明区',88],['坪山区',56],['盐田区',42],['大鹏新区',30]] },
  'cd-salon-tony': { name: '成都', count: 4020, dist: [['武侯区',512],['成华区',448],['锦江区',416],['青羊区',382],['金牛区',376],['龙泉驿区',268],['双流区',254],['郫都区',212],['新都区',196],['温江区',172],['天府新区',156],['青白江区',98],['都江堰市',72],['邛崃市',58],['金堂县',52]] },
  'hz-salon-tony': { name: '杭州', count: 2777, dist: [['余杭区',368],['萧山区',342],['西湖区',296],['上城区',268],['拱墅区',254],['滨江区',206],['临平区',182],['富阳区',144],['钱塘区',126],['临安区',108],['桐庐县',58],['建德市',42],['淳安县',28]] },
  'wh-salon-tony': { name: '武汉', count: 2899, dist: [['洪山区',386],['武昌区',352],['江岸区',298],['汉阳区',264],['江汉区',246],['硚口区',218],['青山区',186],['东西湖区',168],['江夏区',152],['黄陂区',128],['蔡甸区',104],['新洲区',68],['汉南区',42]] },
  'nj-salon-tony': { name: '南京', count: 2323, dist: [['江宁区',342],['鼓楼区',286],['秦淮区',268],['栖霞区',234],['玄武区',216],['建邺区',198],['雨花台区',172],['浦口区',156],['六合区',126],['溧水区',86],['高淳区',52]] },
  'cq-salon-tony': { name: '重庆', count: 3060, dist: [['渝北区',412],['沙坪坝区',356],['九龙坡区',328],['江北区',286],['南岸区',274],['渝中区',242],['巴南区',218],['大渡口区',168],['北碚区',142],['涪陵区',108],['万州区',86],['永川区',72],['合川区',58]] },
  'xa-salon-tony': { name: '西安', count: 2069, dist: [['雁塔区',346],['未央区',298],['碑林区',232],['莲湖区',218],['长安区',206],['新城区',168],['灞桥区',142],['高新区',128],['阎良区',56],['临潼区',48]] },
  'heb-salon-tony': { name: '哈尔滨', count: 2112, dist: [['南岗区',368],['道里区',286],['香坊区',254],['道外区',232],['松北区',186],['呼兰区',142],['平房区',98],['阿城区',86],['双城区',68]] },
  'cz-salon-tony': { name: '常州', count: 912, dist: [['武进区',443],['新北区',364],['天宁区',340],['钟楼区',291],['金坛区',212],['溧阳市',220]] },
  'su-salon-tony': { name: '苏州', count: 1687, dist: [['吴中区',268],['昆山市',246],['张家港市',212],['姑苏区',198],['虎丘区',172],['吴江区',156],['常熟市',144],['太仓市',108],['相城区',96],['工业园区',87]] },
  'tj-salon-tony': { name: '天津', count: 1342, dist: [['滨海新区',246],['南开区',168],['河西区',156],['河北区',142],['河东区',128],['红桥区',98],['和平区',86],['西青区',76],['东丽区',64],['津南区',58],['北辰区',52]] },
  'sy-salon-tony': { name: '沈阳', count: 1098, dist: [['和平区',186],['沈河区',168],['铁西区',154],['大东区',132],['皇姑区',126],['浑南区',108],['于洪区',72],['沈北新区',56],['苏家屯区',42]] },
  'xm-salon-tony': { name: '厦门', count: 856, dist: [['思明区',238],['湖里区',196],['集美区',138],['海沧区',98],['同安区',86],['翔安区',62]] },
  'zz-salon-tony': { name: '郑州', count: 1456, dist: [['金水区',312],['中原区',228],['二七区',198],['管城回族区',168],['郑东新区',146],['惠济区',112],['上街区',56],['荥阳市',44],['新郑市',38],['巩义市',28]] },
  'cs-salon-tony': { name: '长沙', count: 1234, dist: [['岳麓区',242],['雨花区',228],['芙蓉区',196],['天心区',168],['开福区',156],['望城区',98],['长沙县',86],['浏阳市',42],['宁乡市',32]] },
};

function cityPage(slug) {
  const c = CITIES[slug];
  if (!c) return null;
  const sorted = [...c.dist].sort((a, b) => b[1] - a[1]);
  const cards = sorted.map(d => `<div class="dc"><div class="dn">${d[0]}</div><div class="dv">${d[1]}</div></div>`).join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${c.name}美发圈 - 安柯耳 Airaquas</title>
<meta name="description" content="${c.name}美发店名录 · ${c.count}家合作沙龙"/>
<link rel="canonical" href="https://airaquas.hair/tony/${slug}"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Noto Sans SC','PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif;background:#0b0d16;color:#d0d0d8;line-height:1.6;-webkit-font-smoothing:antialiased}
.w{max-width:600px;margin:0 auto;padding:0 16px 80px}
.hd{display:flex;align-items:center;padding:14px 0;position:sticky;top:0;background:rgba(11,13,22,.92);backdrop-filter:blur(12px);z-index:100;gap:10px}
.bk{padding:6px 12px;border-radius:8px;color:rgba(255,255,255,.4);text-decoration:none;font-size:13px}
.bk:hover{color:#d0d0d8;background:rgba(255,255,255,.04)}
.lg{font-size:13px;font-weight:600;color:#e8e4dc}
.cb{display:inline-block;padding:4px 12px;border-radius:12px;font-size:11px;background:rgba(123,193,255,.08);color:#7bc1ff;margin-bottom:4px}
h1{font-size:26px;color:#e8e4dc;font-weight:700;margin:24px 0 4px}
.st{color:rgba(255,255,255,.35);font-size:13px;margin:4px 0 20px}
.sm{display:flex;gap:12px;margin-bottom:24px;padding:16px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:14px}
.si{flex:1;text-align:center}
.sv{font-size:22px;font-weight:700;color:#7bc1ff}
.sl{font-size:11px;color:rgba(255,255,255,.3)}
.sc{font-size:14px;font-weight:500;color:rgba(255,255,255,.4);margin-bottom:10px}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dc{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04)}
.dc:hover{background:rgba(255,255,255,.04);border-color:rgba(123,193,255,.1)}
.dn{font-size:13px;color:#d0d0d8}
.dv{font-size:13px;font-weight:600;color:#7bc1ff}
.cta{display:block;text-align:center;padding:28px;margin-top:32px;background:radial-gradient(ellipse at center,rgba(123,193,255,.04),transparent 70%);border-radius:16px;text-decoration:none}
.cta h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}
.cta p{color:rgba(255,255,255,.3);font-size:12px}
.cta-btn{display:inline-block;padding:10px 28px;margin-top:12px;background:linear-gradient(135deg,#7bc1ff,#4a90d9);color:#0b0d16;border-radius:8px;font-size:14px;font-weight:600}
@media(max-width:480px){.dg{grid-template-columns:1fr}}
</style></head>
<body><div class="w"><div class="hd"><a class="bk" href="/tony-cities">← 返回</a><div class="lg">安柯耳</div></div>
<div class="cb">📍 ${c.name}</div>
<h1>${c.name}美发圈</h1>
<p class="st">Tony老师在店 · ${c.count}家合作美发店 · 覆盖${c.dist.length}个区</p>
<div class="sm"><div class="si"><div class="sv">${c.count}</div><div class="sl">合作美发店</div></div>
<div class="si"><div class="sv">${c.dist.length}</div><div class="sl">覆盖区域</div></div>
<div class="si"><div class="sv">${c.name}</div><div class="sl">运营城市</div></div></div>
<div class="sc">📍 区域分布</div>
<div class="dg">${cards}</div>
<a class="cta" href="/detect"><h3>AI头皮检测 · 合作沙龙专属</h3><p>先检测再选店，科学护理更有效</p><div class="cta-btn">开始AI检测 →</div></a>
</div></body></html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // City salon pages: /tony/xxx-salon-tony
    const tonyMatch = path.match(/^\/tony\/([^/]+)$/);
    if (tonyMatch && tonyMatch[1].endsWith('-salon-tony')) {
      const page = cityPage(tonyMatch[1]);
      if (page) return new Response(page, {
        headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'public,max-age=3600' }
      });
    }

    // Serve static assets from Pages (index.html, data.json, etc.)
    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    } catch (_) {}

    // API routes: don't serve SPA fallback — let them 404
    if (path.startsWith('/api/')) {
      return new Response(JSON.stringify({ code: 404, message: 'API endpoint not served by Pages' }), {
        status: 404,
        headers: { 'content-type': 'application/json' }
      });
    }

    // SPA fallback: serve index.html for unrecognized paths
    return env.ASSETS.fetch(new URL('/', url).toString());
  }
};
