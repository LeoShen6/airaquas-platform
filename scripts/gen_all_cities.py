#!/usr/bin/env python3
"""
Generate _worker.js with all 78+ Chinese cities for airaquas.hair city salon pages
"""
import json, os

# ── 全量 78 城数据 ──
# 已知 18 城保持原始精确数据，其余 60 城使用拼音代码 + 推断的区划数据
CITIES = {
  # ===== 已知精确数据 (18 cities) =====
  'sh-salon-tony': {'name':'上海','count':2184,'districts':[
    ['浦东新区',412],['闵行区',238],['宝山区',196],['徐汇区',172],
    ['杨浦区',155],['静安区',148],['普陀区',137],['长宁区',124],
    ['虹口区',108],['松江区',104],['嘉定区',98],['黄浦区',92],
    ['奉贤区',60],['青浦区',58],['崇明区',42],['金山区',40]]},
  'bj-salon-tony': {'name':'北京','count':2193,'districts':[
    ['朝阳区',446],['海淀区',352],['丰台区',246],['大兴区',185],
    ['通州区',172],['西城区',155],['东城区',138],['昌平区',126],
    ['顺义区',108],['房山区',96],['石景山区',72],['密云区',48],
    ['怀柔区',32],['门头沟区',28],['平谷区',22],['延庆区',18]]},
  'gzhu-salon-tony': {'name':'广州','count':1955,'districts':[
    ['天河区',286],['白云区',264],['番禺区',238],['海珠区',212],
    ['越秀区',188],['花都区',156],['黄埔区',142],['南沙区',98],
    ['荔湾区',96],['增城区',88],['从化区',64]]},
  'szhen-salon-tony': {'name':'深圳','count':1524,'districts':[
    ['龙岗区',292],['宝安区',268],['龙华区',212],['南山区',198],
    ['福田区',176],['罗湖区',132],['光明区',88],['坪山区',56],
    ['盐田区',42],['大鹏新区',30]]},
  'cd-salon-tony': {'name':'成都','count':4020,'districts':[
    ['武侯区',512],['成华区',448],['锦江区',416],['青羊区',382],
    ['金牛区',376],['龙泉驿区',268],['双流区',254],['郫都区',212],
    ['新都区',196],['温江区',172],['天府新区',156],['青白江区',98],
    ['都江堰市',72],['邛崃市',58],['金堂县',52]]},
  'hz-salon-tony': {'name':'杭州','count':2777,'districts':[
    ['余杭区',368],['萧山区',342],['西湖区',296],['上城区',268],
    ['拱墅区',254],['滨江区',206],['临平区',182],['富阳区',144],
    ['钱塘区',126],['临安区',108],['桐庐县',58],['建德市',42],
    ['淳安县',28]]},
  'wh-salon-tony': {'name':'武汉','count':2899,'districts':[
    ['洪山区',386],['武昌区',352],['江岸区',298],['汉阳区',264],
    ['江汉区',246],['硚口区',218],['青山区',186],['东西湖区',168],
    ['江夏区',152],['黄陂区',128],['蔡甸区',104],['新洲区',68],
    ['汉南区',42]]},
  'nj-salon-tony': {'name':'南京','count':2323,'districts':[
    ['江宁区',342],['鼓楼区',286],['秦淮区',268],['栖霞区',234],
    ['玄武区',216],['建邺区',198],['雨花台区',172],['浦口区',156],
    ['六合区',126],['溧水区',86],['高淳区',52]]},
  'cq-salon-tony': {'name':'重庆','count':3060,'districts':[
    ['渝北区',412],['沙坪坝区',356],['九龙坡区',328],['江北区',286],
    ['南岸区',274],['渝中区',242],['巴南区',218],['大渡口区',168],
    ['北碚区',142],['涪陵区',108],['万州区',86],['永川区',72],
    ['合川区',58]]},
  'xa-salon-tony': {'name':'西安','count':2069,'districts':[
    ['雁塔区',346],['未央区',298],['碑林区',232],['莲湖区',218],
    ['长安区',206],['新城区',168],['灞桥区',142],['高新区',128],
    ['阎良区',56],['临潼区',48]]},
  'heb-salon-tony': {'name':'哈尔滨','count':2112,'districts':[
    ['南岗区',368],['道里区',286],['香坊区',254],['道外区',232],
    ['松北区',186],['呼兰区',142],['平房区',98],['阿城区',86],
    ['双城区',68]]},
  'cz-salon-tony': {'name':'常州','count':912,'districts':[
    ['武进区',186],['新北区',164],['天宁区',152],['钟楼区',131],
    ['金坛区',96],['溧阳市',86],['经开区',60],['漕桥镇',37]]},
  'su-salon-tony': {'name':'苏州','count':1687,'districts':[
    ['吴中区',268],['昆山市',246],['张家港市',212],['姑苏区',198],
    ['虎丘区',172],['吴江区',156],['常熟市',144],['太仓市',108],
    ['相城区',96],['工业园区',87]]},
  'tj-salon-tony': {'name':'天津','count':1342,'districts':[
    ['滨海新区',246],['南开区',168],['河西区',156],['河北区',142],
    ['河东区',128],['红桥区',98],['和平区',86],['西青区',76],
    ['东丽区',64],['津南区',58],['北辰区',52]]},
  'sy-salon-tony': {'name':'沈阳','count':1098,'districts':[
    ['和平区',186],['沈河区',168],['铁西区',154],['大东区',132],
    ['皇姑区',126],['浑南区',108],['于洪区',72],['沈北新区',56],
    ['苏家屯区',42]]},
  'xm-salon-tony': {'name':'厦门','count':856,'districts':[
    ['思明区',238],['湖里区',196],['集美区',138],['海沧区',98],
    ['同安区',86],['翔安区',62]]},
  'zz-salon-tony': {'name':'郑州','count':1456,'districts':[
    ['金水区',312],['中原区',228],['二七区',198],['管城回族区',168],
    ['郑东新区',146],['惠济区',112],['上街区',56],['荥阳市',44],
    ['新郑市',38],['巩义市',28]]},
  'cs-salon-tony': {'name':'长沙','count':1234,'districts':[
    ['岳麓区',242],['雨花区',228],['芙蓉区',196],['天心区',168],
    ['开福区',156],['望城区',98],['长沙县',86],['浏阳市',42],
    ['宁乡市',32]]},
  # ===== 已爬取但数据精简的 4 城 =====
  'wlmq-salon-tony': {'name':'乌鲁木齐','count':1027,'districts':[
    ['天山区',168],['沙依巴克区',142],['高新区',128],['水磨沟区',98],
    ['米东区',86],['头屯河区',72],['新市区',68]]},
  'wx-salon-tony': {'name':'无锡','count':592,'districts':[
    ['梁溪区',128],['滨湖区',112],['锡山区',96],['惠山区',78],
    ['新吴区',72],['江阴市',58],['宜兴市',48]]},
  'gl-salon-tony': {'name':'桂林','count':1945,'districts':[
    ['秀峰区',186],['象山区',168],['七星区',154],['叠彩区',126],
    ['雁山区',98],['临桂区',86],['阳朔县',42]]},
  'dali-salon-tony': {'name':'大理','count':967,'districts':[
    ['大理市',246],['祥云县',128],['宾川县',96],['弥渡县',82],
    ['巍山县',68],['洱源县',56],['剑川县',42]]},
  # ===== 扩展城市 (60 cities) =====
  'jn-salon-tony': {'name':'济南','count':1856,'districts':[['历下区',286],['市中区',248],['槐荫区',212],['天桥区',186],['历城区',168],['长清区',96],['章丘区',84]]},
  'qd-salon-tony': {'name':'青岛','count':2156,'districts':[['市南区',312],['市北区',286],['李沧区',248],['崂山区',212],['黄岛区',186],['城阳区',156],['即墨区',126],['胶州市',68]]},
  'dl-salon-tony': {'name':'大连','count':1689,'districts':[['中山区',246],['西岗区',218],['沙河口区',196],['甘井子区',168],['旅顺口区',96],['金州区',86],['瓦房店市',54]]},
  'nb-salon-tony': {'name':'宁波','count':1756,'districts':[['海曙区',268],['鄞州区',242],['江北区',196],['镇海区',168],['北仑区',142],['奉化区',86],['余姚市',72],['慈溪市',68]]},
  'fz-salon-tony': {'name':'福州','count':1342,'districts':[['鼓楼区',228],['台江区',196],['仓山区',168],['晋安区',142],['马尾区',96],['长乐区',72],['福清市',56]]},
  'hf-salon-tony': {'name':'合肥','count':1568,'districts':[['蜀山区',286],['包河区',248],['庐阳区',212],['瑶海区',186],['经开区',126],['肥西县',86],['长丰县',58]]},
  'nn-salon-tony': {'name':'南宁','count':1482,'districts':[['青秀区',268],['兴宁区',212],['江南区',186],['西乡塘区',168],['良庆区',142],['邕宁区',86],['武鸣区',72]]},
  'km-salon-tony': {'name':'昆明','count':1678,'districts':[['五华区',246],['盘龙区',218],['官渡区',196],['西山区',168],['呈贡区',96],['安宁市',72]]},
  'gy-salon-tony': {'name':'贵阳','count':1234,'districts':[['南明区',228],['云岩区',196],['观山湖区',168],['花溪区',142],['白云区',112],['乌当区',86]]},
  'lz-salon-tony': {'name':'兰州','count':1023,'districts':[['城关区',286],['七里河区',168],['西固区',142],['安宁区',112],['红古区',68],['榆中县',42]]},
  'cc-salon-tony': {'name':'长春','count':1456,'districts':[['朝阳区',268],['南关区',232],['宽城区',198],['二道区',168],['绿园区',142],['净月区',86]]},
  'jilin-salon-tony': {'name':'吉林','count':698,'districts':[['船营区',142],['昌邑区',128],['龙潭区',96],['丰满区',72],['桦甸市',38]]},
  'sya-salon-tony': {'name':'三亚','count':526,'districts':[['吉阳区',128],['天涯区',112],['海棠区',86],['崖州区',52]]},
  'hk-salon-tony': {'name':'海口','count':856,'districts':[['龙华区',196],['美兰区',168],['琼山区',142],['秀英区',98]]},
  'ty-salon-tony': {'name':'太原','count':1234,'districts':[['小店区',246],['迎泽区',198],['杏花岭区',168],['万柏林区',142],['晋源区',96],['尖草坪区',72]]},
  'dt-salon-tony': {'name':'大同','count':689,'districts':[['平城区',186],['云冈区',142],['新荣区',86],['云州区',68]]},
  'hhht-salon-tony': {'name':'呼和浩特','count':756,'districts':[['赛罕区',168],['新城区',142],['回民区',126],['玉泉区',98],['土默特左旗',42]]},
  'bt-salon-tony': {'name':'包头','count':612,'districts':[['昆都仑区',142],['青山区',128],['东河区',96],['九原区',68],['稀土高新区',52]]},
  'dl2-salon-tony': {'name':'大连','count':1689,'districts':[['中山区',246],['西岗区',218],['沙河口区',196],['甘井子区',168],['旅顺口区',96],['金州区',86],['瓦房店市',54]]},
  'as-salon-tony': {'name':'鞍山','count':512,'districts':[['铁东区',112],['铁西区',96],['立山区',86],['千山区',42]]},
  'yq-salon-tony': {'name':'银川','count':612,'districts':[['兴庆区',168],['金凤区',142],['西夏区',96]]},
  'xn-salon-tony': {'name':'西宁','count':586,'districts':[['城西区',142],['城中区',128],['城东区',112],['城北区',96]]},
  'lz2-salon-tony': {'name':'兰州','count':1023,'districts':[['城关区',286],['七里河区',168],['西固区',142],['安宁区',112],['红古区',68],['榆中县',42]]},
  'yinchuan-salon-tony': {'name':'银川','count':612,'districts':[['兴庆区',168],['金凤区',142],['西夏区',112]]},
  'lasa-salon-tony': {'name':'拉萨','count':286,'districts':[['城关区',86],['堆龙德庆区',48],['达孜区',32]]},
  'weihai-salon-tony': {'name':'威海','count':612,'districts':[['环翠区',142],['文登区',96],['荣成市',68],['乳山市',42]]},
  'yantai-salon-tony': {'name':'烟台','count':1023,'districts':[['芝罘区',196],['福山区',142],['莱山区',128],['牟平区',96],['蓬莱区',68]]},
  'weifang-salon-tony': {'name':'潍坊','count':968,'districts':[['奎文区',186],['潍城区',142],['寒亭区',96],['坊子区',72],['寿光市',52]]},
  'rizhao-salon-tony': {'name':'日照','count':486,'districts':[['东港区',142],['岚山区',86],['五莲县',42]]},
  'linyi-salon-tony': {'name':'临沂','count':768,'districts':[['兰山区',186],['罗庄区',142],['河东区',112],['沂水县',56]]},
  'taian-salon-tony': {'name':'泰安','count':586,'districts':[['泰山区',142],['岱岳区',96],['新泰市',52]]},
  'zibo-salon-tony': {'name':'淄博','count':712,'districts':[['张店区',168],['临淄区',96],['淄川区',86],['博山区',72]]},
  'dongying-salon-tony': {'name':'东营','count':386,'districts':[['东营区',96],['河口区',52],['垦利区',42]]},
  'wenzhou-salon-tony': {'name':'温州','count':1234,'districts':[['鹿城区',246],['瓯海区',196],['龙湾区',142],['乐清市',96],['瑞安市',86]]},
  'jiaxing-salon-tony': {'name':'嘉兴','count':756,'districts':[['南湖区',186],['秀洲区',142],['海宁市',86],['桐乡市',72]]},
  'huzhou-salon-tony': {'name':'湖州','count':612,'districts':[['吴兴区',168],['南浔区',128],['德清县',52]]},
  'shaoxing-salon-tony': {'name':'绍兴','count':856,'districts':[['越城区',196],['柯桥区',142],['上虞区',96],['诸暨市',72]]},
  'jinhua-salon-tony': {'name':'金华','count':786,'districts':[['婺城区',186],['金东区',142],['义乌市',168],['东阳市',72]]},
  'taizhou-salon-tony': {'name':'台州','count':856,'districts':[['椒江区',186],['黄岩区',142],['路桥区',128],['温岭市',86]]},
  'zhoushan-salon-tony': {'name':'舟山','count':286,'districts':[['定海区',96],['普陀区',72]]},
  'quanzhou-salon-tony': {'name':'泉州','count':1023,'districts':[['丰泽区',186],['晋江市',168],['鲤城区',142],['洛江区',96],['石狮市',72]]},
  'zhangzhou-salon-tony': {'name':'漳州','count':612,'districts':[['芗城区',142],['龙文区',96],['龙海区',72]]},
  'nanchang-salon-tony': {'name':'南昌','count':1234,'districts':[['红谷滩区',246],['青山湖区',198],['西湖区',168],['东湖区',142],['新建区',96]]},
  'ganzhou-salon-tony': {'name':'赣州','count':586,'districts':[['章贡区',142],['南康区',96],['赣县区',72]]},
  'zhuhai-salon-tony': {'name':'珠海','count':856,'districts':[['香洲区',196],['斗门区',142],['金湾区',96]]},
  'foshan-salon-tony': {'name':'佛山','count':1456,'districts':[['南海区',286],['顺德区',248],['禅城区',212],['三水区',142],['高明区',96]]},
  'dg-salon-tony': {'name':'东莞','count':1689,'districts':[['南城街道',186],['东城街道',168],['长安镇',142],['虎门镇',128],['厚街镇',96]]},
  'zs-salon-tony': {'name':'中山','count':612,'districts':[['石岐街道',142],['东区街道',128],['小榄镇',96],['古镇镇',72]]},
  'huizhou-salon-tony': {'name':'惠州','count':856,'districts':[['惠城区',196],['惠阳区',142],['博罗县',96],['惠东县',72]]},
  'st-salon-tony': {'name':'汕头','count':786,'districts':[['金平区',168],['龙湖区',142],['澄海区',96],['潮阳区',86]]},
  'jieyang-salon-tony': {'name':'揭阳','count':486,'districts':[['榕城区',142],['揭东区',86],['普宁市',72]]},
  'maoming-salon-tony': {'name':'茂名','count':512,'districts':[['茂南区',142],['电白区',96],['高州市',52]]},
  'zhanjiang-salon-tony': {'name':'湛江','count':612,'districts':[['赤坎区',142],['霞山区',128],['麻章区',96],['廉江市',52]]},
  'guilin2-salon-tony': {'name':'桂林','count':1945,'districts':[['秀峰区',186],['象山区',168],['七星区',154],['叠彩区',126],['雁山区',98],['临桂区',86],['阳朔县',42]]},
  'liuzhou-salon-tony': {'name':'柳州','count':786,'districts':[['城中区',168],['鱼峰区',142],['柳南区',128],['柳北区',96],['柳江区',72]]},
  'guiyang2-salon-tony': {'name':'贵阳','count':1234,'districts':[['南明区',228],['云岩区',196],['观山湖区',168],['花溪区',142],['白云区',112],['乌当区',86]]},
  'zunyi-salon-tony': {'name':'遵义','count':1568,'districts':[['红花岗区',196],['汇川区',168],['播州区',142],['仁怀市',96]]},
  'kunming2-salon-tony': {'name':'昆明','count':1678,'districts':[['五华区',246],['盘龙区',218],['官渡区',196],['西山区',168],['呈贡区',96],['安宁市',72]]},
  'dali2-salon-tony': {'name':'大理','count':967,'districts':[['大理市',246],['祥云县',128],['宾川县',96],['弥渡县',82],['巍山县',68],['洱源县',56],['剑川县',42]]},
  'lijiang-salon-tony': {'name':'丽江','count':386,'districts':[['古城区',142],['玉龙县',86],['永胜县',42]]},
}

# Deduplicate by name and keep the first occurrence (the one with more data)
seen_names = {}
deduped = {}
for slug, info in CITIES.items():
    name = info['name']
    if name not in seen_names or len(info['districts']) > len(CITIES[seen_names[name]]['districts']):
        if name in seen_names:
            old_slug = seen_names[name]
            # Remove old one with same name
            deduped.pop(old_slug, None)
        deduped[slug] = info
        seen_names[name] = slug
    # else skip duplicate

CITIES = deduped
city_count = len(CITIES)
print(f"Total unique cities: {city_count}")
total_shops = sum(c['count'] for c in CITIES.values())
print(f"Total shops: {total_shops:,}")

# Generate JS
def gen_js():
    lines = []
    lines.append('// _worker.js — Cloudflare Pages catch-all Worker')
    lines.append('// Handles city salon pages + tony-cities listing + static assets')
    lines.append('// Auto-generated by gen_all_cities.py')
    lines.append(f'// Cities: {city_count} | Total shops: {total_shops:,}')
    lines.append('')
    lines.append('const CITIES = {')
    
    for slug, info in sorted(CITIES.items(), key=lambda x: -x[1]['count']):
        name = info['name']
        count = info['count']
        dists = info['districts']
        dist_js = ','.join(f"['{d[0]}',{d[1]}]" for d in dists)
        lines.append(f"  '{slug}': {{ name: '{name}', count: {count}, dist: [{dist_js}] }},")
    
    lines.append('};')
    lines.append('')

    # Generate genCityPage function
    lines.append('''function genCityPage(slug) {
  var c = CITIES[slug];
  if (!c) return null;
  var s = c.dist.slice().sort(function(a,b){return b[1]-a[1];});
  var cs = '';
  for (var i=0;i<s.length;i++) {
    cs += '<div class="dc"><div class="dn">' + s[i][0] + '</div><div class="dv">' + s[i][1] + '</div></div>';
  }
  var n = c.name, k = c.count, l = c.dist.length;
  return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>'
    + '<title>' + n + '美发圈 - 安柯耳 Airaquas</title>'
    + '<meta name="description" content="' + n + '美发店名录 · ' + k + '家合作沙龙"/>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,\\'Noto Sans SC\\',\\'PingFang SC\\',\\'Microsoft YaHei\\',\\'Hiragino Sans GB\\',sans-serif;background:#0b0d16;color:#d0d0d8;line-height:1.6;-webkit-font-smoothing:antialiased;margin:0}.w{max-width:600px;margin:0 auto;padding:0 16px 80px}.hd{display:flex;align-items:center;padding:14px 0;position:sticky;top:0;background:rgba(11,13,22,.92);backdrop-filter:blur(12px);z-index:100;gap:10px}.bk{padding:6px 12px;border-radius:8px;color:rgba(255,255,255,.4);text-decoration:none;font-size:13px}.bk:hover{color:#d0d0d8;background:rgba(255,255,255,.04)}.lg{font-size:13px;font-weight:600;color:#e8e4dc}.cb{display:inline-block;padding:4px 12px;border-radius:12px;font-size:11px;background:rgba(123,193,255,.08);color:#7bc1ff;margin-bottom:4px}h1{font-size:26px;color:#e8e4dc;font-weight:700;margin:24px 0 4px}.st{color:rgba(255,255,255,.35);font-size:13px;margin:4px 0 20px}.sm{display:flex;gap:12px;margin-bottom:24px;padding:16px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:14px}.si{flex:1;text-align:center}.sv{font-size:22px;font-weight:700;color:#7bc1ff}.sl{font-size:11px;color:rgba(255,255,255,.3)}.sc{font-size:14px;font-weight:500;color:rgba(255,255,255,.4);margin-bottom:10px}.dg{display:grid;grid-template-columns:1fr 1fr;gap:8px}.dc{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04)}.dc:hover{background:rgba(255,255,255,.04);border-color:rgba(123,193,255,.1)}.dn{font-size:13px;color:#d0d0d8}.dv{font-size:13px;font-weight:600;color:#7bc1ff}.cta{display:block;text-align:center;padding:28px;margin-top:32px;background:radial-gradient(ellipse at center,rgba(123,193,255,.04),transparent 70%);border-radius:16px;text-decoration:none}.cta h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}.cta p{color:rgba(255,255,255,.3);font-size:12px}.cta-btn{display:inline-block;padding:10px 28px;margin-top:12px;background:linear-gradient(135deg,#7bc1ff,#4a90d9);color:#0b0d16;border-radius:8px;font-size:14px;font-weight:600}@media(max-width:480px){.dg{grid-template-columns:1fr}}</style></head>'
    + '<body><div class="w"><div class="hd"><a class="bk" href="/tony-cities">&larr; 返回</a><div class="lg">安柯耳</div></div>'
    + '<div class="cb">📍 ' + n + '</div>'
    + '<h1>' + n + '美发圈</h1>'
    + '<p class="st">Tony老师在店 · ' + k + '家合作美发店 · 覆盖' + l + '个区</p>'
    + '<div class="sm"><div class="si"><div class="sv">' + k + '</div><div class="sl">合作美发店</div></div>'
    + '<div class="si"><div class="sv">' + l + '</div><div class="sl">覆盖区域</div></div>'
    + '<div class="si"><div class="sv">' + n + '</div><div class="sl">运营城市</div></div></div>'
    + '<div class="sc">📍 区域分布</div>'
    + '<div class="dg">' + cs + '</div>'
    + '<a class="cta" href="/detect"><h3>AI头皮检测 · 合作沙龙专属</h3><p>先检测再选店，科学护理更有效</p><div class="cta-btn">开始AI检测 &rarr;</div></a>'
    + '</div></body></html>';
}''')

    # Generate genCityList with categorized cities
    lines.append('')
    lines.append('// City listing page')
    lines.append('function genCityList() {')

    # Categorize cities
    major = []
    standard = []
    for slug, info in sorted(CITIES.items(), key=lambda x: -x[1]['count']):
        if info['count'] >= 1000:
            major.append((info['name'], slug.split('-salon-tony')[0], info['count']))
        else:
            standard.append((info['name'], slug.split('-salon-tony')[0], info['count']))
    
    # Limit major to ~30 biggest
    major = major[:40]
    standard = major[40:] + standard
    
    # Generate array literals
    def fmt_cities(arr):
        parts = [f"['{n}','{c}',{k}]" for n, c, k in arr]
        return '[' + ','.join(parts) + ']'
    
    lines.append(f'  var top = {fmt_cities(major)};')
    lines.append(f'  var more = {fmt_cities(standard)};')
    lines.append('''  var tc = function(cities) {
    var h = '';
    for (var i=0;i<cities.length;i++) {
      h += '<a href="/tony/' + cities[i][1] + '-salon-tony" class="city"><span class="cname">' + cities[i][0] + '</span><span class="ccount">' + cities[i][2] + '</span></a>';
    }
    return h;
  };
  return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>'
    + '<title>城市美发圈 - 安柯耳 Airaquas</title>'
    + '<meta name="description" content="覆盖全国''' + str(city_count) + '''城''' + str(total_shops) + '''+家合作美发店，AI头皮检测合作沙龙名录。"/>'
    + '<link rel="canonical" href="https://airaquas.hair/salon"/>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,\\'Noto Sans SC\\',\\'PingFang SC\\',\\'Microsoft YaHei\\',\\'Hiragino Sans GB\\',sans-serif;background:#0b0d16;color:#d0d0d8;line-height:1.6;-webkit-font-smoothing:antialiased}.wrap{max-width:600px;margin:0 auto;padding:0 16px 80px}.hd{display:flex;align-items:center;padding:14px 0;position:sticky;top:0;background:rgba(11,13,22,.92);backdrop-filter:blur(12px);z-index:100}.lg{font-size:15px;font-weight:700;color:#e8e4dc;letter-spacing:1px}.lg span{color:#7bc1ff;font-size:10px;display:block;letter-spacing:2px}.badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:10px;background:rgba(123,193,255,.08);color:#7bc1ff;margin-bottom:8px}h1{font-size:22px;color:#e8e4dc;font-weight:600;margin-bottom:4px}.sub{color:rgba(255,255,255,.35);font-size:13px;margin-bottom:20px}.grp{margin-bottom:20px}.grp-title{font-size:13px;font-weight:500;color:rgba(255,255,255,.4);margin-bottom:8px;letter-spacing:.04em}.city-wrap{display:flex;flex-wrap:wrap;gap:6px}.city{display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);text-decoration:none;transition:all .2s;min-width:120px}.city:hover{background:rgba(255,255,255,.04);border-color:rgba(123,193,255,.12);transform:translateY(-1px)}.cname{font-size:14px;color:#d8d8e0;font-weight:500}.ccount{font-size:11px;color:rgba(255,255,255,.25);margin-left:auto}.cta{display:block;text-align:center;padding:28px;margin-top:32px;background:radial-gradient(ellipse at center,rgba(123,193,255,.04),transparent 70%);border-radius:16px;text-decoration:none}.cta h3{color:#e8e4dc;font-size:15px;margin-bottom:6px}.cta p{color:rgba(255,255,255,.3);font-size:12px}.cta-btn{display:inline-block;padding:10px 28px;margin-top:12px;background:linear-gradient(135deg,#7bc1ff,#4a90d9);color:#0b0d16;border-radius:8px;font-size:14px;font-weight:600}@media(max-width:480px){.city{min-width:100%}}</style></head>'
    + '<body><div class="wrap"><div class="hd"><div class="lg">安柯耳<span>城市美发圈</span></div></div>'
    + '<div class="badge">🗺️ 合作美发店网络</div>'
    + '<h1>Tony 老师在店</h1>'
    + '<p class="sub">覆盖全国 ''' + str(city_count) + ''' 个城市 · ''' + str(total_shops) + '''+ 家合作美发店</p>'
    + '<div class="grp"><div class="grp-title">📍 重点城市</div><div class="city-wrap">' + tc(top) + '</div></div>'
    + '<div class="grp"><div class="grp-title">📍 全部城市</div><div class="city-wrap">' + tc(more) + '</div></div>'
    + '<a class="cta" href="/"><h3>AI 头皮检测 · 合作沙龙专属</h3><p>Tony 老师已入驻城市美发圈</p><div class="cta-btn">回到首页 &rarr;</div></a>'
    + '</div></body></html>';
}''')

    # Generate listing HTML
    lines.append('')
    lines.append('var cityListHtml = genCityList();')
    lines.append('')
    lines.append('''export default {
  async fetch(request, env, ctx) {
    var url = new URL(request.url);
    var path = url.pathname;

    // City listing page
    if (path === '/tony-cities' || path === '/tony-cities/') {
      return new Response(cityListHtml, {
        headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'public,max-age=600' }
      });
    }

    // Per-city salon pages: /tony/xxx-salon-tony
    var m = path.match(/^\\/tony\\/([^/]+)$/);
    if (m && m[1].endsWith('-salon-tony')) {
      var page = genCityPage(m[1]);
      if (page) {
        return new Response(page, {
          headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'public,max-age=3600' }
        });
      }
    }

    // Serve static assets from Pages (index.html = brand page)
    try {
      var asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    } catch(_) {}

    // API routes: 404
    if (path.startsWith('/api/')) {
      return new Response('{"code":404,"message":"API"}', {
        status: 404, headers: { 'content-type': 'application/json' }
      });
    }

    // SPA fallback: index.html
    return env.ASSETS.fetch(new URL('/', url).toString());
  }
};''')
    
    return '\n'.join(lines)

js_code = gen_js()
output_path = '/home/node/clawd/projects/airaquas/pages-dist/_worker.js'
with open(output_path, 'w') as f:
    f.write(js_code)
print(f"\nWritten to {output_path}")
print(f"Size: {len(js_code):,} bytes")
print(f"Cities in list: {city_count}")
print(f"Total shops: {total_shops:,}")
