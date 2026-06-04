#!/usr/bin/env python3
"""
airaquas Daily City Crawl — 高德地图城市美发数据采集
第一波：天津/重庆/杭州/成都/武汉/南京/西安/长沙/郑州/沈阳
带 checkpoint 保存，纯 stdlib
"""

import json
import os
import sys
import time
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path
from datetime import datetime

AMAP_KEY = os.environ.get("AMAP_API_KEY", "698af4c13ca81e4d3fc5413f94a90b7b")
DATA_DIR = Path(os.environ.get("DATA_DIR", "/home/node/clawd/projects/airaquas/server/public/data"))
OUTPUT_FILE = DATA_DIR / "city_data.json"
CHECKPOINT_FILE = DATA_DIR / ".city_crawl_checkpoint.json"

CITIES = [
    {"name": "天津", "adcode": "120000"},
    {"name": "重庆", "adcode": "500000"},
    {"name": "杭州", "adcode": "330100"},
    {"name": "成都", "adcode": "510100"},
    {"name": "武汉", "adcode": "420100"},
    {"name": "南京", "adcode": "320100"},
    {"name": "西安", "adcode": "610100"},
    {"name": "长沙", "adcode": "430100"},
    {"name": "郑州", "adcode": "410100"},
    {"name": "沈阳", "adcode": "210100"},
]

KEYWORDS = [
    "美发店", "理发店", "养发馆", "头皮护理",
    "美发沙龙", "美容美发",
]


def search_poi(city_adcode: str, keywords: str, page: int = 1) -> dict:
    params = urllib.parse.urlencode({
        "key": AMAP_KEY,
        "keywords": keywords,
        "city": city_adcode,
        "offset": 25,
        "page": page,
        "extensions": "all",
        "output": "JSON",
    })
    url = f"https://restapi.amap.com/v3/place/text?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Airaquas-Crawler/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        if data.get("status") != "1":
            print(f"  [WARN] AMAP: {data.get('info', '?')}")
            return {"count": 0, "pois": []}
        return data
    except Exception as e:
        print(f"  [ERROR] {e}")
        return {"count": 0, "pois": []}


def crawl_city(city: dict) -> list:
    """采集单个城市"""
    print(f"\n{'='*50}")
    print(f"📍 {city['name']} (adcode: {city['adcode']})")
    print(f"{'='*50}")

    all_pois = {}
    for kw in KEYWORDS:
        print(f"  🔍 [{kw}]")
        page = 1
        while True:
            data = search_poi(city["adcode"], kw, page)
            pois = data.get("pois", [])
            if not pois:
                if page == 1:
                    print(f"     无结果")
                break
            for poi in pois:
                pid = poi.get("id")
                if pid and pid not in all_pois:
                    all_pois[pid] = {
                        "id": pid,
                        "name": poi.get("name", ""),
                        "type": poi.get("type", ""),
                        "typecode": poi.get("typecode", ""),
                        "address": poi.get("address", ""),
                        "adname": poi.get("adname", ""),
                        "location": poi.get("location", ""),
                        "pname": poi.get("pname", ""),
                        "cityname": poi.get("cityname", ""),
                        "tel": poi.get("tel", ""),
                        "business_area": poi.get("business_area", ""),
                        "photos": poi.get("photos", []),
                        "biz_ext": poi.get("biz_ext", {}),
                    }
            print(f"     第 {page} 页 → {len(pois)} 条 (累计去重: {len(all_pois)})")
            page += 1
            time.sleep(0.3)
            if page > 10:
                break
        time.sleep(0.5)

    result = list(all_pois.values())
    print(f"  ✅ {city['name']}: {len(result)} 条")
    return result


def save_checkpoint(all_city_data: dict, completed_cities: list):
    """保存中间结果，避免全量丢失"""
    checkpoint = {
        "crawl_time": datetime.now().isoformat(),
        "completed_cities": completed_cities,
        "data": all_city_data,
    }
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
        json.dump(checkpoint, f, ensure_ascii=False, indent=2)


def load_checkpoint() -> tuple:
    """加载检查点，返回 (all_city_data, completed_city_names)"""
    if not CHECKPOINT_FILE.exists():
        return {}, []
    try:
        with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
            cp = json.load(f)
        print(f"📋 发现检查点: 已采集 {len(cp.get('completed_cities', []))} 个城市")
        return cp.get("data", {}), cp.get("completed_cities", [])
    except Exception as e:
        print(f"⚠️ 检查点加载失败: {e}")
        return {}, []


def main():
    print(f"🕐 {datetime.now().isoformat()}")
    print(f"🔑 Key: {AMAP_KEY[:6]}...{AMAP_KEY[-4:]}")
    print(f"📂 {DATA_DIR}")
    print(f"📋 列表: {', '.join(c['name'] for c in CITIES)}")

    all_city_data, completed = load_checkpoint()

    # 找出未完成的城市
    remaining = [c for c in CITIES if c["name"] not in completed]
    if not remaining:
        print("✅ 全部城市已完成！")
    else:
        print(f"⏳ 剩余 {len(remaining)} 个城市: {', '.join(c['name'] for c in remaining)}")

    summary = {
        "crawl_time": datetime.now().isoformat(),
        "total_cities": len(CITIES),
        "cities": {},
        "errors": [],
    }

    for city in remaining:
        try:
            pois = crawl_city(city)
            all_city_data[city["name"]] = pois
            completed.append(city["name"])
            save_checkpoint(all_city_data, completed)
            summary["cities"][city["name"]] = {"count": len(pois), "status": "ok"}
        except Exception as e:
            print(f"\n  ❌ {city['name']} 失败: {e}")
            summary["cities"][city["name"]] = {"count": 0, "status": "error", "error": str(e)}
            summary["errors"].append(f"{city['name']}: {e}")

    # 补充已完成的记录
    for cn in completed:
        if cn not in summary["cities"]:
            summary["cities"][cn] = {"count": len(all_city_data.get(cn, [])), "status": "ok"}

    # 保存最终结果
    output = {
        "version": "1.0",
        "type": "city_crawl",
        "summary": summary,
        "data": all_city_data,
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    size_kb = os.path.getsize(OUTPUT_FILE) / 1024
    print(f"\n💾 已保存: {OUTPUT_FILE} ({size_kb:.1f} KB)")

    # 清理检查点
    if CHECKPOINT_FILE.exists():
        os.remove(CHECKPOINT_FILE)

    print(f"\n{'='*50}")
    print(f"📊 采集汇总")
    total = 0
    for cn, info in sorted(summary["cities"].items(), key=lambda x: -x[1]["count"]):
        icon = "✅" if info["status"] == "ok" else "❌"
        print(f"  {icon} {cn}: {info['count']}")
        total += info["count"]
    print(f"{'='*50}")
    print(f"总计: {total} 条")

    result = {
        "status": "ok" if not summary["errors"] else "partial",
        "total_pois": total,
        "cities": {k: v["count"] for k, v in summary["cities"].items()},
        "errors": summary["errors"],
        "output_file": str(OUTPUT_FILE),
        "size_kb": round(size_kb, 1),
    }
    print(f"\n---RESULT_JSON---")
    print(json.dumps(result, ensure_ascii=False))
    print(f"---RESULT_JSON_END---")


if __name__ == "__main__":
    main()
