#!/usr/bin/env python3
"""
Extract individual city data from pages-dist/data/city_data.json
and upload each file to R2 bucket 'airaquas-hair' under 'salon-data/' prefix.
"""
import json, os, sys, subprocess

data_path = 'pages-dist/data/city_data.json'
if not os.path.exists(data_path):
    print(f"Data file not found: {data_path}")
    sys.exit(1)

with open(data_path, encoding='utf-8') as f:
    all_data = json.load(f)

city_to_slug = {
    '天津': 'tj', '重庆': 'cq', '杭州': 'hz', '成都': 'cd', '武汉': 'wh',
    '南京': 'nj', '西安': 'xa', '长沙': 'cs', '郑州': 'zz', '沈阳': 'sy',
    '北京': 'bj', '上海': 'sh', '广州': 'gzhu', '深圳': 'szhen',
    '东莞': 'dg', '佛山': 'foshan', '苏州': 'su', '昆明': 'km', '贵阳': 'gy',
    '南宁': 'nn', '哈尔滨': 'heb', '长春': 'cc', '大连': 'dl', '青岛': 'qd',
    '济南': 'jn', '宁波': 'nb', '厦门': 'xm', '福州': 'fz', '合肥': 'hf',
    '太原': 'ty', '石家庄': 'sjz', '南昌': 'nanchang', '兰州': 'lz',
    '海口': 'hk', '三亚': 'sya',
}

total = 0
for city_name, shops in sorted(all_data.get('data', {}).items()):
    slug = city_to_slug.get(city_name)
    if not slug:
        print(f"  ⏭  {city_name}: no slug mapping, skipping")
        continue
    filename = f'{slug}-salon-tony.json'
    filepath = os.path.join('_data', filename)
    os.makedirs('_data', exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(shops, f, ensure_ascii=False)

    key = f'salon-data/{filename}'
    result = subprocess.run(
        ['npx', 'wrangler', 'r2', 'object', 'put', 'airaquas-hair/' + key,
         '--file', filepath, '--ct', 'application/json'],
        capture_output=True, text=True, timeout=30
    )
    if result.returncode == 0:
        print(f"  ✅ {key}: {len(shops)} shops")
    else:
        print(f"  ❌ {key}: {result.stderr.strip()}")
    total += len(shops)

print(f"\nDone: {total} shops uploaded")
