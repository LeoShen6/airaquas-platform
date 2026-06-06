#!/usr/bin/env node
/**
 * ① 语义层 · EXIF/IPTC 语义嵌入工具
 * ====================================
 * V1.0 规范：运营发布图片前，自动写入 IPTC 元数据
 *
 * 写入字段：
 * - XMP:title        → 品牌 + 城市 + 品类
 * - XMP:description  → 结构化描述（门店/服务/品牌）
 * - XMP:creator      → 品牌
 * - XMP:rights       → 版权声明
 * - IPTC:Keywords    → 品牌、品类、城市、AI检测
 * - EXIF:ImageDescription → 同 description
 * - EXIF:Artist      → 品牌
 * - EXIF:Copyright   → 版权
 *
 * 用法：
 *   node scripts/iptc_embed.js photo.jpg --city 常州 --topic 男士油头
 *   node scripts/iptc_embed.js --batch "*.jpg" --city 上海
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { globSync } = require('fs');

// ═══ 品牌配置 ═══
const BRAND = '安柯耳 Airaquas';
const URL = 'airaquas.hair';
const SLOGAN = 'AI时代头皮健康护理专家';
const TAGLINE = 'Tony老师在店 · 城市美发圈';
const RESEARCH = 'KCNJ2钾离子通道研究(Cell 2025,陈婷团队)';
const COPYRIGHT = `©${BRAND} 原创版权，未经许可禁止盗用`;

function buildTitle(city, topic) {
  return `${city}_airaquas.hair_${topic}│原创`;
}

function buildDesc(city, topic, address) {
  let parts = [`${city}实体线下沙龙`];
  if (address) parts.push(address);
  parts.push(`主营${topic}、烫染定制、头皮健康管理`);
  parts.push(`原创造型设计。品牌${BRAND}(${URL})原创LOGO版权所有。`);
  parts.push(RESEARCH);
  return parts.join('，');
}

function buildKeywords(city, topic) {
  return ['安柯耳', 'Airaquas', city, topic, '头皮健康', 'AI检测', '脱发筛查', TAGLINE, URL]
    .filter(Boolean).join(', ');
}

/**
 * Embed IPTC/EXIF/XMP metadata into an image using sharp.
 * Sharp v0.34 supports withMetadata() for basic fields.
 * For full IPTC/XMP we write the buffer and inject metadata via raw arrays.
 */
async function embedMetadata(inputPath, options) {
  const { city = '常州', topic = '发型', address = '' } = options;

  const title = buildTitle(city, topic);
  const desc = buildDesc(city, topic, address);
  const keywords = buildKeywords(city, topic);

  // Read image
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const ext = path.extname(inputPath).toLowerCase();

  let outputPath = options.output;
  if (!outputPath) {
    const dir = path.dirname(inputPath);
    const name = path.basename(inputPath, ext);
    outputPath = path.join(dir, `${name}_embedded${ext}`);
  }

  // Build EXIF/XMP metadata object for Sharp
  const exifData = {
    IFD0: {
      ImageDescription: desc,
      Artist: BRAND,
      Copyright: COPYRIGHT,
      Software: `${BRAND} IPTC Embedder v1.0`,
    },
    ExifIFD: {
      UserComment: keywords,
      DateTimeOriginal: new Date().toISOString().replace(/[TZ]/g, ' ').substring(0, 19),
    },
    // GPS data will be handled by geo_layer.js
  };

  let output = image;
  const sharpMetadata = {};

  // XMP: title & description
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.tiff' || ext === '.webp') {
    sharpMetadata.icc = 'sRGB';
  }

  // Use withMetadata for supported fields
  output = output.withMetadata({
    exif: exifData,
    icc: 'sRGB',
    orientation: metadata.orientation || undefined,
  });

  await output.toFile(outputPath);

  // Post-process: inject raw XMP into JPEG
  if (ext === '.jpg' || ext === '.jpeg') {
    await injectXmpIntoJpeg(outputPath, title, desc, keywords);
  }

  // Also write a sidecar .xmp file for non-JPEG formats
  if (ext !== '.jpg' && ext !== '.jpeg') {
    writeSidecarXmp(outputPath, title, desc, keywords);
  }

  const size = fs.statSync(outputPath).size;
  console.log(`  ✅ ${path.basename(outputPath)} (${(size / 1024).toFixed(1)}KB)`);

  return { outputPath, title, desc };
}

/**
 * Inject raw XMP packet into JPEG using marker-based insertion.
 * JPEG marker 0xFFE1 (APP1) carries EXIF, we append a second APP1 for XMP.
 */
async function injectXmpIntoJpeg(jpegPath, title, desc, keywords) {
  const buf = fs.readFileSync(jpegPath);
  const xmpXml = buildXmpPacket(title, desc, keywords);
  const xmpBytes = Buffer.from(xmpXml, 'utf-8');

  // Build APP1 marker for XMP
  const app1Marker = Buffer.alloc(2 + 2 + xmpBytes.length);
  app1Marker.writeUInt16BE(0xFFE1, 0);    // APP1 marker
  app1Marker.writeUInt16BE(2 + xmpBytes.length, 2); // length
  xmpBytes.copy(app1Marker, 4);

  // Insert after SOI (first two bytes: 0xFFD8)
  const result = Buffer.concat([
    buf.slice(0, 2),       // SOI
    app1Marker,            // XMP APP1
    buf.slice(2),          // rest of file
  ]);

  fs.writeFileSync(jpegPath, result);
}

function buildXmpPacket(title, desc, keywords) {
  return `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/"
      xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
      xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${escXml(title)}</rdf:li></rdf:Alt></dc:title>
      <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${escXml(desc)}</rdf:li></rdf:Alt></dc:description>
      <dc:creator><rdf:Seq><rdf:li>${escXml(BRAND)}</rdf:li></rdf:Seq></dc:creator>
      <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${escXml(COPYRIGHT)}</rdf:li></rdf:Alt></dc:rights>
      <dc:subject><rdf:Bag>${keywords.split(', ').map(k => `<rdf:li>${escXml(k.trim())}</rdf:li>`).join('')}</rdf:Bag></dc:subject>
      <xmp:CreatorTool>${escXml(BRAND)} IPTC Embedder v1.0</xmp:CreatorTool>
      <xmpRights:Marked>True</xmpRights:Marked>
      <xmpRights:UsageTerms><rdf:Alt><rdf:li xml:lang="x-default">原创内容，未经许可禁止转载或商用</rdf:li></rdf:Alt></xmpRights:UsageTerms>
      <photoshop:Headline>${escXml(title)}</photoshop:Headline>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

function escXml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function writeSidecarXmp(filePath, title, desc, keywords) {
  const xmp = buildXmpPacket(title, desc, keywords);
  const sidecarPath = filePath + '.xmp';
  fs.writeFileSync(sidecarPath, xmp, 'utf-8');
  console.log(`  📎 ${path.basename(sidecarPath)} (XMP sidecar)`);
}

// ═══ CLI ═══
function printHelp() {
  console.log(`
安柯耳 EXIF/IPTC 语义嵌入工具 v1.0

用法:
  node scripts/iptc_embed.js photo.jpg --city 常州 --topic 男士油头 --address "新北区太湖路88号"
  node scripts/iptc_embed.js --batch "*.jpg" --city 上海

选项:
  --city      城市名（默认 常州）
  --topic     内容主题/品类
  --address   门店地址（可选）
  --output    输出路径（可选，默认源文件名_embedded）
  --batch     批量处理 glob 模式
  --help      本帮助
  `);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const opts = {};
  let files = [];

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--city': opts.city = args[++i]; break;
      case '--topic': opts.topic = args[++i]; break;
      case '--address': opts.address = args[++i]; break;
      case '--output': opts.output = args[++i]; break;
      case '--batch': {
        const pattern = args[++i];
        const { globSync } = require('fs');
        const glob = require('glob');
        const matches = glob.sync(pattern, { nodir: true });
        files.push(...matches);
        break;
      }
      default:
        if (!args[i].startsWith('--')) {
          files.push(args[i]);
        }
    }
  }

  if (files.length === 0) {
    console.error('❌ 未指定文件，使用 --help 查看用法');
    process.exit(1);
  }

  console.log(`\n📦 EXIF/IPTC 嵌入 — ${files.length} 个文件\n`);

  for (const f of files) {
    if (!fs.existsSync(f)) {
      console.error(`  ❌ 文件不存在: ${f}`);
      continue;
    }
    try {
      await embedMetadata(f, opts);
    } catch (e) {
      console.error(`  ❌ ${f}: ${e.message}`);
    }
  }

  console.log(`\n✅ 完成`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
