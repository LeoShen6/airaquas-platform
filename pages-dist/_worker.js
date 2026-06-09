// Simple test worker
export default {
  async fetch(request, env, ctx) {
    return new Response("WORKER_JS_ACTIVE", {
      headers: { 'content-type': 'text/plain' }
    });
  }
};
