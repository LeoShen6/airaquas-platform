// Root Worker — handles ALL paths at airaquas.hair
// This overrides Cloudflare Pages for all routes
// Dynamic import of api-public Worker's Hono app
// We inline the api-public logic here for single-file deployment

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleDetect, handleDetectHistory } from './detect-service';
import { POSTER_HTML } from './poster-page';
import { SCALP_TYPES_HTML } from './scalp-types-page';
import { CITIES, generateCityPage, generateCityListHtml } from './salon-pages';
import { GUIDE_HTML } from './guide-page';
import { generateHomePage } from './home-page';
import { generateDetectPage } from './detect-page';

interface Env {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
  AI: Ai;
}

type Bindings = Env;

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

// Root — redesigned homepage
app.get('/', (c) => c.html(generateHomePage()));

// Content pages
app.get('/fenzhen', (c) => c.html(generateHomePage()));
app.get('/fenzhen/', (c) => c.html(generateHomePage()));
app.get('/guide', (c) => c.html(GUIDE_HTML));
app.get('/guide/', (c) => c.html(GUIDE_HTML));

// Detect page — redesigned
app.get('/detect', (c) => c.html(generateDetectPage()));
app.get('/detect/', (c) => c.html(generateDetectPage()));
app.get('/fenzhen/detect', (c) => c.html(generateDetectPage()));
app.get('/fenzhen/detect/', (c) => c.html(generateDetectPage()));

// ═══ POSTER GENERATOR ═══
app.get('/poster', (c) => c.html(POSTER_HTML));
app.get('/poster/', (c) => c.html(POSTER_HTML));

// ═══ 四型五维头皮自测指南 ═══
app.get('/scalp-types', (c) => c.html(SCALP_TYPES_HTML));
app.get('/scalp-types/', (c) => c.html(SCALP_TYPES_HTML));

// ═══ Salon 城市美发圈 ═══
app.get('/salon', (c) => c.html(generateCityListHtml()));
app.get('/salon/', (c) => c.html(generateCityListHtml()));
app.get('/salon/:slug', (c) => {
  const slug = c.req.param('slug');
  if (slug && slug in CITIES) {
    return c.html(generateCityPage(slug));
  }
  return c.redirect('/salon', 302);
});

// ═══ City salon data endpoint ═══
const CITY_SLUGS: Record<string, string> = {
  'tj':'天津','cq':'重庆','hz':'杭州','cd':'成都','wh':'武汉',
  'nj':'南京','xa':'西安','cs':'长沙','zz':'郑州','sy':'沈阳'
};
app.get('/salon/data/:file', async (c) => {
  const file = c.req.param('file');
  const slug = file.replace('.json','').replace(/-salon-tony/,'');

  // Try R2 first
  try {
    const obj = await c.env.R2.get('salon-data/' + file);
    if (obj) return c.json(JSON.parse(await obj.text()));
  } catch (_) {}

  // Fallback: read from Pages-deployed combined data
  try {
    const resp = await fetch('https://airaquas-hair.pages.dev/data/city_data.json');
    if (!resp.ok) throw new Error('fetch failed');
    const all = await resp.json();
    const cityName = CITY_SLUGS[slug];
    if (cityName && all.data?.[cityName]) return c.json(all.data[cityName]);
  } catch (_) {}

  return c.json({ error: 'no data', file }, 404);
}); 

// ═══ Backward compat: /tony/:slug → /salon/:slug ═══
app.get('/tony/:slug', (c) => {
  const slug = c.req.param('slug');
  return c.redirect('/salon/' + slug, 301);
});

// ═══ AI 护发指南 API ═══
app.post('/api/guide/generate', async (c) => {
  try {
    const body = await c.req.json() as {prompt?:string};
    const prompt = (body.prompt || '').trim();
    if (!prompt) return c.json({ code: 400, message: '请输入你的头发状况描述' }, 400);
    if (prompt.length > 500) return c.json({ code: 400, message: '描述过长' }, 400);

    const apiKey = c.env.DASHSCOPE_API_KEY;
    if (!apiKey) return c.json({ code: 500, message: 'AI 服务未配置' }, 500);

    const systemPrompt = '你是一个专业的护发顾问。用户会描述他们的头发或头皮状况，你需要根据描述生成一份个性化的护发指南。\\n\\n要求：\\n1. 分析用户的头发/头皮问题（简短分析）\\n2. 给出具体的护理建议（产品类型、使用频率、注意事项）\\n3. 建议日常护发习惯调整\\n4. 如有需要，建议进行专业检测\\n\\n回复风格：专业但易懂，分段清晰，用中文。不要用markdown格式，用纯文本。每个段落之间空一行。';

    const resp = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: { messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: '我的情况：' + prompt }
        ]},
        parameters: { result_format: 'message', temperature: 0.7, max_tokens: 1500 }
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('[guide] API error:', resp.status, errText);
      return c.json({ code: resp.status, message: 'AI 服务出错' }, 502);
    }

    const result = await resp.json() as any;
    const guide = result?.output?.choices?.[0]?.message?.content || '';
    if (!guide) return c.json({ code: 500, message: 'AI 未返回内容' }, 500);

    return c.json({ code: 0, data: { guide } });
  } catch (err: any) {
    console.error('[guide] Error:', err.message);
    return c.json({ code: 500, message: '生成失败: ' + err.message }, 500);
  }
});

// ═══ POSTER GENERATE API (阿里云百炼 Qwen-Image 2.0) ═══
// Qwen-Image uses the multimodal-generation endpoint
const DASHSCOPE_MULTI_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

app.post('/api/poster/generate', async (c) => {
  try {
    const body = await c.req.json() as {
      prompt: string;
      negative_prompt?: string;
      size?: string;
      n?: number;
      style?: string;
      session_id?: string;
    };

    if (!body.prompt || body.prompt.trim().length === 0) {
      return c.json({ code: 400, message: '请输入海报描述' }, 400);
    }
    if (body.prompt.length > 1000) {
      return c.json({ code: 400, message: '描述过长，请控制在1000字以内' }, 400);
    }

    const apiKey = c.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return c.json({ code: 500, message: 'AI 服务未配置 API Key' }, 500);
    }

    const sizeMap: Record<string, string> = {
      '3:4': '1728*2368', '9:16': '1728*3072', '16:9': '2688*1536', '1:1': '2048*2048',
    };
    const size = sizeMap[body.size || ''] || '2688*1536';
    const count = Math.min(Math.max(body.n || 2, 1), 4);

    const dashBody = {
      model: 'qwen-image-2.0',
      input: { messages: [{ role: 'user', content: [{ text: body.prompt }] }] },
      parameters: {
        size,
        n: count,
        prompt_extend: true,
        ...(body.negative_prompt ? { negative_prompt: body.negative_prompt } : {}),
      },
    };

    const resp = await fetch(DASHSCOPE_MULTI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dashBody),
      signal: AbortSignal.timeout(60000),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('[poster] DashScope API error:', resp.status, errText);
      return c.json({ code: resp.status, message: `AI 服务错误 (${resp.status})`, detail: errText.slice(0, 200) });
    }

    const result = await resp.json() as any;
    // DashScope returns image URLs directly
    const urls = result?.output?.choices?.[0]?.message?.content?.[0]?.image 
      ? [result.output.choices[0].message.content[0].image]
      : result?.urls || [];
    
    if (urls.length === 0) {
      return c.json({ code: 500, message: 'AI 未返回图片结果' });
    }

    // 返回 URL 直链（快且轻） + meta 数据
    const images = urls.slice(0, count).map((url: string) => ({
      url,
      meta: {
        title: '安柯耳 ' + (body.style || '时尚大片'),
        description: '安柯耳Airaquas AI生成' + (body.style || '时尚') + '海报 | 头皮护理品牌 | 护发海报',
        author: '安柯耳 Airaquas',
        copyright: '© 2026 安柯耳 Airaquas',
      }
    }));

    // === GEO: 元数据注入（best-effort EXIF/IPTC）===    
    const styleLabels: Record<string,string> = {
      fashion:'时尚大片',oriental:'东方美学',luxury:'暗黑轻奢',
      minimal:'极简高级',vintage:'华丽复古',product:'电商产品'
    };
    const styleName = styleLabels[body.style || ''] || '时尚海报';
    const geoMeta = {
      title: `安柯耳 ${styleName}`,
      description: `安柯耳Airaquas AI生成${styleName}海报 | 头皮护理品牌 | ${(body.prompt||'').slice(0,80)}`,
      author: '安柯耳 Airaquas',
      copyright: `© ${new Date().getFullYear()} 安柯耳 Airaquas`,
      filename_prefix: `安柯耳${styleName}${new Date().toISOString().slice(0,10).replace(/-/g,'')}`,
    };
    for (const img of images) {
      if (img.base64) {
        try {
          img.base64 = injectExifToJpeg(img.base64, geoMeta);
        } catch (e) {
          console.error('[exif] injection failed:', e);
        }
      }
      // 附加元数据字段供前端使用
      img.meta = { ...geoMeta };
    }

    return c.json({ code: 0, data: images });
  } catch (err: any) {
    console.error('[poster] Handler error:', err.message);
    return c.json({ code: 500, message: '生成失败: ' + err.message });
  }
});

// Poster API
app.get('/fenzhen/poster', (c) => {
  const s = c.req.query('s') || '78';
  const t = c.req.query('t') || 'mixed';
  return c.json({ code:0, data: { score: s, type: t, msg: 'ok' }});
});

// Status
app.get('/fenzhen/status', (c) => c.json({ ok: true, version: '3.3' }));

// Fallback: fenzhen pages
app.get('/fenzhen/:slug', (c) => c.html(generateHomePage()));
app.get('/fenzhen/:slug/', (c) => c.html(generateHomePage()));

export default app;
