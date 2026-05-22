// API Gateway — using Service Bindings for internal routing

// These are Service Bindings defined in wrangler.toml
// Bindings follow the naming: SVC_{service_name}
type Env = {
  SVC_AUTH: Fetcher;
  SVC_CRM: Fetcher;
  SVC_ORDER: Fetcher;
  SVC_INVENTORY: Fetcher;
  SVC_DIAGNOSIS: Fetcher;
  SVC_MARKETING: Fetcher;
  SVC_PROFIT: Fetcher;
  SVC_REPORT: Fetcher;
};

const SERVICES: Record<string, keyof Env> = {
  auth:      'SVC_AUTH',
  crm:       'SVC_CRM',
  order:     'SVC_ORDER',
  inventory: 'SVC_INVENTORY',
  diagnosis: 'SVC_DIAGNOSIS',
  marketing: 'SVC_MARKETING',
  profit:    'SVC_PROFIT',
  report:    'SVC_REPORT',
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (url.pathname === '/' || url.pathname === '/health') {
      const routes = Object.keys(SERVICES).map(k => ({
        name: k,
        url: `https://api.airaquas.hair/${k}`,
      }));
      return new Response(JSON.stringify({ service: 'airaquas-api-gateway', version: '3.0', routes }), {
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    // Route: /{service}/remainder → backend/remainder
    const parts = url.pathname.split('/').filter(Boolean);
    const service = parts[0];
    const binding = SERVICES[service];

    if (!binding) {
      return new Response(JSON.stringify({ error: 'unknown service', available: Object.keys(SERVICES) }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    // Create the downstream request with original path suffix
    const suffix = parts.slice(1).join('/');
    const internalUrl = 'https://internal/' + suffix + url.search;

    try {
      const svc = env[binding] as Fetcher;
      const resp = await svc.fetch(internalUrl, {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
      });

      const body = await resp.text();
      return new Response(body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: { ...Object.fromEntries(resp.headers), ...CORS },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'service binding error', detail: err.message, service }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }
  },
};
