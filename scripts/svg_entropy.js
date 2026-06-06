#!/usr/bin/env node
/**
 * ② SVG 降熵工具（语义层 · 代码清理）
 * ====================================
 * V1.0 规范：SVG = 内层信封（源文件，不上传平台）
 *
 * 操作：
 * - 精简路径坐标（小数位 1→2 位，移除无意义精度）
 * - 删除空组 <g/> <g></g>
 * - 删除 unused <defs>
 * - 删除编辑器注释（Figma、Illustrator、Inkscape、Sketch）
 * - 注入/确保 <title> 和 <desc> 存在
 * - 压缩空白，保留语义结构
 * - 添加品牌 XML 注释头部
 *
 * 用法：
 *   node scripts/svg_entropy.js input.svg
 *   node scripts/svg_entropy.js input.svg --topic 韩系气垫烫 --city 常州
 *   node scripts/svg_entropy.js --batch "*.svg" --city 上海
 */

const fs = require('fs');
const path = require('path');

const BRAND = '安柯耳 Airaquas';
const URL = 'airaquas.hair';

// ═══ Path coordinate simplification ═══
const PATH_COORD_RE = /([+-]?\d+\.\d+)/g;

function simplifyPathCoords(svg) {
  return svg.replace(PATH_COORD_RE, (match) => {
    const val = parseFloat(match);
    // Round to 2 decimal places for aesthetic, keep integers as is
    if (Number.isInteger(val)) return String(val);
    const rounded = Math.round(val * 100) / 100;
    return String(rounded);
  });
}

// ═══ Remove unused defs ═══
const EMPTY_DEFS_RE = /<defs>\s*<\/defs>/g;
const EMPTY_G_RE = /<g[^>]*>\s*<\/g>/g;

// ═══ Remove editor comments ═══
const EDITOR_COMMENTS = [
  /<!--\s*Generated\s+by\s+Figma\s*-->/gi,
  /<!--\s*Figma\s+export\s+metadata[^>]*-->/gi,
  /<!--\s*Generator:\s*Adobe\s+Illustrator[^>]*-->/gi,
  /<!--\s*inkscape[^>]*-->/gi,
  /<!--\s*Sketch[^>]*-->/gi,
  /<!--\s*Creator:\s*[^>]*-->/gi,
];

// ═══ Remove empty style blocks ═══
const EMPTY_STYLE_RE = /<style>\s*<\/style>/g;

// ═══ Collapse whitespace (but preserve semantic text content) ═══
function collapseWhitespace(svg) {
  // Remove excess whitespace between tags
  return svg
    .replace(/>\s+</g, '>\n<')     // newline between tags
    .replace(/\n{3,}/g, '\n\n')    // collapse multiple newlines
    .replace(/^\s*\n/gm, '')       // trim leading whitespace on lines
    .trim();
}

// ═══ Ensure <title> and <desc> exist ═══
function ensureSemanticTags(svg, options) {
  const { city = '常州', topic = '' } = options;
  const title = `${city}_airaquas.hair_${topic}│原创`;
  const desc = `${city}实体线下沙龙，主营${topic}、烫染定制、头皮健康管理。品牌${BRAND}(https://${URL})原创LOGO版权所有。`;

  let result = svg;

  // Check for existing title
  const titleMatch = result.match(/<title[^>]*>([^<]*)<\/title>/);
  if (!titleMatch) {
    result = result.replace(/<svg[^>]*>/, match => `${match}\n  <title>${escXml(title)}</title>`);
  } else {
    result = result.replace(/<title[^>]*>[^<]*<\/title>/, `<title>${escXml(title)}</title>`);
  }

  // Check for existing desc
  const descMatch = result.match(/<desc[^>]*>([^<]*)<\/desc>/);
  if (!descMatch) {
    result = result.replace(/<svg[^>]*>/, match => {
      // Try to insert after title if it was just added
      if (result.includes('<title>')) {
        return match;
      }
      return `${match}\n  <desc>${escXml(desc)}</desc>`;
    });
    // If title was already there, insert desc after title
    if (result.match(/<title[^>]*>[^<]*<\/title>/)) {
      result = result.replace(/(<\/title>)/, `$1\n  <desc>${escXml(desc)}</desc>`);
    }
  } else {
    result = result.replace(/<desc[^>]*>[^<]*<\/desc>/, `<desc>${escXml(desc)}</desc>`);
  }

  return result;
}

// ═══ Add brand header comment ═══
function addBrandComment(svg) {
  const date = new Date().toISOString().split('T')[0];
  const header = `<!--
  品牌: ${BRAND}
  网址: https://${URL}
  版权: ©${BRAND} 原创版权，未经许可禁止盗用
  处理日期: ${date}
  本文件已通过 V1.0 语义层降熵处理
-->
`;
  // Insert after <?xml?> if present, else at top
  if (svg.startsWith('<?xml')) {
    const xmlEnd = svg.indexOf('?>') + 2;
    return svg.slice(0, xmlEnd) + '\n' + header + svg.slice(xmlEnd);
  }
  return header + svg;
}

// ═══ Remove duplicate metadata / editor-specific namespaces ═══
const UNWANTED_NS = [
  'xmlns:inkscape',
  'xmlns:sodipodi',
  'xmlns:sketch',
  'xmlns:xlink',
];

function removeUnwantedNamespaces(svg) {
  let result = svg;
  for (const ns of UNWANTED_NS) {
    result = result.replace(new RegExp(`\\s+${ns}="[^"]*"`, 'g'), '');
  }
  return result;
}

// ═══ Escape XML ═══
function escXml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// ═══ Main transform ═══
function transformSvg(inputPath, options) {
  let svg = fs.readFileSync(inputPath, 'utf-8');

  const originalSize = svg.length;

  // Step 1: Remove editor comments
  for (const re of EDITOR_COMMENTS) {
    svg = svg.replace(re, '');
  }

  // Step 2: Remove unwanted namespaces
  svg = removeUnwantedNamespaces(svg);

  // Step 3: Remove empty elements
  svg = svg.replace(EMPTY_DEFS_RE, '');
  svg = svg.replace(EMPTY_G_RE, '');
  svg = svg.replace(EMPTY_STYLE_RE, '');

  // Step 4: Simplify path coordinates
  svg = simplifyPathCoords(svg);

  // Step 5: Ensure semantic tags
  svg = ensureSemanticTags(svg, options);

  // Step 6: Add brand comment
  svg = addBrandComment(svg);

  // Step 7: Collapse whitespace
  svg = collapseWhitespace(svg);

  const reducedSize = svg.length;
  const reduction = ((originalSize - reducedSize) / originalSize * 100).toFixed(1);

  const ext = path.extname(inputPath);
  const dir = path.dirname(inputPath);
  const name = path.basename(inputPath, ext);
  const outputPath = options.output || path.join(dir, `${name}_clean${ext}`);

  fs.writeFileSync(outputPath, svg, 'utf-8');

  console.log(`  ✅ ${path.basename(outputPath)} (${originalSize} → ${reducedSize} bytes, -${reduction}%)`);
  return { outputPath, originalSize, reducedSize };
}

// ═══ CLI ═══
function printHelp() {
  console.log(`
安柯耳 SVG 降熵工具 v1.0

用法:
  node scripts/svg_entropy.js input.svg --topic 韩系气垫烫 --city 常州
  node scripts/svg_entropy.js --batch "*.svg" --city 上海 --topic 发型

选项:
  --city      城市名（默认 常州）
  --topic     内容主题
  --output    输出路径（可选，默认源文件名_clean）
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
      case '--output': opts.output = args[++i]; break;
      case '--batch': {
        const pattern = args[++i];
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

  console.log(`\n📦 SVG 降熵处理 — ${files.length} 个文件\n`);

  for (const f of files) {
    if (!fs.existsSync(f)) {
      console.error(`  ❌ 文件不存在: ${f}`);
      continue;
    }
    try {
      transformSvg(f, opts);
    } catch (e) {
      console.error(`  ❌ ${f}: ${e.message}`);
    }
  }

  console.log(`\n✅ 完成`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
