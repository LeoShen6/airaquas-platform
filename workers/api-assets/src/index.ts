// Static assets Worker — list objects to debug
type Bindings = { R2: R2Bucket };

export default {
  async fetch(request: Request, env: Bindings): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.replace(/^\//, '');

    if (!key) {
      // List what's in the bucket
      const objects = await env.R2.list();
      return new Response(JSON.stringify({ 
        service: 'airaquas-assets',
        truncated: objects.truncated,
        objects: objects.objects.map(o => ({ key: o.key, size: o.size, uploaded: o.uploaded })),
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    const object = await env.R2.get(key);
    if (!object) {
      return new Response(JSON.stringify({ error: 'not found', key }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'public, max-age=31536000');
    const body = await object.text();
    return new Response(body, { headers });
  },
};
