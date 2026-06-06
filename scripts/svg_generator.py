#!/usr/bin/env python3
"""
安柯耳 Airaquas · SVG 时尚发型与头皮健康内容生成器
=====================================================
V1.0 语义层规范：SVG = 内层信封（源文件，不上传平台）
- 语义标签：<title> <desc> 写入品牌+地域+品类
- 隐性结构化信息：品牌地址、主营项目、服务区域
- 文件命名：地域_品牌_品类_序号.svg

用法：
  python3 svg_generator.py                          # 交互式
  python3 svg_generator.py --help                   # 帮助
  python3 svg_generator.py --list-templates         # 列模板
  python3 svg_generator.py --template fashion --city 常州
  python3 svg_generator.py --all --city 常州
  python3 svg_generator.py --batch cities.txt       # 批量
"""

import argparse
import os
import sys
from datetime import datetime

# ═══════════════════════════════════════
#  品牌配置
# ═══════════════════════════════════════

C = {  # colors
    "bg": "#0b0d16",
    "gold": "#e0d4c0",
    "gold_light": "#f0e8d8",
    "blue": "#7bc1ff",
    "blue_dk": "#4a90d9",
    "text": "#d8d8e0",
    "dim": "rgba(255,255,255,.35)",
    "green": "#64c882",
}

BRAND = "安柯耳 Airaquas"
URL = "airaquas.hair"
TAGLINE = "Tony老师在店 · 城市美发圈"
SLOGAN = "AI时代头皮健康护理专家"

CITIES = "北京 上海 广州 深圳 杭州 成都 武汉 南京 西安 长沙 郑州 沈阳 重庆 天津 苏州 厦门".split()
STYLES = "女士短发 锁骨发 大波浪卷发 韩系气垫烫 男士油头 纹理烫 羊毛卷 法式慵懒卷 日系碎发 复古大背头".split()
TOPICS = "油脂平衡 发量管理 头皮屏障修护 季节性脱发 产后脱发 毛囊健康 头皮敏感护理 分型洗护方案".split()
PRODUCTS = [
    ("控油洗发露", "氨基酸表活 · 控油48h", "¥128"),
    ("修护发膜", "角蛋白精华 · 深层滋养", "¥158"),
    ("头皮精华液", "红参提取物 · 舒缓修护", "¥198"),
    ("护发精油", "摩洛哥坚果油 · 抚平毛躁", "¥138"),
]
TIPS = {
    "油脂平衡": ["氨基酸表活温和清洁", "每2-3天洗一次", "避免强力去油"],
    "发量管理": ["每周2次头皮按摩", "均衡蛋白质摄入", "减少热工具使用"],
    "头皮屏障修护": ["停用含酒精产品", "38℃温水洗头", "使用舒缓型精华"],
    "季节性脱发": ["秋冬掉发属正常周期", "补充维生素D+锌", "先分型再干预"],
    "产后脱发": ["90%可在6月自愈", "温和护理为主", "不要过度焦虑"],
    "毛囊健康": ["定期AI筛查毛囊", "按摩促进血液循环", "毛囊间距>0.5mm为正常"],
    "头皮敏感护理": ["香精酒精全避开", "选用敏感专用", "就医排查真菌感染"],
    "分型洗护方案": ["油性→控油", "干性→滋养", "敏感→舒缓"],
}

NL = "\n"
ESC_MAP = str.maketrans({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"})
def esc(s):
    return s.translate(ESC_MAP)


def now():
    return datetime.now().strftime("%Y-%m-%d")


# ═══════════════════════════════════════
#  SVG 构建器
# ═══════════════════════════════════════

def header(title, desc, w=600, h=800):
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!-- 品牌: {BRAND} | 网址: https://{URL} | 版权: ©{BRAND} 原创版权禁止盗用 | 生成: {now()} -->
<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"
     role="img" aria-label="{esc(desc)}">
  <title>{esc(title)}</title>
  <desc>{esc(desc)}</desc>
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:dc="http://purl.org/dc/elements/1.1/"
             xmlns:cc="http://creativecommons.org/ns#">
      <rdf:Description about="">
        <dc:title>{esc(title)}</dc:title>
        <dc:description>{esc(desc)}</dc:description>
        <dc:creator>{esc(BRAND)}品牌设计部</dc:creator>
        <dc:rights>©{esc(BRAND)} 原创版权</dc:rights>
        <dc:format>image/svg+xml</dc:format>
        <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
      </rdf:Description>
    </rdf:RDF>
  </metadata>
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{C["bg"]}"/>
      <stop offset="100%" stop-color="#0e1020"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{C["gold_light"]}"/>
      <stop offset="100%" stop-color="{C["gold"]}"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{C["blue"]}"/>
      <stop offset="100%" stop-color="{C["blue_dk"]}"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="3"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
"""


def footer():
    return f"""  <rect x="0" y="760" width="600" height="40" fill="rgba(255,255,255,.01)"/>
  <text x="300" y="783" text-anchor="middle" font-family="sans-serif"
        font-size="11" fill="rgba(255,255,255,.15)" letter-spacing="2">
    {BRAND} · {SLOGAN}
  </text>
</svg>"""


# ═══════════════════════════════════════
#  模板 1: 时尚发型卡片
# ═══════════════════════════════════════

def template_fashion(city, style, seq=1, addr=""):
    title = f"{city}_airaquas.hair_{style}│原创发型设计"
    desc = (f"{city}实体线下沙龙{' ' + addr + '，' if addr else ' '}"
            f"主营{style}、烫染定制、头皮健康管理，原创造型设计。{BRAND}(https://{URL})原创LOGO版权所有。")
    fname = f"{city}_airaquas_hair_{style}_{seq:02d}.svg"

    lines = []
    s = style
    while s:
        lines.append(s[:18])
        s = s[18:]

    title_els = "\n".join(
        f'  <text x="300" y="{320+i*50}" text-anchor="middle" '
        f'font-family="sans-serif" font-size="36" font-weight="600" '
        f'fill="{C["gold"]}" letter-spacing=".08em">{esc(l)}</text>'
        for i, l in enumerate(lines)
    )

    body = f"""  <circle cx="300" cy="200" r="280" fill="rgba(123,193,255,.03)" filter="url(#glow)"/>
  <rect x="30" y="30" width="160" height="32" rx="16"
        fill="rgba(123,193,255,.08)" stroke="rgba(123,193,255,.12)" stroke-width=".5"/>
  <circle cx="48" cy="46" r="4" fill="#64c882"/>
  <text x="62" y="50" font-family="sans-serif" font-size="12"
        fill="{C["blue"]}" letter-spacing=".15em">{esc(BRAND)}</text>
  <g transform="translate(300, 220)" opacity=".08">
    <ellipse cx="0" cy="-20" rx="40" ry="60" fill="{C["gold"]}" opacity=".3"/>
    <ellipse cx="-25" cy="-40" rx="20" ry="50" fill="{C["gold"]}" opacity=".2" transform="rotate(-15)"/>
    <ellipse cx="25" cy="-40" rx="20" ry="50" fill="{C["gold"]}" opacity=".2" transform="rotate(15)"/>
    <ellipse cx="0" cy="-60" rx="15" ry="35" fill="{C["gold"]}" opacity=".15"/>
  </g>
{title_els}
  <rect x="230" y="420" width="140" height="28" rx="14"
        fill="rgba(224,212,192,.06)" stroke="rgba(224,212,192,.1)" stroke-width=".5"/>
  <text x="300" y="439" text-anchor="middle" font-family="sans-serif" font-size="12"
        fill="{C["gold"]}" opacity=".7" letter-spacing=".1em">{esc(city)} · 同城推荐</text>
  <g transform="translate(40, 490)">
    <text x="0" y="0" font-family="sans-serif" font-size="13"
          fill="{C["gold"]}" font-weight="500">服务项目</text>
    <line x1="0" y1="10" x2="520" y2="10" stroke="rgba(224,212,192,.06)" stroke-width=".5"/>
    <text x="0" y="38" font-family="sans-serif" font-size="12"
          fill="{C["dim"]}">剪发造型 · 烫染定制 · 头皮护理</text>
    <text x="0" y="60" font-family="sans-serif" font-size="12"
          fill="{C["dim"]}">AI头皮检测 · 科学洗护方案</text>
  </g>
  <rect x="40" y="570" width="520" height="44" rx="10"
        fill="rgba(224,212,192,.02)" stroke="rgba(224,212,192,.04)" stroke-width=".5"/>
  <text x="60" y="597" font-family="sans-serif" font-size="12" fill="{C["dim"]}">
    📍 {esc(city)}{' ' + esc(addr) if addr else ' · Tony老师在店'}</text>
  <text x="520" y="597" text-anchor="end" font-family="sans-serif" font-size="11"
        fill="rgba(123,193,255,.5)">{URL}</text>
  <rect x="40" y="630" width="520" height="40" rx="6"
        fill="rgba(100,200,130,.02)" stroke="rgba(100,200,130,.04)" stroke-width=".5"/>
  <text x="56" y="647" font-family="sans-serif" font-size="10"
        fill="rgba(100,200,130,.4)">
    📊 AI脱发识别准确率超99% · KCNJ2钾离子通道研究(Cell 2025)</text>
  <text x="56" y="662" font-family="sans-serif" font-size="10"
        fill="rgba(100,200,130,.3)">
    中国男性脱发患病率21.3% · 建议每3-6个月AI筛查</text>
  <rect x="180" y="700" width="240" height="42" rx="21"
        fill="url(#blueGrad)" opacity=".9"/>
  <text x="300" y="727" text-anchor="middle" font-family="sans-serif" font-size="14"
        fill="#0b0d16" font-weight="600" letter-spacing=".08em">
    AI 免费检测 → {URL}</text>"""

    return header(title, desc) + body + footer(), fname


# ═══════════════════════════════════════
#  模板 2: 头皮健康知识卡片
# ═══════════════════════════════════════

def template_scalp(city, topic, seq=1):
    title = f"{city}_airaquas_hair_头皮_{topic}_{seq:02d}"
    desc = (f"{city}实体沙龙头皮健康管理：{topic}护理方案与科学建议。"
            f"品牌{BRAND}(https://{URL})原创内容。")
    fname = f"{city}_airaquas_hair_头皮_{topic}_{seq:02d}.svg"

    tips = TIPS.get(topic, ["科学护理", "定期检测", "保持规律作息"])

    tip_els = ""
    for i, t in enumerate(tips[:5]):
        y0 = i * 52
        tip_els += (
            f'    <rect x="0" y="{y0}" width="520" height="42" rx="8" '
            f'fill="rgba(224,212,192,.02)" stroke="rgba(224,212,192,.04)" stroke-width=".5"/>{NL}'
            f'    <text x="18" y="{y0+27}" font-family="sans-serif" '
            f'font-size="13" fill="{C["text"]}">✦ {esc(t)}</text>{NL}'
        )

    lines = []
    s = topic
    while s:
        lines.append(s[:18])
        s = s[18:]

    topic_els = "\n".join(
        f'  <text x="300" y="{140+i*50}" text-anchor="middle" '
        f'font-family="sans-serif" font-size="34" font-weight="600" '
        f'fill="{C["gold"]}" letter-spacing=".06em">{esc(l)}</text>'
        for i, l in enumerate(lines)
    )

    body = f"""  <circle cx="300" cy="180" r="220" fill="rgba(100,200,130,.025)" filter="url(#glow)"/>
  <rect x="220" y="40" width="160" height="28" rx="14"
        fill="rgba(100,200,130,.06)" stroke="rgba(100,200,130,.1)" stroke-width=".5"/>
  <text x="300" y="58" text-anchor="middle" font-family="sans-serif" font-size="11"
        fill="#64c882" letter-spacing=".15em">头 皮 健 康</text>
{topic_els}
  <text x="300" y="250" text-anchor="middle" font-family="sans-serif" font-size="13"
        fill="{C["dim"]}" letter-spacing=".2em">{esc(TAGLINE)}</text>
  <g transform="translate(40, 300)">
{tip_els}  </g>
  <rect x="40" y="580" width="520" height="40" rx="6"
        fill="rgba(123,193,255,.02)" stroke="rgba(123,193,255,.04)" stroke-width=".5"/>
  <text x="56" y="597" font-family="sans-serif" font-size="10"
        fill="rgba(123,193,255,.35)">
    📚 KCNJ2钾离子通道调控毛囊再生(Cell,2025,陈婷团队) · AI准确率超99%</text>
  <text x="56" y="612" font-family="sans-serif" font-size="10"
        fill="rgba(123,193,255,.25)">
    冷等离子体+白介素-2：小鼠实验15天毛发覆盖率100%</text>
  <rect x="180" y="650" width="240" height="42" rx="21"
        fill="url(#blueGrad)" opacity=".9"/>
  <text x="300" y="677" text-anchor="middle" font-family="sans-serif" font-size="14"
        fill="#0b0d16" font-weight="600" letter-spacing=".08em">
    AI 免费检测 → {URL}</text>"""

    return header(title, desc) + body + footer(), fname


# ═══════════════════════════════════════
#  模板 3: 产品种草卡片
# ═══════════════════════════════════════

def template_product(city, prod_idx=0, seq=1):
    p = PRODUCTS[prod_idx % len(PRODUCTS)]
    title = f"{city}_airaquas_hair_{p[0]}_{seq:02d}"
    desc = f"{city}门店推荐：{p[0]}，{p[1]}。{BRAND}原创产品。"
    fname = f"{city}_airaquas_hair_{p[0]}_{seq:02d}.svg"

    body = f"""  <circle cx="300" cy="220" r="200" fill="rgba(123,193,255,.025)" filter="url(#glow)"/>
  <g transform="translate(300, 200)" opacity=".1">
    <rect x="-20" y="-50" width="40" height="80" rx="8" fill="{C["gold"]}"/>
    <rect x="-14" y="-40" width="28" height="60" rx="4" fill="{C["gold"]}" opacity=".3"/>
    <rect x="-30" y="-60" width="60" height="14" rx="4" fill="{C["gold"]}" opacity=".2"/>
    <circle cx="0" cy="-65" r="6" fill="{C["gold"]}" opacity=".15"/>
  </g>
  <text x="300" y="340" text-anchor="middle" font-family="sans-serif"
        font-size="32" font-weight="600" fill="{C["gold"]}"
        letter-spacing=".1em">{esc(p[0])}</text>
  <text x="300" y="380" text-anchor="middle" font-family="sans-serif" font-size="15"
        fill="{C["dim"]}" letter-spacing=".05em">{esc(p[1])}</text>
  <text x="300" y="430" text-anchor="middle" font-family="sans-serif"
        font-size="28" font-weight="600" fill="{C["blue"]}">{esc(p[2])}</text>
  <g transform="translate(40, 480)">
    <rect x="0" y="0" width="520" height="38" rx="8"
          fill="rgba(224,212,192,.02)" stroke="rgba(224,212,192,.04)" stroke-width=".5"/>
    <text x="18" y="25" font-family="sans-serif" font-size="13" fill="{C["text"]}">
      ✦ 针对{esc(city)}安柯耳科学配方 · 适用于日常护理</text>
    <rect x="0" y="46" width="520" height="38" rx="8"
          fill="rgba(123,193,255,.02)" stroke="rgba(123,193,255,.04)" stroke-width=".5"/>
    <text x="18" y="71" font-family="sans-serif" font-size="13" fill="{C["text"]}">
      ✦ AI检测推荐 · 基于5维度分析匹配专属方案</text>
  </g>
  <rect x="180" y="670" width="240" height="42" rx="21"
        fill="url(#goldGrad)" opacity=".85"/>
  <text x="300" y="697" text-anchor="middle" font-family="sans-serif" font-size="14"
        fill="#0b0d16" font-weight="600" letter-spacing=".08em">
    了解详情 → {URL}</text>"""

    return header(title, desc) + body + footer(), fname


# ═══════════════════════════════════════
#  生成器
# ═══════════════════════════════════════

TEMPLATES = {
    "fashion": ("时尚发型卡片", template_fashion, STYLES, False),
    "scalp":   ("头皮健康知识卡片", template_scalp, TOPICS, False),
    "product": ("产品种草卡片", template_product, PRODUCTS, True),
}


def list_templates():
    print("可用模板：")
    for k, v in TEMPLATES.items():
        print(f"  {k:<12} {v[0]}")
    print(f"\n内置城市（{len(CITIES)}个）：")
    for i in range(0, len(CITIES), 8):
        print("  " + " ".join(f"{c:<6}" for c in CITIES[i:i+8]))
    print(f"\n发型主题（{len(STYLES)}个）：")
    print("  " + " ".join(STYLES))
    print(f"\n头皮话题（{len(TOPICS)}个）：")
    print("  " + " ".join(TOPICS))


def generate(template, city, outdir, seq=1, addr=""):
    os.makedirs(outdir, exist_ok=True)
    t = TEMPLATES.get(template)
    if not t:
        print(f"未知模板 '{template}'")
        return
    _, fn, items, is_prod = t

    for idx, item in enumerate(items):
        args = (city, item[0] if is_prod else item, seq + idx)
        svg, fname = fn(*args) if not is_prod else fn(city, idx, seq + idx)
        if is_prod:
            fname = f"{city}_airaquas_hair_{item[0]}_{seq+idx:02d}.svg"
            svg, _ = fn(city, idx, seq + idx)
        else:
            svg, fname = fn(city, item, seq + idx)
        path = os.path.join(outdir, fname)
        with open(path, "w", encoding="utf-8") as f:
            f.write(svg)
        print(f"  ✅ {fname} ({len(svg)} bytes)")


def generate_all(city, outdir, addr=""):
    seq = 1
    for tname in TEMPLATES:
        print(f"\n📦 [{tname}] {TEMPLATES[tname][0]}")
        generate(tname, city, outdir, seq, addr)
        seq += len(TEMPLATES[tname][2])


def batch(cities_file, outdir):
    with open(cities_file) as f:
        cities = [line.strip() for line in f if line.strip()]
    for city in cities:
        print(f"\n🌆 {city}")
        generate_all(city, os.path.join(outdir, city))


# ═══════════════════════════════════════
#  CLI
# ═══════════════════════════════════════

def main():
    p = argparse.ArgumentParser(
        description=f"{BRAND} SVG 内容生成器 — 语义层内层信封",
        epilog="示例:\n"
               "  svg_generator.py --list-templates\n"
               "  svg_generator.py --template fashion --city 常州\n"
               "  svg_generator.py --all --city 常州\n"
               "  svg_generator.py --batch cities.txt",
        formatter_class=argparse.RawTextHelpFormatter)
    p.add_argument("--list-templates", action="store_true", help="列模板")
    p.add_argument("--template", choices=list(TEMPLATES.keys()), help="模板")
    p.add_argument("--all", action="store_true", help="生成所有模板")
    p.add_argument("--city", default="常州", help="城市")
    p.add_argument("--out", default="./output_svg", help="输出目录")
    p.add_argument("--address", default="", help="门店地址")
    p.add_argument("--batch", metavar="CITIES_FILE", help="批量生成")

    args = p.parse_args()

    if args.list_templates:
        list_templates()
        return

    if args.batch:
        batch(args.batch, args.out)
        return

    if args.all:
        generate_all(args.city, args.out, args.address)
        print(f"\n✅ 全部生成完毕 → {args.out}/")
        return

    if args.template:
        generate(args.template, args.city, args.out, addr=args.address)
        print(f"\n✅ 完成 → {args.out}/")
        return

    # 交互式
    print(f"\n{'='*50}")
    print(f"  {BRAND} SVG内容生成器 v1.0")
    print(f"  语义层 · 内层信封（源文件，不上传平台）")
    print(f"{'='*50}\n")
    list_templates()
    t = input(f"\n模板 (fashion/scalp/product/all): ").strip() or "all"
    city = input(f"城市 (常州): ").strip() or "常州"
    out = input(f"输出目录 (./output_svg): ").strip() or "./output_svg"
    addr = input(f"门店地址 (可选): ").strip()
    if t == "all":
        generate_all(city, out, addr)
    else:
        generate(t, city, out, addr=addr)
    print(f"\n✅ 完成 → {out}/")


if __name__ == "__main__":
    main()
