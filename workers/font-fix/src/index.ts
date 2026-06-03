// ═══════════════════════════════════════════════════════════════════
//  font-fix Worker — 字体渲染优化中间层
//  部署在 airaquas.hair 前面，拦截所有 HTML 响应
//  注入抗锯齿 CSS  +  完善中文字体回退链
// ═══════════════════════════════════════════════════════════════════

export default {
  async fetch(request: Request): Promise<Response> {
    // 透传请求到源站
    const response = await fetch(request);
    const ct = response.headers.get('content-type') || '';

    // 只处理 HTML
    if (!ct.includes('text/html')) return response;

    const FONT_CSS = `
<style>
/* ══ 字体渲染优化（注入层）══ */
html, body {
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
  font-kerning: normal !important;
}
/* 完善中文字体回退链 — 覆盖各平台 */
body, button, input, select, textarea {
  font-family: -apple-system, BlinkMacSystemFont,
    'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei',
    'Hiragino Sans GB', 'Source Han Sans CN',
    sans-serif !important;
}
/* 小字号增强 — 深色背景浅色字容易发虚 */
.nav-link, .nav-counter, .hero-stat-label,
.section-label, .section-sub, .upload-hint,
.scan-sub, .scan-steps, .dimension-label,
.result-tip, .email-modal-desc, .product-tag,
.community-card-time, .community-card-stats,
.prod-link, .community-tab, .community-card-badge,
.network-emblem .count, .hero-badge,
.hero-sub, .brand-sub, footer .copy, footer .links a,
.form-hint, .form-error, .code-btn,
.email-status, .user-dropdown-item {
  -webkit-font-smoothing: antialiased !important;
  font-weight: 450 !important;
}
/* 修复极细字体在深色背景上的模糊 */
body {
  text-shadow: 0 0 1px rgba(255,255,255,0.01) !important;
}
</style>`;

    return new HTMLRewriter()
      .on('head', {
        element(el) {
          el.append(FONT_CSS, { html: true });
        }
      })
      .transform(response);
  }
};
